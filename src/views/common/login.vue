<template>
  <div>
    <CommonPage>
      <div class="brand-info">
        <h2 class="brand-info__text">麦昇区块链供应链金融供应商业务平台</h2>
        <p class="brand-info__intro">链接未来，高效周转</p>
      </div>
      <div class="login-main">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="密码登录" name="first">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
              <el-form-item prop="userName">
                <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="dataForm.captcha" placeholder="验证码">
                    </el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="">
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="验证码登录" name="second">
            <el-form :model="smsLoginForm" :rules="smsLoginFormRule" ref="smsLoginForm" @keyup.enter.native="dataFormSubmit()" status-icon>
              <el-form-item prop="mobile">
                <el-input v-model="smsLoginForm.mobile" placeholder="手机号码"></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="smsLoginForm.code" placeholder="验证码">
                    </el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <el-button :loading="btnLoading" type="primary" class="block" :disabled="countDown > 0" @click="sendSms">
                      {{countDown > 0 ? `${countDown}秒后重试` : "获取验证码"}}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button class="block" style="margin-top: 96px;" type="primary" @click="smsLoginFormSubmit()">登录</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="login-bottom">
          <router-link to="password-find">忘记密码？</router-link>
          <router-link to="/register" style="float: right;">立即注册</router-link>
        </div>
      </div>
    </CommonPage>
    <el-dialog
      title="提示"
      width="500px"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false">
      <div style="text-align: center;">
        <span>系统检测到您的账号已关联多家企业，请选择需要登录的企业！</span>
        <el-select v-model="currentCompanyId" placeholder="请选择需要登录的企业" style="margin-top: 30px; width: 300px;">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="currentCompanyConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import CommonPage from './common-page'
  import { getUUID } from '@/utils'
  import filter from 'lodash/filter'
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
      return {
        dialogVisible: false,
        currentCompanyId: '',
        activeTab: 'first',
        btnLoading: false,
        countDown: 0,
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        smsLoginForm: {
          mobile: '',
          code: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        smsLoginFormRule: {
          mobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'change' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    components: {
      CommonPage
    },
    created () {
      this.getCaptcha()
      this.$http.get(`https://sp0.tianyancha.com/search/suggestV2.json?key=1`)
    },
    computed: {
      companyList: {
        get () { return this.$store.state.user.companyList },
        set (val) { this.$store.commit('user/updateCompanyList', val) }
      }
    },
    methods: {
      // 发送验证码
      sendSms () {
        this.$refs['smsLoginForm'].validateField('mobile', err => {
          if (!err) {
            this.btnLoading = true
            this.$http({
              url: this.$http.adornUrl('/sms/send'),
              method: 'post',
              data: {
                'mobile': this.smsLoginForm.mobile,
                'msgType': 3
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
          }
        })
      },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: {
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              }
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$http({
                  url: this.$http.adornUrl('/com/all'),
                  method: 'get'
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    if (data.data) {
                      // 已注册多家公司
                      if (this.companyList >= 1) {
                        this.dialogVisible = true
                      } else {
                        this.$router.replace({ name: 'home' })
                      }
                    } else {
                      this.$router.replace({ name: 'user' })
                    }
                  }
                })
              } else {
                this.getCaptcha()
              }
            })
          }
        })
      },
      smsLoginFormSubmit () {
        this.$refs['smsLoginForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/loginForSMS'),
              method: 'post',
              data: {
                'username': this.smsLoginForm.mobile,
                'code': this.smsLoginForm.code
              }
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$http({
                  url: this.$http.adornUrl('/com/all'),
                  method: 'get'
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    if (data.data) {
                      this.companyList = filter(data.data, i => i.status === 4)
                      // 已注册多家公司
                      if (this.companyList >= 1) {
                        this.dialogVisible = true
                      } else {
                        this.$router.replace({ name: 'home' })
                      }
                    } else {
                      this.$router.replace({ name: 'user' })
                    }
                  }
                })
              }
            })
          }
        })
      },
      // 设置默认企业
      currentCompanyConfirm () {
        if (!this.currentCompanyId) {
          this.$message.info('请选择需要登录的企业')
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/com/default/${this.currentCompanyId}`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$router.replace({ name: 'home' })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .brand-info {
    margin: 220px 100px 0 0px;
    color: #fff;
  }
  .brand-info__text {
    margin:  0 0 22px 0;
    font-size: 34px;
    font-weight: 400;
    text-transform : uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 18px;
    line-height: 1.58;
    opacity: .8;
  }
  .login-main {
    position: absolute;
    top: calc(50% - 250px);
    right: 50px;
    border-radius: 5px;
    padding: 30px 35px 20px;
    width: 400px;
    min-height: 420px;
    background-color: #fff;
    box-shadow: 0 0 13px 0 rgba(0,0,0,.05);
  }
  .login-bottom {
    position: absolute;
    bottom: 50px;
    width: 330px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }
</style>
