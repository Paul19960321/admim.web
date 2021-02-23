<template>
    <el-row>
        <el-col :span="12">
            <el-form label-width="150px" style="max-width: 500px; margin: 0 auto">
                <el-form-item label="统一社会信用代码：">
                    <span>{{registerCompany.tuscc}}</span>
                </el-form-item>
                <el-form-item label="企业名称：">
                    <span>{{registerCompany.name}}</span>
                </el-form-item>
                <el-form-item label="企业地址：">
                  <span>{{`${registerCompany.province || ''}${registerCompany.city || ''}${registerCompany.area || ''}${registerCompany.address || ''}`}}</span>
                </el-form-item>
                <el-form-item label="公司电话：">
                  <span>{{registerCompany.mobile}}</span>
                </el-form-item>
                <el-form-item label="法人姓名：">
                    <span>{{registerCompany.corporationName}}</span>
                </el-form-item>
                <el-form-item label="法人身份证号码：">
                    <span>{{registerCompany.corporationIDCard}}</span>
                </el-form-item>
                <el-form-item label="法人联系邮箱：">
                    <span>{{registerCompany.corporationMail}}</span>
                </el-form-item>
                <el-form-item label="法人手机号码：">
                    <span>{{registerCompany.corporationMobile}}</span>
                </el-form-item>
                <el-form-item style="text-align: right;">
                    企业信息有误？<el-button type="text" @click="$emit('prevStep')">返回更正</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12" style="text-align: center;" v-loading="loading">
          <canvas id="identity-qrcode" style="margin-top: 40px;">当前浏览器不支持canvas</canvas>
          <p>请您用手机扫码完成法人人脸识别验证！</p>
        </el-col>
    </el-row>
</template>

<script>
    import QRCode from 'qrcode'
    import assign from 'lodash/assign'
    let timer
    export default {
      data () {
        return {
          loading: false
        }
      },
      mounted () {
        this.refreshQrcode()
      },
      computed: {
        registerCompany: {
          get () { return this.$store.state.user.registerCompany },
          set (val) { this.$store.commit('user/updateRegisterCompany', val) }
        }
      },
      beforeDestroy () {
        clearTimeout(timer)
      },
      methods: {
        // 认证结果回调
        certificationCallback () {
          clearTimeout(timer)
          this.$http({
            url: this.$http.adornUrl(`/com/get/${this.registerCompany.id}`),
            method: 'get',
            errNotAlert: true
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.data && data.data.realName && data.data.realName.status === 2) {
                this.$http({
                  url: this.$http.adornUrl('/com/save'),
                  method: 'post',
                  data: assign(data.data, {
                    status: 2
                  })
                }).then(({data}) => {
                  if (data && data.code === 0 && data.data) {
                    this.$emit('nextStep')
                    this.registerCompany = data.data
                  }
                })
              } else {
                if (this.$route.name === 'company-register') {
                  timer = setTimeout(() => {
                    this.certificationCallback()
                  }, 2000)
                }
              }
            }
          })
        },
        // 获取认证url生成二维码
        refreshQrcode () {
          this.loading = true
          const _this = this
          const qrcodeDom = document.getElementById('identity-qrcode')
          if (this.registerCompany && this.registerCompany.realName && this.registerCompany.realName.url) {
            QRCode.toCanvas(qrcodeDom, this.registerCompany.realName.url, function (error) {
              _this.loading = false
              if (error) return false
              _this.certificationCallback()
            })
          } else {
            this.$http({
              url: this.$http.adornUrl(`/com/realname/${this.registerCompany.id}`),
              method: 'post'
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.data && data.data.url) {
                  QRCode.toCanvas(qrcodeDom, data.data.url, function (error) {
                    _this.loading = false
                    if (error) return false
                    _this.certificationCallback()
                  })
                }
              }
            })
          }
        }
      }
    }
</script>