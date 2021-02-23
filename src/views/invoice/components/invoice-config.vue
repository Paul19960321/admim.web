<template>
    <el-row v-loading="loading">
      <el-form ref="dataForm" style="max-width: 500px; margin-top: 40px;" :model="dataForm" :rules="rules" label-width="150px">
          <el-form-item label="企业名称：" prop="name">
              <el-input :maxLength="64" placeholder="请输入企业名称" v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名：" prop="corporation">
              <el-input :maxLength="16" placeholder="请输入法人姓名" v-model="dataForm.corporation"></el-input>
          </el-form-item>
          <el-form-item label="公司电话：" prop="mobile">
            <el-input :maxLength="16" placeholder="请输入公司电话" v-model="dataForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="公司地址：" prop="locate">
              <el-cascader :props="{value: 'name', label: 'name'}" :options="options" v-model="dataForm.locate" clearable style="width: 100%;" placeholder="请选择公司地址"></el-cascader>
          </el-form-item>
          <el-form-item label="街道及门牌号：" prop="address">
              <el-input v-model="dataForm.address" :maxLength="1024" placeholder="请输入街道及门牌号"></el-input>
          </el-form-item>
          <el-form-item label="公司税号：" prop="taxNum">
              <el-input v-model="dataForm.taxNum" :maxLength="32" placeholder="请输入公司税号"></el-input>
          </el-form-item>
          <el-form-item label="开户行名称：" prop="bank">
              <el-input v-model="dataForm.bank" :maxLength="64" placeholder="请输入开户行名称"></el-input>
          </el-form-item>
          <el-form-item label="开户行帐号：" prop="bankAccount">
              <el-input v-model="dataForm.bankAccount" :maxLength="64" placeholder="请输入开户行帐号"></el-input>
          </el-form-item>
          <el-form-item label="金税盘编号：" prop="taxPlateNumber">
              <el-input v-model="dataForm.taxPlateNumber" placeholder="请输入金税盘编号"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button :loading="submit" type="primary" class="block" @click="onSubmit">修改</el-button>
          </el-form-item>
      </el-form>
    </el-row>
</template>

<script>
    import cities from '@/utils/cities.json'
    import omit from 'lodash/omit'
    import assign from 'lodash/assign'
    export default {
      data () {
        return {
          submit: false,
          loading: false,
          options: cities,
          dataForm: {
            name: '',
            mobile: '',
            corporation: '',
            address: '',
            locate: [],
            taxNum: '',
            bank: '',
            bankAccount: '',
            taxPlateNumber: ''
          },
          rules: {
            name: [{
              required: true,
              message: '请输入公司名称'
            }],
            mobile: [{
              required: true,
              message: '请输入公司电话'
            }],
            corporation: [{
              required: true,
              message: '请输入法人姓名'
            }],
            locate: [{
              required: true,
              message: '请选择公司地址'
            }],
            address: [{
              required: true,
              message: '请输入街道及门牌号'
            }],
            taxNum: [{
              required: true,
              message: '请输入公司税号'
            }],
            bank: [{
              required: true,
              message: '请输入开户行名称'
            }],
            bankAccount: [{
              required: true,
              message: '请输入开户行帐号'
            }]
          }
        }
      },
      mounted () {
        if (this.currentCompany) {
          this.$refs['dataForm'].resetFields()
          let data = omit(this.currentCompany, ['province', 'city', 'area'])
          const {province, city, area} = this.currentCompany
          data.locate = [province, city, area]
          this.dataForm = data
        }
      },
      computed: {
        currentCompany: {
          get () { return this.$store.state.user.currentCompany },
          set (val) { this.$store.commit('user/updateCurrentCompany', val) }
        }
      },
      methods: {
        onSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.submit = true
              let data = omit(this.dataForm, ['locate'])
              const [province, city, area] = this.dataForm.locate
              this.$http({
                url: this.$http.adornUrl('/com/save'),
                method: 'post',
                data: assign(data, {province, city, area})
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message.success('提交成功')
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