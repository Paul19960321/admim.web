<template>
    <el-row style="text-align: center;" class="result">
        <h1><i class="el-icon-success success-icon"></i></h1>
        <h3>恭喜您，您已成功注册企业啦！</h3>
        <el-button type="primary" @click="setCurrentCompany">登录注册企业</el-button>
        <el-button type="primary" @click="backHome">回到首页</el-button>
    </el-row>
</template>

<script>
    export default {
      props: {
        registerInfo: Object
      },
      computed: {
        currentCompany: {
          get () { return this.$store.state.user.currentCompany },
          set (val) { this.$store.commit('user/updateCurrentCompany', val) }
        }
      },
      methods: {
        setCurrentCompany: function () {
          this.$http({
            url: this.$http.adornUrl(`/com/default/${this.registerInfo.id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.backHome()
            }
          })
        },
        backHome () {
          this.$http({
            url: this.$http.adornUrl('/sys/user/info'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.user.company) {
                this.currentCompany = data.user.company
                this.$router.replace({ name: 'home' })
              }
            }
          })
        }
      }
    }
</script>