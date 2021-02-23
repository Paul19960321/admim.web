<template>
  <div>
    <CommonPage>
      <el-card class="password-find-form" v-if="step === 1 || step === 2">
          <h1 class="title" v-if="step === 1">找回密码</h1>
          <h1 class="title" v-else-if="step === 2">完成密码重置</h1>
          <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">
              <el-form-item label="手机号码：" prop="mobile">
                  <el-input placeholder="请输入手机号码" :maxLength="16" v-model="dataForm.mobile" :disabled="step === 2"></el-input>
              </el-form-item>
              <template v-if="step === 1">
                  <el-form-item>
                      <el-button type="primary" class="block" @click="nextStep">下一步</el-button>
                  </el-form-item>
              </template>
              <div v-show="step === 2">
                  <el-form-item label="短信验证码：" prop="code">
                      <el-row>
                          <el-col :span="13">
                              <el-input placeholder="请输入短信验证码" :maxLength="6" v-model="dataForm.code"></el-input>
                          </el-col>
                          <el-col :span="10" :offset="1">
                              <el-button :loading="btnLoading" type="primary" class="block" :disabled="countDown > 0" @click="sendSms">
                                  {{countDown > 0 ? `${countDown}秒后重试` : "获取验证码"}}
                              </el-button>
                          </el-col>
                      </el-row>
                  </el-form-item>
                  <el-form-item label="登录密码：" prop="password">
                      <el-popover
                          ref="popover"
                          placement="right"
                          width="200"
                          trigger="focus"
                          content="8~20位，字母/数字/标点符号至少包含2种，不允许输入空格或中文">
                      </el-popover>
                      <el-input placeholder="请输入登录密码" v-popover:popover type="password" :maxLength="16" v-model="dataForm.password"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button :loading="submit" type="primary" class="block" @click="resetPassword">完成密码重置</el-button>
                  </el-form-item>
                  <el-form-item class="link-tips">
                      手机号码不正确？<el-button type="text" @click="prevStep">返回上一步</el-button>
                  </el-form-item>
              </div>
          </el-form>
      </el-card>
      <el-card v-if="step === 3" style="text-align: center;" class="password-find-form result">
          <h1><i class="el-icon-success success-icon"></i></h1>
          <h3>恭喜您，您已成功重置密码啦！</h3>
          <h4>请您使用新密码进行登录吧~</h4>
          <el-button type="primary" @click="$router.replace('/login')">跳转登录</el-button>
      </el-card>
    </CommonPage>
  </div>
</template>

<script>
    import CommonPage from './common-page'
    import isEmpty from 'lodash/isEmpty'
    
    export default {
      data () {
        var validateMobile = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('手机号码不能为空'))
          } else if (!/^1\d{10}$/.test(value)) {
            callback(new Error('请输入正确的手机号码'))
          } else {
            callback()
          }
        }
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('登录密码不能为空'))
          } else if (!/^(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,20}$/.test(value)) {
            callback(new Error('请输入正确的密码格式'))
          } else {
            callback()
          }
        }
        return {
          step: 1,
          dataForm: {
            mobile: '',
            code: '',
            password: ''
          },
          btnLoading: false,
          submit: false,
          countDown: 0,
          rules: {
            mobile: [{
              required: true,
              message: '手机号码不能为空'
            }, {
              validator: validateMobile,
              trigger: 'change'
            }],
            code: [{
              required: true,
              message: '短信验证码不能为空'
            }],
            password: [{
              required: true,
              message: '登录密码不能为空'
            }, {
              validator: validatePass,
              trigger: 'change'
            }]
          }
        }
      },
      components: {
        CommonPage
      },
      methods: {
        nextStep () {
          this.$refs['dataForm'].validateField('mobile', (err) => {
            if (isEmpty(err)) {
              this.step += 1
            }
          })
        },
        prevStep () {
          this.step -= 1
          this.$refs['dataForm'].resetFields()
        },
        // 发送验证码
        sendSms () {
          this.btnLoading = true
          this.$http({
            url: this.$http.adornUrl('/sms/send'),
            method: 'post',
            data: {
              'mobile': this.dataForm.mobile,
              'msgType': 1
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success('发送成功')
              this.countDown = 120
              const _this = this
              let timer = setInterval(function () {
                if (_this.countDown > 0) {
                  _this.countDown -= 1
                } else {
                  clearInterval(timer)
                }
              }, 1000)
              this.$once('hook:beforeDestroy', () => {
                clearInterval(timer)
              })
            }
          }).finally(() => {
            this.btnLoading = false
          })
        },
        // 提交
        resetPassword () {
          this.$refs['dataForm'].validate((valid, err) => {
            if (valid) {
              this.submit = true
              this.$http({
                url: this.$http.adornUrl('/app/changePwd'),
                method: 'post',
                data: {
                  ...this.dataForm
                }
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.step = 3
                }
              }).finally(() => {
                this.submit = false
              })
            }
          })
        }
      }
    }
</script>

<style lang="scss">
  .password-find-form {
    width: 500px;
    margin: 100px auto;
  }
</style>