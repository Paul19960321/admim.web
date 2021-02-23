<template>
    <div>
      <el-row>
        <el-col :span="12" style="padding: 0 20px;">
          <h3 class="section-title">基本信息</h3>
            <el-form label-position="left" label-width="150px">
                <el-form-item label="姓名：">
                    {{(userRealName && userRealName.name) || '-'}}
                </el-form-item>
                <el-form-item label="身份证号码：">
                    {{userIdCard || '-'}}
                </el-form-item>
                <el-form-item label="手机号码：">
                    {{userMobile || '-'}}
                    <el-button style="margin-left: 15px;" type="text" @click="updateMobileHandle">修改</el-button>
                </el-form-item>
            </el-form>
        </el-col>
      </el-row>
      <MobileUpdate v-if="updateMobileVisible" ref="updateMobile" />
    </div>
</template>
  
<script>
    import MobileUpdate from './mobile-update'
    export default {
      data () {
        return {
          updateMobileVisible: false
        }
      },
      components: {
        MobileUpdate
      },
      computed: {
        userRealName: {
          get () { return this.$store.state.user.userRealName },
          set (val) { this.$store.commit('user/updateUserRealName', val) }
        },
        userMobile: {
          get () { return this.$store.state.user.mobile },
          set (val) { this.$store.commit('user/updateMobile', val) }
        },
        userIdCard: function () {
          if (this.userRealName && this.userRealName.idCard) {
            return this.userRealName.idCard.replace(this.userRealName.idCard.substr(4, 10), '**********')
          } else {
            return '-'
          }
        }
      },
      methods: {
        // 修改密码
        updateMobileHandle () {
          this.updateMobileVisible = true
          this.$nextTick(() => {
            this.$refs.updateMobile.init()
          })
        }
      }
    }
</script>