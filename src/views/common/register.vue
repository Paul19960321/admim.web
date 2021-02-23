<template>
  <div>
    <CommonPage>
        <el-card class="register-form" v-if="step === 1 || step === 2">
            <h1 class="title" v-if="step === 1">注册</h1>
            <h1 class="title" v-else-if="step === 2">完成注册</h1>
            <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="120px">
                <el-form-item label="手机号码：" prop="mobile">
                    <el-input placeholder="请输入手机号码" :maxLength="16" v-model="registerForm.mobile" :disabled="step === 2"></el-input>
                </el-form-item>
                <template v-if="step === 1">
                    <el-form-item>
                        <el-button type="primary" class="block" @click="nextStep">下一步</el-button>
                    </el-form-item>
                    <el-form-item class="link-tips">
                        已有账号？直接<router-link to="/login">登录</router-link>
                    </el-form-item>
                </template>
                <div v-show="step === 2">
                    <el-form-item label="短信验证码：" prop="code">
                        <el-row>
                            <el-col :span="13">
                                <el-input placeholder="请输入验证码" :maxLength="6" v-model="registerForm.code"></el-input>
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
                        <el-input placeholder="请输入登录密码" v-popover:popover type="password" :maxLength="16" v-model="registerForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="submit" type="primary" class="block" @click="register">完成注册</el-button>
                    </el-form-item>
                    <el-form-item class="link-tips">
                        手机号码不正确？<el-button type="text" @click="prevStep">返回上一步</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card class="register-form result" v-if="step === 3" style="text-align: center;">
            <h1><i class="el-icon-success success-icon"></i></h1>
            <h3>恭喜您，您已成功注册账号啦！</h3>
            <h4>后续您可以直接使用手机号码进行登录，为了您更好地使用系统，请您及时完成实名认证哦~</h4>
            <el-button type="primary" @click="$router.replace('/login')">跳转登录</el-button>
        </el-card>
    </CommonPage>
  </div>
</template>

<script>
    import CommonPage from './common-page'
    import isEmpty from 'lodash/isEmpty'
    import { isMobile } from '@/utils/validate'
    
    export default {
      data () {
        var validateMobile = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('手机号码不能为空'))
          } else if (!isMobile(value)) {
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
          registerForm: {
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
          this.$refs['registerForm'].validateField('mobile', (err) => {
            if (isEmpty(err)) {
              this.step += 1
            }
          })
        },
        prevStep () {
          this.step -= 1
          this.$refs['registerForm'].resetFields()
        },
        // 发送验证码
        sendSms () {
          this.btnLoading = true
          this.$http({
            url: this.$http.adornUrl('/sms/send'),
            method: 'post',
            data: {
              'mobile': this.registerForm.mobile,
              'msgType': 0
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
        // 提交注册
        register () {
          this.$refs['registerForm'].validate((valid, err) => {
            if (valid) {
              this.submit = true
              this.$http({
                url: this.$http.adornUrl('/sys/user/register'),
                method: 'post',
                data: {
                  ...this.registerForm
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
  .register-form {
    width: 500px;
    margin: 100px auto;
  }
</style>