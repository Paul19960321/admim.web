<template>
    <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="账号信息" name="first">
          <AccountInfo v-if="activeTab === 'first'" />
        </el-tab-pane>
        <el-tab-pane label="公司管理" name="second">
            <CompanyManagement v-if="activeTab === 'second'" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import CompanyManagement from './components/company-management'
    import AccountInfo from './components/account-info'
    export default {
      data () {
        return {
          activeTab: 'first'
        }
      },
      components: {
        CompanyManagement,
        AccountInfo
      }
    }
</script>