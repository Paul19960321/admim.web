<template>
    <div v-if="companyInfo">
      <el-row>
        <el-col :span="12" style="padding: 0 20px;">
          <h3 class="section-title">公司信息</h3>
            <el-form label-position="left" label-width="150px">
                <el-form-item label="企业名称：">
                    {{companyInfo.name ? companyInfo.name : '-'}}
                </el-form-item>
                <el-form-item label="统一社会信用代码：">
                    {{companyInfo.tuscc || '-'}}
                </el-form-item>
                <el-form-item label="法人姓名：">
                    {{companyInfo.corporationName || '-'}}
                </el-form-item>
                <el-form-item label="公司电话：">
                    {{companyInfo.mobile || '-'}}
                </el-form-item>
                <el-form-item label="公司地址：">
                    {{`${companyInfo.province || ''}${companyInfo.city || ''}${companyInfo.area || ''}${companyInfo.address || ''}`}}
                </el-form-item>
                <el-form-item label="公司银行开户行：">
                  {{companyInfo.bank || '-'}}
                </el-form-item>
                <el-form-item label="公司银行账号：">
                    {{companyInfo.bankAccount || '-'}}
                </el-form-item>
                <el-form-item label="开户行地区：">
                    {{companyInfo.bankAddress || '-'}}
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12" style="padding: 0 20px;">
          <h3 class="section-title">业务开通申请</h3>
            <el-form label-position="left" label-width="150px">
                <!-- <el-form-item label="电子发票业务：">
                <span v-if="companyInfo.openInvoice === 0">未开通</span>
                <span v-else-if="companyInfo.openInvoice === 1">申请中</span>
                <span v-else-if="companyInfo.openInvoice === 2">未通过</span>
                <span v-else-if="companyInfo.openInvoice === 3">已开通</span>
                <el-button v-if="companyInfo.openInvoice === 0 || companyInfo.openInvoice === 2" type="text" style="margin-left: 15px;" @click="applyInvoiceHandle">申请开通</el-button>
                </el-form-item> -->
                <el-form-item label="电子合同业务：">
                <span v-if="companyInfo.openContract === 0">未开通</span>
                <span v-else-if="companyInfo.openContract === 1">申请中</span>
                <span v-else-if="companyInfo.openContract === 2">未通过</span>
                <span v-else-if="companyInfo.openContract === 3">已开通</span>
                <el-button v-if="companyInfo.openContract === 3" type="text" style="margin-left: 15px;">查看盖章员</el-button>
                </el-form-item>
            </el-form>
        </el-col>
      </el-row>
    </div>
</template>
  
<script>
    export default {
      props: {
        companyInfo: Object
      },
      methods: {
        applyInvoiceHandle () {
          this.$confirm('提交申请开通电子发票业务之后，平台工作人员审核通过即可正常使用，请您留意审核通知信息!', '业务开通申请', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
          }).catch()
        }
      }
    }
</script>
  
  