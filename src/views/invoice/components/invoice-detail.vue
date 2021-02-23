<template>
    <el-dialog
    title="开票明细"
    width="1248px"
    top="24px"
    :visible.sync="visible"
    :append-to-body="true">
    <div class="invoice-detail">
        <div class="invoice-inner">
            <div class="invoice-title">
                <dl>
                    <dd><em class="f-brown">发票代码：</em>
                    {{record.fpCode}}
                    </dd>
                    <dd><em class="f-brown">发票号码：</em>
                    {{record.fpNumber}}
                    </dd>
                    <dd><em class="f-brown">开票日期：</em>
                    {{$moment(record.invoiceTime).format('YYYY年MM月DD日')}}
                    </dd>
                </dl>
                <span class="f-brown" style="font-size: 20px; font-weight: 600; position: absolute; top: 20px; left: 20px; transform: rotate(-45deg)">
                    <span v-if="record.kpStatus === 2">开票完成</span>
                    <span v-else-if="record.kpStatus === 3">发票已作废</span>
                    <span v-else-if="record.kpStatus === 20">开票中</span>
                    <span v-else-if="record.kpStatus === 21">开票成功签章中</span>
                    <span v-else-if="record.kpStatus === 22">开票失败</span>
                    <span v-else-if="record.kpStatus === 24">开票成功签章失败</span>
                    <span v-else-if="record.kpStatus === 31">发票作废中</span>
                </span>
                <h3>
                    <span>
                        <em>
                            <span id="invoice-zhang"></span>
                            <span v-if="record.invLine === 0">增值税电子普通发票</span>
                            <span v-else-if="record.invLine === 1">增值税普通发票（纸票）</span>
                            <span v-else-if="record.invLine === 2">增值税专用发票</span>
                            <span v-else-if="record.invLine === 3">收购发票（电子）</span>
                            <span v-else-if="record.invLine === 4">收购发票（纸质）</span>
                            <span v-else-if="record.invLine === 5">增值税普通发票（卷式）</span>
                        </em>
                    </span>
                </h3>
            </div>
            <table class="detail-table">
                <tbody>
                    <tr>
                        <th style="width: 24px">购买方</th>
                        <td style="width: 50%">
                            <div class="input-item">
                                <label class="table-label"><span>名称</span>：</label>
                                <span class="input-wrap">
                                    <span>{{record.buyName}}</span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>纳税人识别号</span>：</label>
                                <span class="input-wrap">
                                    <span>{{record.buyTaxNum}}</span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>地址</span>：</label>
                                <span class="input-wrap">
                                    <span>{{record.buyAddress}}</span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>开户行及账号</span>：</label>
                                <span class="input-wrap">
                                    <span :title="`${record.buyBank || ''}${record.buyBankAccount || ''}`">{{`${record.buyBank || ''}${record.buyBankAccount || ''}`}}</span>
                                </span>
                            </div>
                        </td>
                        <th style="width: 24px">通知到</th>
                        <td>
                            <div class="input-item">
                                <label class="table-label"><span>手机号码</span>：</label>
                                <span class="input-wrap">
                                    <span>{{record.mobile}}</span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>邮箱地址</span>：</label>
                                <span class="input-wrap">
                                    <span>{{record.email}}</span>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="invoice-grid">
                <table class="datagrid-table">
                    <colgroup>
                        <col width="24px" />
                        <col width="22%" />
                        <col width="10%" />
                        <col width="6%" />
                        <col width="10%" />
                        <col width="14%" />
                        <col width="14%" />
                        <col width="8%" />
                    </colgroup>
                    <thead class="datagrid-thead">
                        <tr class="table-row">
                            <th style="border-right: 1px solid #e6e6e6">
                                
                            </th>
                            <th style="border-left: 0">
                                <span class="cell-text">*简称*货物或应税劳务、服务名称</span>
                            </th>
                            <th>
                                <span class="cell-text">规格型号</span>
                            </th>
                            <th>
                                <span class="cell-text">单位</span>
                            </th>
                            <th>
                                <span class="cell-text">数量</span>
                            </th>
                            <th>
                                <span class="cell-text">单价</span>
                            </th>
                            <th>
                                <span class="cell-text">金额</span>
                            </th>
                            <th>
                                <span class="cell-text">税率</span>
                            </th>
                            <th>
                                <span class="cell-text">税额</span>
                            </th>
                        </tr>
                    </thead>
                </table>
                <div :style="{maxHeight: '228px', overflowY: 'auto', marginRight: record.productDtos && record.productDtos.length > 8 ? `-${scrollBarWidth}px` : 0}">
                    <table class="datagrid-table">
                        <colgroup>
                            <col width="24px" />
                            <col width="22%" />
                            <col width="10%" />
                            <col width="6%" />
                            <col width="10%" />
                            <col width="14%" />
                            <col width="14%" />
                            <col width="8%" />
                        </colgroup>
                        <tbody>
                            <tr v-if="record.productDtos && record.productDtos.length > 0" v-for="item in record.productDtos">
                                <td style="border-right: 1px solid #e6e6e6">
                                    <span class="cell-text">
                                        
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="item.name">
                                        {{item.name}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="item.spec">
                                        {{item.spec}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="item.unit">
                                        {{item.unit}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="item.num">
                                        {{item.num}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="item.price">
                                        {{item.price}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="item.taxAmt">
                                        {{item.num * item.price}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" :title="`${item.taxRate * 100}%`">
                                        {{`${item.taxRate * 100}%`}}
                                    </span>
                                </td>
                                <td>
                                    <span class="cell-text" title={item.tax}>
                                        {{item.tax}}
                                    </span>
                                </td>
                            </tr> 
                            <tr v-else>
                                <td style="border-right: 1px solid #e6e6e6">
                                    <span class="cell-text"></span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <table class="datagrid-table">
                    <colgroup>
                        <col width="24px" />
                        <col width="22%" />
                        <col width="10%" />
                        <col width="6%" />
                        <col width="10%" />
                        <col width="14%" />
                        <col width="14%" />
                        <col width="8%" />
                    </colgroup>
                    <tbody>
                        <tr style="text-align: center">
                            <td style="border-right: 1px solid #e6e6e6">
                                <span class="cell-text"></span>
                            </td>
                            <td class='f-brown'>
                                <span class="cell-text f-brown">合计</span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{totalPrice}}</td>
                            <td></td>
                            <td>{{totalTax}}</td>
                        </tr>
                        <tr style="border: 2px solid #9e5209; color: #9e5209">
                            <td :colSpan="2">
                                <span class="cell-text">价税合计(大写)</span>
                            </td>
                            <td :colSpan="7">
                                <span class="cell-text" style="width: 50%; float: left">
                                    {{priceParseChina}}
                                </span>
                                <span class="cell-text" style="width: 50%; float: left">(小写){{totalPrice + totalTax}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <table class="detail-table">
                <tbody>
                    <tr>
                        <th style="width: 24px">销售方</th>
                        <td style="width: 50%">
                            <div class="input-item">
                                <label class="table-label"><span>名称</span>：</label>
                                <span class="input-wrap">
                                    <span :title="record.saleEnterpriseName">{{record.saleEnterpriseName}}</span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>纳税人识别号</span>：</label>
                                <span class="input-wrap">
                                    <span :title="record.saleTaxnum">{{record.saleTaxnum}}</span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>地址</span>：</label>
                                <span class="input-wrap">
                                    <span style="width: 270px; float: left">
                                        <span :title="record.saleAddress">{{record.saleAddress}}</span>
                                    </span>
                                    <label class="table-label" style="width: auto"><span style="width: auto">电话</span>：</label>
                                    <span class="input-wrap" style="padding-left: 0; margin-left: 0; width: 150px">
                                        <span :title="record.salePhone">{{record.salePhone}}</span>
                                    </span>
                                </span>
                            </div>
                            <div class="input-item">
                                <label class="table-label"><span>开户行及账号</span>：</label>
                                <span class="input-wrap">
                                    <span :title="`${record.saleEnterpriseBankName || ''}${record.saleEnterpriseBankAccount || ''}`">{{`${record.saleEnterpriseBankName || ''}${record.saleEnterpriseBankAccount || ''}`}}</span>
                                </span>
                            </div>
                        </td>
                        <th style="width: 24px">备注</th>
                        <td style="padding: 10px">
                            {{record.remark}}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="invoice-bottom">
                <el-row>
                    <el-col :span="6">
                        <label class="table-label">收款人 :</label>
                        <span class="input-wrap">
                            {{record.payee}}
                        </span>
                    </el-col>
                    <el-col :span="6">
                        <label class="table-label">复核 :</label>
                        <span class="input-wrap">
                            {{record.checker}}
                        </span>
                    </el-col>
                    <el-col :span="6">
                        <label class="table-label">开票人 :</label>
                        <span class="input-wrap">
                            {{record.clerk}}
                        </span>
                    </el-col>
                    <el-col :span="6">
                        <label class="table-label">销售方 :</label>
                        <span class="input-wrap f-brown">
                            （章）
                        </span>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div> 
    <span slot="footer" class="dialog-footer">
        <template v-if="record.applyStatus === 2">
            <el-button type="primary" v-if="record.kpStatus === 2 || record.kpStatus === 3" @click="() => {
                visible = false
                $emit('previewPDF', record.id)
            }">查看发票</el-button>
            <el-button type="warning" v-if="record.kpStatus === 2 && !record.deleted && record.invLine !== 0" @click="deleteInvoice">作废</el-button>
            <el-button type="danger" v-if="record.kpStatus === 2 && record.kpType === 1 && !record.rushed" @click="applyRedInvoice">冲红</el-button>
            
        </template>
        <el-button @click="visible = false">关闭</el-button>
    </span>
    </el-dialog>
</template>

<script>
    import { scrollbarWidth, numberParseChina } from '@/utils'
    import reduce from 'lodash/reduce'
    export default {
      name: 'invoice-detail',
      data () {
        return {
          visible: false,
          record: {
            fpCode: '',
            fpNumber: '',
            invoiceTime: '',
            kpStatus: '',
            invLine: '',
            buyName: '',
            buyTaxNum: '',
            buyAddress: '',
            buyBank: '',
            buyBankAccount: '',
            mobile: '',
            email: '',
            productDtos: [],
            saleEnterpriseName: '',
            saleTaxnum: '',
            saleAddress: '',
            salePhone: '',
            saleEnterpriseBankName: '',
            saleEnterpriseBankAccount: '',
            remark: '',
            payee: '',
            checker: '',
            clerk: ''
          }
        }
      },
      computed: {
        scrollbarWidth: () => scrollbarWidth(),
        priceParseChina: function () {
          return numberParseChina(this.totalPrice + this.totalTax)
        },
        totalPrice: function () {
          return Number(reduce(this.record.productDtos, (total, obj) => {
            return total + (obj.price || 0)
          }, 0).toFixed(2))
        },
        totalTax: function () {
          return Number(reduce(this.record.productDtos, (total, obj) => {
            return total + (obj.tax || 0)
          }, 0).toFixed(2))
        }
      },
      methods: {
        // 初始化
        init (data) {
          this.visible = true
          this.$nextTick(() => {
            this.record = data
          })
        },
        // 作废发票
        deleteInvoice () {
          this.$confirm('作废当前发票?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornOperateUrl(`/invoice/invalid/${this.record.id}`),
              method: 'post'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('提交成功')
              }
            })
          }).catch(() => {})
        },
        // 冲红发票
        applyRedInvoice () {
          this.$confirm('冲红当前发票?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornOperateUrl(`/invoice/redTicket/${this.record.id}`),
              method: 'post'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('提交成功')
              }
            })
          }).catch(() => {})
        }
      }
    }
</script>