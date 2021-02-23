<template>
  <div v-loading="loading">
    <CommonPage>
      <el-card v-if="step === 1" class="identity-form">
        <h1 class="title">实名认证</h1>
        <h4 style="text-align: center;">为了您更好地使用系统，请您先完成实名认证~</h4>
        <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
            <el-form-item label="姓名：" prop="name">
                <el-input placeholder="请输入真实姓名" :maxLength="20" v-model="dataForm.name"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
                <el-input placeholder="请输入身份证号" :maxLength="18" v-model="dataForm.idCard"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="submit" type="primary" class="block" @click="onSubmit">下一步</el-button>
            </el-form-item>
        </el-form>
      </el-card>
      <el-card v-if="step === 2" class="identity-form" style="width: 1000px;">
        <el-row>
          <el-col :span="12">
            <h1 class="title">实名认证</h1>
            <h4 style="text-align: center;">为了您更好地使用系统，请您先完成实名认证~</h4>
            <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
                <el-form-item label="姓名：" prop="name">
                  <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idCard">
                  <span>{{dataForm.idCard}}</span>
                </el-form-item>
                <el-form-item style="text-align: right;">
                  <span>身份证信息有误？<el-button type="text" @click="modifyInfo">返回更正</el-button></span>
                </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" style="text-align: center;">
            <canvas id="identity-qrcode">当前浏览器不支持canvas</canvas>
            <p>请您用手机扫码完成人脸识别验证！<el-button @click="refreshQrcode" type="text">点击刷新</el-button></p>
          </el-col>
        </el-row>
      </el-card>
      <el-card v-if="step === 3" style="text-align: center;" class="identity-form result">
        <h1><i class="el-icon-success success-icon"></i></h1>
        <h3>恭喜您已成功完成实名认证啦！</h3>
        <el-button type="primary" @click="$router.replace('/user')">进入个人中心</el-button>
      </el-card>
    </CommonPage>
  </div>
</template>

<script>
    import CommonPage from './common-page'
    import QRCode from 'qrcode'
    import { isIdCard } from '@/utils/validate'
    let timer
    export default {
      data () {
        var validateIdCard = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('身份证号不能为空'))
          } else if (!isIdCard(value)) {
            callback(new Error('请输入正确的身份证号'))
          } else {
            callback()
          }
        }
        return {
          loading: false,
          step: 1,
          dataForm: {
            name: '',
            idCard: ''
          },
          submit: false,
          rules: {
            name: [{
              required: true,
              message: '姓名不能为空'
            }],
            idCard: [{
              required: true,
              message: '身份证号不能为空'
            }, {
              validator: validateIdCard,
              trigger: 'change'
            }]
          }
        }
      },
      computed: {
        baseUrl: function () {
          return window.SITE_CONFIG.baseUrl
        },
        userRealName: {
          get () { return this.$store.state.user.userRealName },
          set (val) { this.$store.commit('user/updateUserRealName', val) }
        }
      },
      mounted () {
        if (!this.userRealName) {
          this.getUserInfo()
        }
      },
      components: {
        CommonPage
      },
      beforeDestroy () {
        clearTimeout(timer)
      },
      methods: {
        certificationCallback () {
          clearTimeout(timer)
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info`),
            method: 'get'
          }).then(({data}) => {
            if (data.user.realName) {
              this.$message.success('认证成功，正在跳转')
              setTimeout(() => {
                this.$router.replace('/user')
              }, 2000)
            } else {
              if (this.$route.name === 'user-certification') {
                timer = setTimeout(() => {
                  this.certificationCallback()
                }, 2000)
              }
            }
          })
        },
        refreshQrcode () {
          this.submit = true
          this.$http({
            url: this.$http.adornUrl('/sys/user/realname/save'),
            method: 'post',
            data: {
              ...this.dataForm
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              const _this = this
              this.step = 2
              this.$nextTick(() => {
                var qrcodeDom = document.getElementById('identity-qrcode')
                QRCode.toCanvas(qrcodeDom, data.data.url, function (error) {
                  if (error) return
                  _this.certificationCallback()
                })
              })
            }
          }).finally(() => {
            this.submit = false
          })
        },
        // 提交
        onSubmit () {
          this.$refs['dataForm'].validate((valid, err) => {
            if (valid) {
              this.refreshQrcode()
            }
          })
        },
        modifyInfo: function () {
          this.step = 1
          clearTimeout(timer)
        },
        // 获取当前管理员信息
        getUserInfo () {
          this.$http({
            url: this.$http.adornUrl('/sys/user/info'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.user.sysUserType === 1 && data.user.realName) {
                this.$router.replace({ name: 'home' })
              }
            }
          })
        }
      }
    }
</script>

<style lang="scss">
  .identity-form {
    width: 500px;
    margin: 100px auto;
  }
  #identity-qrcode {
    margin: 20px auto;
  }
</style>