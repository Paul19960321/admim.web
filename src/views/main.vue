<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  export default {
    provide () {
      return {
        // 刷新
        refresh () {
          this.$store.commit('common/updateContentIsNeedRefresh', true)
          this.$nextTick(() => {
            this.$store.commit('common/updateContentIsNeedRefresh', false)
          })
        }
      }
    },
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      sysUserType: {
        get () { return this.$store.state.user.sysUserType },
        set (val) { this.$store.commit('user/updateSysUserType', val) }
      },
      currentCompany: {
        get () { return this.$store.state.user.currentCompany },
        set (val) { this.$store.commit('user/updateCurrentCompany', val) }
      },
      userMobile: {
        get () { return this.$store.state.user.mobile },
        set (val) { this.$store.commit('user/updateMobile', val) }
      },
      userRealName: {
        get () { return this.$store.state.user.userRealName },
        set (val) { this.$store.commit('user/updateUserRealName', val) }
      },
      userSignAuth: {
        get () { return this.$store.state.user.userSignAuth },
        set (val) { this.$store.commit('user/updateUserSignAuth', val) }
      }
    },
    created () {
      this.getUserInfo()
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.user.userId
            this.userName = data.user.username
            this.userRealName = data.user.userRealName
            this.sysUserType = data.user.sysUserType
            this.userMobile = data.user.mobile
            this.currentCompany = data.user.company
            this.userSignAuth = data.user.signAuth
            if (data.user.sysUserType === 1 && !data.user.realName) {
              this.$router.replace({ name: 'user-certification' })
              return
            }
            if (data.user.sysUserType === 1 && !data.user.signAuth) {
              this.$router.replace({ name: 'user-authorize' })
            }
          }
        })
      }
    }
  }
</script>
