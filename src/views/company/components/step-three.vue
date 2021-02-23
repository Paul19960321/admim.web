<template>
    <el-row>
        <el-col :span="12" :offset="6">
            <el-form :model="dataForm" ref="dataForm" :rules="formRules" label-width="150px" style="max-width: 500px;" v-show="step === 0">
                <el-form-item label="企业名称：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="统一社会信用代码：">
                    <span>{{dataForm.tuscc}}</span>
                </el-form-item>
                <el-form-item label="公司银行账户号码：" prop="bankAccount">
                    <el-input type="text" v-model="dataForm.bankAccount" placeholder="请输入公司银行账户号码"></el-input>
                </el-form-item>
                <el-form-item label="公司银行开户行：" prop="bank">
                    <el-select
                    v-model="dataForm.bank"
                    filterable
                    remote
                    :remote-method="remoteMethod"
                    placeholder="请选择公司银行开户行"
                    @focus="getBankList"
                    style="width: 100%;"
                    :loading="backOptionsLoading">
                      <el-option
                        v-for="item, index in bankOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开户行地区：" prop="bankLocate">
                  <el-cascader
                    v-model="dataForm.bankLocate"
                    style="width: 100%;"
                    :options="bankAddressOptions"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button class="block" :loading="submit" type="primary" @click="nextStep">下一步</el-button>
                </el-form-item>
            </el-form>
            <el-form label-width="150px" style="max-width: 500px;" v-show="step === 1">
              <el-form-item label="企业名称：">
                  <span>{{dataForm.name}}</span>
              </el-form-item>
              <el-form-item label="统一社会信用代码：">
                  <span>{{dataForm.tuscc}}</span>
              </el-form-item>
              <el-form-item label="公司银行开户行：" prop="bank">
                  <span>{{dataForm.bank}}</span>
              </el-form-item>
              <el-form-item label="公司银行账户号码：" prop="bankAccount">
                  <span>{{dataForm.bankAccount}}</span>
              </el-form-item>
              <el-form-item label="附言内容：" required>
                <el-input type="text" v-model="code" placeholder="请输入附言内容"></el-input>
              </el-form-item>
              <el-form-item>
                <div style="line-height: 1.4; color: #606266">温馨提示：已向企业对公账号打款0.01元，请回填附言中的内容，受开户行结算时间影响，到账时间可能在10分钟-72小时不等。</div>
              </el-form-item>
              <el-form-item>
                  <el-button class="block" :loading="submit" type="primary" @click="formSubmit">完成企业打款验证</el-button>
              </el-form-item>
              <el-form-item style="text-align: right;">
                企业账户信息有误？<el-button type="text" @click="step -= 1">返回更正</el-button>
              </el-form-item>
          </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import assign from 'lodash/assign'
    import forEach from 'lodash/forEach'
    import find from 'lodash/find'
    import findIndex from 'lodash/findIndex'
    import omit from 'lodash/omit'
    export default {
      data () {
        return {
          step: 0,
          loading: true,
          backOptionsLoading: false,
          submit: false,
          bankList: undefined,
          bankOptions: undefined,
          bankAddressOptions: undefined,
          dataForm: {},
          code: '',
          formRules: {
            bankAccount: [{
              required: true,
              message: '公司银行账户号码不能为空'
            }],
            bank: [{
              required: true,
              message: '公司银行开户行不能为空'
            }],
            bankLocate: [{
              required: true,
              message: '开户行地区不能为空'
            }]
          }
        }
      },
      props: {
        registerInfo: Object
      },
      mounted () {
        if (this.registerInfo) {
          this.$refs['dataForm'].resetFields()
          this.dataForm = assign({}, this.registerInfo)
          if (this.registerInfo.status === 3) {
            this.step = 1
          }
        }
        this.getBankAddressList()
      },
      methods: {
        nextStep () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.submit = true
              let data = omit(this.dataForm, ['banklocate'])
              data.bankAddress = `${this.dataForm.bankLocate[0]}${this.dataForm.bankLocate[1].county}`
              data.bankAddressCode = this.dataForm.bankLocate[1].code
              this.$http({
                url: this.$http.adornUrl('/com/save'),
                method: 'post',
                data: data
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$http({
                    url: this.$http.adornUrl(`/com/checkaccount/${data.id}`),
                    method: 'get'
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.step = 1
                    }
                  })
                }
              }).finally(() => {
                this.submit = false
              })
            }
          })
        },
        formSubmit () {
          if (!this.code) {
            this.$message.error('请输入验证码')
            return
          }
          this.submit = true
          this.$http({
            url: this.$http.adornUrl(`/com/checkaccount/${this.dataForm.id}/${this.code}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$http({
                url: this.$http.adornUrl('/com/save'),
                method: 'post',
                data: assign(this.registerInfo, {
                  status: 4
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$emit('nextStep')
                }
              })
            }
          })
        },
        // 银行列表过滤
        remoteMethod (query) {
          if (query !== '') {
            this.backOptionsLoading = true
            setTimeout(() => {
              this.backOptionsLoading = false
              this.bankOptions = this.bankList.filter(item => {
                return item.name.indexOf(query) > -1
              })
            }, 200)
          } else {
            this.bankOptions = this.bankList
          }
        },
        // 获取银行列表
        getBankList () {
          if (this.bankList) return
          this.backOptionsLoading = true
          this.$http({
            url: this.$http.adornUrl('/bank/name'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.backOptionsLoading = false
              this.bankList = data.data
              this.bankOptions = data.data
            }
          })
        },
        // 获取银行地址列表
        getBankAddressList () {
          this.$http({
            url: this.$http.adornUrl(`/bank/address`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              let options = []
              forEach(data.data, i => {
                if (find(options, {label: i.province})) {
                  options[findIndex(options, {label: i.province})].children.push({
                    label: i.county,
                    value: {
                      county: i.county,
                      code: i.code
                    }
                  })
                } else {
                  if (i.province === i.county) {
                    options.push({
                      label: i.province,
                      value: i.province,
                      children: [{
                        label: i.county,
                        value: {
                          county: i.county,
                          code: i.code
                        }
                      }]
                    })
                  } else {
                    options.push({
                      label: i.province,
                      value: i.province,
                      children: []
                    })
                  }
                }
              })
              this.bankAddressOptions = options
            }
          })
        }
      }
    }
</script>