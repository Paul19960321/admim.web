<template>
  <div>
    <div v-if="sysUserType === 1">
      <div v-if="!currentCompany">
        <h2>当前账号尚未注册公司</h2>
        <el-button type="primary" @click="$router.push('/company-register')">前往注册</el-button>
      </div>
      <CompanyInfo v-else :companyInfo="currentCompany" />
    </div>
  </div>
</template>

<script>
  import CompanyInfo from './company-info'
  export default {
    components: {
      CompanyInfo
    },
    mounted () {
      if (this.currentCompany && this.currentCompany.status !== 4) {
        this.$router.replace('/company-register')
      }
    },
    computed: {
      currentCompany: {
        get () { return this.$store.state.user.currentCompany },
        set (val) { this.$store.commit('user/updateCurrentCompany', val) }
      },
      sysUserType: {
        get () { return this.$store.state.user.sysUserType },
        set (val) { this.$store.commit('user/updateSysUserType', val) }
      }
    }
  }
</script>

