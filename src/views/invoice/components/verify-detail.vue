<template>
    <el-dialog
    title="发票查验明细"
    width="1000px"
    top="24px"
    :visible.sync="visible"
    :append-to-body="true">
        <el-row :gutter="10">
            <el-col :span="8" class="desc-item">
                <span class="desc-label">发票代码：</span>
                <span class="desc-content">{{record.invoiceCode}}</span>
            </el-col>
            <el-col :span="8" class="desc-item">
                <span class="desc-label">发票号码：</span>
                <span class="desc-content">{{record.invoiceNumber}}</span>
            </el-col>
            <el-col :span="8" class="desc-item">
                <span class="desc-label">开票日期：</span>
                <span class="desc-content">{{$moment(record.invoiceIssueDate).format('YYYY年MM月DD日')}}</span>
            </el-col>
            <el-col :span="8" class="desc-item">
                <span class="desc-label">校验码：</span>
                <span class="desc-content">{{record.invoiceCheckCode}}</span>
            </el-col>
            <el-col :span="8" class="desc-item">
                <span class="desc-label">机器编码：</span>
                <span class="desc-content">{{record.invoiceMachineNumber}}</span>
            </el-col>
            <el-col :span="8" class="desc-item">
                <span class="desc-label">备注：</span>
                <span class="desc-content">{{record.remarks}}</span>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 20px;">
            <div class="desc-title">购买方</div>
            <table class="desc-table">
                <tr>
                    <td width="50%">
                        <span class="desc-label">名称：</span>
                        <span class="desc-content">{{record.invoiceBuyerName}}</span>
                    </td>
                    <td width="50%">
                        <span class="desc-label">纳税人识别号：</span>
                        <span class="desc-content">{{record.invoiceBuyerTaxpayerId}}</span>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                        <span class="desc-label">地址、电话：</span>
                        <span class="desc-content">{{record.invoiceBuyerAddrTell}}</span>
                    </td>
                    <td width="50%">
                       <span class="desc-label">开户行及账号：</span>
                        <span class="desc-content">{{record.invoiceBuyerBankAccount}}</span>
                    </td>
                </tr>
            </table>
        </el-row>
        <el-row>
            <div class="desc-title">商品明细</div>
            <el-table
                :data="record.inventories"
                border
                show-summary
                :summary-method="getSummaries"
                style="width: 100%; margin-bottom: 20px;">
                <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="货物或应税劳务、服务名称"
                minWidth="200px">
                </el-table-column>
                <el-table-column
                prop="specific"
                label="规格型号"
                header-align="center"
                align="center">
                </el-table-column>
                <el-table-column
                prop="unit"
                label="单位"
                header-align="center"
                align="center">
                </el-table-column>
                <el-table-column
                prop="amount"
                label="数量"
                header-align="center"
                align="center">
                </el-table-column>
                <el-table-column
                prop="unitPrice"
                header-align="center"
                align="center"
                label="单价">
                </el-table-column>
                <el-table-column
                prop="taxExclusive"
                header-align="center"
                align="center"
                label="金额">
                </el-table-column>
                <el-table-column
                header-align="center"
                align="center"
                label="税率"
                width="100px">
                <template slot-scope="scope">
                    {{`${parseFloat(scope.row.taxRate) * 100}%`}}
                </template>
                </el-table-column>
                <el-table-column
                prop="tax"
                header-align="center"
                align="center"
                label="税额">
                </el-table-column>
            </el-table>
        </el-row>
        <div class="desc-title">销售方</div>
        <table class="desc-table">
            <tr>
                <td width="50%">
                    <span class="desc-label">名称：</span>
                    <span class="desc-content">{{record.invoiceSellerName}}</span>
                </td>
                <td width="50%">
                    <span class="desc-label">纳税人识别号：</span>
                    <span class="desc-content">{{record.invoiceSellerTaxpayerId}}</span>
                </td>
            </tr>
            <tr>
                <td width="50%">
                    <span class="desc-label">地址、电话：</span>
                    <span class="desc-content">{{record.invoiceSellerAddrTell}}</span>
                </td>
                <td width="50%">
                    <span class="desc-label">开户行及账号：</span>
                    <span class="desc-content">{{record.invoiceSellerBankAccount}}</span>
                </td>
            </tr>
        </table>
    </el-dialog>
</template>

<script>
    import isEmpty from 'lodash/isEmpty'
    export default {
      name: 'verify-detail',
      data () {
        return {
          visible: false,
          record: {}
        }
      },
      methods: {
        // 初始化
        init (data) {
          this.visible = true
          this.$nextTick(() => {
            if (typeof data !== 'object') {
              data = JSON.parse(data)
            }
            if (data.model && data.model.items && !isEmpty(data.model.items)) {
              this.record = data.model.items[0].value
            }
          })
        },
        // 商品合计
        getSummaries () {
          const sums = []
          sums[0] = '合计'
          sums[5] = this.record.invoiceTaxExclusive
          sums[7] = this.record.invoiceTax
          return sums
        }
      }
    }
</script>

<style>
    .desc-title {
        margin-bottom: 20px;
        color: rgba(0,0,0,.85);
        font-weight: 700;
        font-size: 16px;
        line-height: 1.5;
    }
    .desc-item {
        padding-bottom: 16px;
    }
    .desc-label {
        color: rgba(0,0,0,.85);
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5;
    }
    .desc-content {
        color: rgba(0,0,0,.65);
        font-size: 14px;
        line-height: 1.5;
    }
    .desc-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
    }
    .desc-table td {
        padding: 10px;
    }
    .desc-table, .desc-table tr, .desc-table td {
        border: 1px solid #EBEEF5
    }
</style>