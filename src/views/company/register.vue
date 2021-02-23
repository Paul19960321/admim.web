<template>
    <div v-loading="loading">
        <el-page-header @back="$router.go(-1)" title="" content="创建企业"></el-page-header>
        <el-steps :active="step" align-center style="margin: 40px 0">
            <el-step title="填写企业信息"></el-step>
            <el-step title="企业信息核验"></el-step>
            <el-step title="签署协议"></el-step>
            <el-step title="完成创建"></el-step>
        </el-steps>
        <StepOne v-if="step === 0" @nextStep="step += 1"></StepOne>
        <StepTwo v-else-if="step === 1" @nextStep="step += 1" @prevStep="step -= 1"></StepTwo>
        <StepFour v-else-if="step === 2" @nextStep="step += 1"></StepFour>
        <StepFive v-else-if="step === 4"></StepFive>
    </div>
</template>

<script>
    import StepOne from './components/step-one'
    import StepTwo from './components/step-two'
    import StepThree from './components/step-three'
    import StepFour from './components/step-four'
    import StepFive from './components/step-five'
    import find from 'lodash/find'
    export default {
      data () {
        return {
          loading: false,
          step: 0
        }
      },
      components: {
        StepOne,
        StepTwo,
        StepThree,
        StepFour,
        StepFive
      },
      computed: {
        registerCompany: {
          get () { return this.$store.state.user.registerCompany },
          set (val) { this.$store.commit('user/updateRegisterCompany', val) }
        }
      },
      mounted () {
        if (!this.registerCompany || this.registerCompany.status === 4) {
          this.getCompanyList()
        } else {
          this.step = this.registerCompany.status || 0
        }
      },
      methods: {
        getCompanyList () {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/com/all'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.loading = false
              this.registerCompany = find(data.data, i => i.status !== 4)
              if (this.registerCompany) {
                this.step = this.registerCompany.status
              } else {
                this.step = 0
              }
            }
          })
        }
      }
    }
</script>