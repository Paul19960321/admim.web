<template>
    <el-row>
        <el-col :span="12" :offset="6">
            <el-form :model="companyForm" ref="companyForm" :rules="companyFormRules" label-width="150px" style="max-width: 500px;" v-show="step === 0">
                <el-form-item label="企业名称：" prop="name">
                  <el-select
                    class="block"
                    v-model="companyForm.name"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入企业名称"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                      v-for="item in companyList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="统一社会信用代码：" prop="tuscc">
                    <el-input type="text" :maxLength="18" v-model="companyForm.tuscc" placeholder="请输入统一社会信用代码"></el-input>
                </el-form-item>
                <el-form-item label="公司地址：" prop="locate">
                  <el-cascader :props="{value: 'name', label: 'name'}" :options="options" v-model="companyForm.locate" clearable style="width: 100%;" placeholder="请选择公司地址"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address">
                    <el-input type="text" :maxLength="100" v-model="companyForm.address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="公司电话：" prop="mobile">
                    <el-input type="text" :maxLength="16" v-model="companyForm.mobile" placeholder="请输入公司电话"></el-input>
                </el-form-item>
                <el-form-item label="创建人角色：" required>
                    <el-radio v-model="role" :label="0">我是企业法人</el-radio>
                    <el-radio v-model="role" :label="1">我是经办人</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button class="block" type="primary" @click="nextStep">下一步</el-button>
                </el-form-item>
            </el-form>
            <el-form :model="corporationForm" ref="corporationForm" :rules="corporationFormRules" label-width="150px" style="max-width: 500px;" v-show="step === 1">
              <el-form-item label="企业名称：" prop="name">
                <span>{{corporationForm.name}}</span>
              </el-form-item>
              <el-form-item label="统一社会信用代码：" prop="tuscc">
                <span>{{corporationForm.tuscc}}</span>
              </el-form-item>
              <el-form-item label="法人姓名：" prop="corporationName">
                <span v-if="corporationForm.corporation === userId">{{corporationForm.corporationName}}</span>
                <el-input v-else type="text" :maxLength="64" v-model="corporationForm.corporationName" placeholder="请输入法人姓名"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证号码：" prop="corporationIDCard">
                <span v-if="corporationForm.corporation === userId">{{corporationForm.corporationIDCard}}</span>
                <el-input type="text" v-else :maxLength="18" v-model="corporationForm.corporationIDCard" placeholder="请输入法人身份证号码"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号码：" prop="corporationMobile">
                <span v-if="corporationForm.corporation === userId">{{corporationForm.corporationMobile}}</span>
                <el-input v-else type="text" :maxLength="16" v-model="corporationForm.corporationMobile" placeholder="请输入法人手机号码"></el-input>
              </el-form-item>
              <el-form-item v-if="!corporationForm.corporation" label="法人短信验证码：" prop="code">
                <el-row>
                  <el-col :span="13">
                      <el-input placeholder="请输入短信验证码" :maxLength="6" v-model="corporationForm.code"></el-input>
                  </el-col>
                  <el-col :span="10" :offset="1">
                      <el-button :loading="btnLoading" type="primary" class="block" :disabled="countDown > 0" @click="sendSms">
                          {{countDown > 0 ? `${countDown}秒后重试` : "获取验证码"}}
                      </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="法人联系邮箱：" prop="corporationMail">
                <el-input type="text" :maxLength="64" v-model="corporationForm.corporationMail" placeholder="请输入法人联系邮箱"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button class="block" type="primary" @click="formSubmit">下一步</el-button>
              </el-form-item>
              <el-form-item style="text-align: right;">
                <el-button type="text" @click="prevStep">返回上一步</el-button>
              </el-form-item>
          </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import cities from '@/utils/cities.json'
    import assign from 'lodash/assign'
    import omit from 'lodash/omit'
    import pick from 'lodash/pick'
    import map from 'lodash/map'
    import axios from 'axios'
    import { isEmail, isMobile, isIdCard } from '@/utils/validate'
    export default {
      data () {
        var validateMobile = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('法人手机号码不能为空'))
          } else if (!isMobile(value)) {
            callback(new Error('请输入正确的手机号码'))
          } else {
            callback()
          }
        }
        var validateIdCard = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('身份证号不能为空'))
          } else if (!isIdCard(value)) {
            callback(new Error('请输入正确的身份证号'))
          } else {
            callback()
          }
        }
        var validateEmail = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('法人联系邮箱不能为空'))
          } else if (!isEmail(value)) {
            callback(new Error('请输入正确的联系邮箱'))
          } else {
            callback()
          }
        }
        return {
          step: 0,
          role: 0,
          btnLoading: false,
          loading: false,
          companyList: [],
          countDown: 0,
          options: cities,
          companyForm: {
            name: '',
            tuscc: '',
            address: '',
            mobile: '',
            locate: []
          },
          corporationForm: {},
          companyFormRules: {
            name: [{
              required: true,
              message: '企业名称不能为空'
            }],
            tuscc: [{
              required: true,
              message: '统一社会信用代码不能为空'
            }],
            address: [{
              required: true,
              message: '详细地址不能为空'
            }],
            locate: [{
              required: true,
              message: '公司地址不能为空'
            }],
            mobile: [{
              required: true,
              message: '公司电话不能为空'
            }]
          },
          corporationFormRules: {
            corporationName: [{
              required: true,
              message: '法人姓名不能为空'
            }],
            corporationIDCard: [{
              required: true,
              message: '法人身份证号码不能为空'
            }, {
              validator: validateIdCard,
              trigger: 'change'
            }],
            corporationMail: [{
              required: true,
              message: '法人联系邮箱不能为空'
            }, {
              validator: validateEmail,
              trigger: 'change'
            }],
            corporationMobile: [{
              required: true,
              message: '法人手机号码不能为空'
            }, {
              validator: validateMobile,
              trigger: 'change'
            }],
            code: [{
              required: true,
              message: '法人短信验证码不能为空'
            }]
          }
        }
      },
      mounted () {
        if (this.registerCompany) {
          this.init(this.registerCompany)
        }
      },
      watch: {
        registerCompany: function (val) {
          if (val) {
            this.init(val)
          }
        }
      },
      computed: {
        userMobile: {
          get () { return this.$store.state.user.mobile },
          set (val) { this.$store.commit('user/updateMobile', val) }
        },
        userRealName: {
          get () { return this.$store.state.user.userRealName },
          set (val) { this.$store.commit('user/updateUserRealName', val) }
        },
        userId: {
          get () { return this.$store.state.user.id },
          set (val) { this.$store.commit('user/updateId', val) }
        },
        registerCompany: {
          get () { return this.$store.state.user.registerCompany },
          set (val) { this.$store.commit('user/updateRegisterCompany', val) }
        }
      },
      methods: {
        init (val) {
          this.step = 1
          this.$refs['corporationForm'].resetFields()
          const {province, city, area} = this.registerCompany
          let data = omit(this.registerCompany, ['province', 'city', 'area'])
          data.locate = [province, city, area]
          this.corporationForm = data
        },
        remoteMethod (query) {
          if (query !== '') {
            this.loading = true
            axios.get(`https://sp0.tianyancha.com/search/suggestV2.json?key=${query}`).then(({data}) => {
              this.loading = false
              if (data.data && data.state === 'ok') {
                this.companyList = map(data.data, i => i.comName)
              }
            })
          } else {
            this.companyList = []
          }
        },
        nextStep () {
          this.$refs['companyForm'].validate((valid) => {
            if (valid) {
              this.step = 1
              this.$refs['corporationForm'].resetFields()
              if (this.role === 0) {
                const values = assign({}, this.companyForm, {
                  corporation: this.userId,
                  corporationName: this.userRealName.name || '',
                  corporationMobile: this.userMobile || '',
                  corporationIDCard: this.userRealName.idCard || ''
                })
                this.corporationForm = values
              } else {
                this.corporationForm = this.companyForm
                this.corporationForm.operatorId = this.userId
              }
            }
          })
        },
        prevStep () {
          let formdata = this.corporationForm
          let data = pick(formdata, ['id', 'name', 'tuscc', 'address', 'mobile', 'locate'])
          this.$refs['companyForm'].resetFields()
          this.companyForm = data
          this.step = 0
        },
        // 发送验证码
        sendSms () {
          this.$refs['corporationForm'].validateField('corporationMobile', (err) => {
            if (!err) {
              this.btnLoading = true
              this.$http({
                url: this.$http.adornUrl('/sms/send'),
                method: 'post',
                data: {
                  'mobile': this.corporationForm.corporationMobile,
                  'msgType': 2
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
                } else {
                  this.$message.error(data.msg)
                }
              }).finally(() => {
                this.btnLoading = false
              })
            }
          })
        },
        formSubmit () {
          this.$refs['corporationForm'].validate((valid) => {
            if (valid) {
              let data = omit(this.corporationForm, ['locate'])
              const [province, city, area] = this.corporationForm.locate
              this.$http({
                url: this.$http.adornUrl('/com/save'),
                method: 'post',
                data: assign(data, {
                  province,
                  city,
                  area,
                  status: 1
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  if (data.data) {
                    this.$emit('nextStep')
                    this.registerCompany = data.data
                  }
                }
              })
            }
          })
        }
      }
    }
</script>