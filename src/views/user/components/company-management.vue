<template>
  <div>
    <el-button @click="$router.push('/company-register')">创建新公司</el-button>
    <CompanyInfo v-if="currentCompany" :companyInfo="currentCompany" />
  </div>
</template>

<script>
  import CompanyInfo from '../../common/company-info'
  export default {
    name: 'company-manage',
    computed: {
      currentCompany: {
        get () { return this.$store.state.user.currentCompany },
        set (val) { this.$store.commit('user/updateCurrentCompany', val) }
      }
    },
    components: {
      CompanyInfo
    }
  }
</script>