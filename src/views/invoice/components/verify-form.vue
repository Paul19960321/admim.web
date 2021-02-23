<template>
    <el-dialog
        title="发票查验"
        width="500px"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :append-to-body="true">
        <div v-loading="uploading">
          <el-form :model="verifyForm" style="width: 420px;margin: 0 auto" :rules="dataRule" ref="verifyForm" label-width="120px">
            <el-form-item label="文件上传查验：">
              <el-upload
                  accept=".pdf,.jpg"
                  :headers="{token: $cookie.get('token')}"
                  :action="`${baseUrl}/sys/oss/upload?token=${$cookie.get('token')}`"
                  :limit="1"
                  :on-remove="() => fileList=[]"
                  :on-success="handleSuccess"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">上传需要查验的发票文件，支持PDF、JPG、PNG格式</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="发票种类：" prop="recordInvoiceLine">
                <el-select @change="$refs['verifyForm'].clearValidate(['checkCode', 'bhsje'])"
                    v-model="verifyForm.recordInvoiceLine"
                    placeholder="请选择发票种类" style="width: 100%;">
                    <el-option label="增值税普通发票含电子" :value="0"></el-option>
                    <el-option label="增值税专用发票/机动车票" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发票代码：" prop="fpdm">
                <el-input :maxLength="30" placeholder="请输入发票代码" v-model="verifyForm.fpdm"></el-input>
            </el-form-item>
            <el-form-item label="发票号码：" prop="fphm">
                <el-input :maxLength="30" v-model="verifyForm.fphm" placeholder="请输入发票号码"></el-input>
            </el-form-item>
            <el-form-item label="开票时间：" prop="kpTime">
               <el-date-picker
                    v-model="verifyForm.kpTime"
                    placeholder="请选择开票时间"
                    style="width: 100%;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="校验码后6位：" v-if="verifyForm.recordInvoiceLine === 0" prop="checkCode">
                <el-input v-model="verifyForm.checkCode" placeholder="请输入校验码后6位"></el-input>
            </el-form-item>
            <el-form-item label="不含税金额：" v-else-if="verifyForm.recordInvoiceLine === 1" prop="bhsje">
                <el-input v-model="verifyForm.bhsje" placeholder="请输入不含税金额"></el-input>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="submit || uploading" type="primary" @click="onSubmit()">查验</el-button>
      </span>
    </el-dialog>
</template>
  
<script>
    export default {
      data () {
        return {
          uploading: false,
          visible: false,
          submit: false,
          verifyForm: {
            recordInvoiceLine: 0,
            fpdm: '',
            fphm: '',
            kpTime: '',
            checkCode: '',
            bhsje: ''
          },
          fileList: [],
          dataRule: {
            recordInvoiceLine: [{
              required: true,
              message: '发票种类不能为空'
            }],
            fpdm: [{
              required: true,
              message: '发票代码不能为空'
            }],
            fphm: [{
              required: true,
              message: '发票号码不能为空'
            }],
            kpTime: [{
              required: true,
              message: '开票时间不能为空'
            }],
            checkCode: [{
              required: true,
              message: '校验码后6位不能为空'
            }],
            bhsje: [{
              required: true,
              message: '不含税金额不能为空'
            }]
          }
        }
      },
      computed: {
        baseUrl: function () {
          return window.SITE_CONFIG.baseUrl
        }
      },
      methods: {
        // 初始化
        init (data) {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['verifyForm'].resetFields()
            this.fileList = []
          })
        },
        // 表单提交
        onSubmit () {
          this.$refs['verifyForm'].validate((valid) => {
            if (valid) {
              this.submit = true
              this.$http({
                url: this.$http.adornOperateUrl('/record/submit'),
                method: 'post',
                data: this.verifyForm
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  this.visible = false
                  this.$emit('refresh')
                }
              }).finally(() => {
                this.submit = false
              })
            }
          })
        },
        handleSuccess (response, file, fileList) {
          if (response.data && response.data.url) {
            this.uploading = true
            this.$http({
              url: this.$http.adornOperateUrl('/record/vat'),
              data: {
                url: response.data.url
              },
              method: 'post'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.visible = false
                this.$emit('refresh')
              } else {
                this.fileList = []
              }
            }).finally(() => {
              this.uploading = false
            })
          }
        }
      }
    }
</script>
