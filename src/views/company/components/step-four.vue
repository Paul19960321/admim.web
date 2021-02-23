<template>
  <el-row v-loading="loading" element-loading-text="签署文件加载中">
    <el-col :span="12" :offset="6" style="text-align: center">
      <h1>签署协议</h1>
      <p style="text-align: left; text-indent: 2em; line-height: 1.5;">
        欢迎使用麦昇科技的产品服务，如您需要正常使用平台服务，请您仔细阅读以下<a :href="registryContract && registryContract.fileDownLoad ? registryContract.fileDownLoad :''" type="primary" target="_blank">《用户注册协议》</a>和<a :href="agreementContract && agreementContract.fileDownLoad ? agreementContract.fileDownLoad : ''" type="primary" target="_blank">《企业数据授权书》</a>，并且需要公司法人在电子签章平台完成协议签署（注意盖公司电子签章），签署完成之后，平台服务正式启用！
      </p>
      <p>
        <el-button type="primary" v-if="registryContract" @click="signContract(registryContract.id)">
          <span v-if="registryContract.signStatus === 3">《用户注册协议》已签署</span>
          <span v-else>签署《用户注册协议》</span>
        </el-button>
        <el-button type="primary" v-if="agreementContract" @click="signContract(agreementContract.id)">
          <span v-if="agreementContract.signStatus === 3">《企业数据授权书》已签署</span>
          <span v-else>签署《企业数据授权书》</span>
        </el-button>
      </p>
    </el-col>
  </el-row>
</template>

<script>
    import assign from 'lodash/assign'
    let timer
    export default {
      data () {
        return {
          loading: true,
          registryContract: null,
          agreementContract: null
        }
      },
      computed: {
        SITE_CONFIG: () => window.SITE_CONFIG,
        userId: {
          get () { return this.$store.state.user.id },
          set (val) { this.$store.commit('user/updateId', val) }
        },
        registerCompany: {
          get () { return this.$store.state.user.registerCompany },
          set (val) { this.$store.commit('user/updateRegisterCompany', val) }
        }
      },
      mounted () {
        setTimeout(() => {
          this.loading = false
          this.getContract()
        }, 10000)
      },
      beforeDestroy () {
        clearTimeout(timer)
      },
      methods: {
        // 获取合同签署状态
        getSignStatus () {
          clearTimeout(timer)
          if (this.registryContract && this.registryContract.signStatus === 3 &&
          this.agreementContract && this.agreementContract.signStatus === 3) {
            this.$http({
              url: this.$http.adornUrl('/com/save'),
              method: 'post',
              data: assign({}, this.registerCompany, {
                status: 4
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.data) {
                  this.$emit('nextStep')
                  this.registerCompany = data.data
                }
              }
            })
          } else {
            if (this.$route.name === 'company-register') {
              timer = setTimeout(() => {
                this.getContract()
              }, 2000)
            }
          }
        },
        getContract () {
          Promise.all([
            this.$http({
              url: this.$http.adornOperateUrl('/contract/signtransfer'),
              method: 'get',
              params: {
                companyId: this.registerCompany.id,
                contractType: 0
              }
            }),
            this.$http({
              url: this.$http.adornOperateUrl('/contract/signtransfer'),
              method: 'get',
              params: {
                companyId: this.registerCompany.id,
                contractType: 1
              }
            })
          ]).then(data => {
            if (data && data.length >= 2) {
              const registryContractData = data[0].data
              const agreementContractData = data[1].data
              if (registryContractData && registryContractData.code === 0 && registryContractData.data) {
                this.registryContract = registryContractData.data
              }
              if (agreementContractData && agreementContractData.code === 0 && agreementContractData.data) {
                this.agreementContract = agreementContractData.data
              }
            }
          }).finally(() => {
            this.getSignStatus()
          })
        },
        // 跳转签署页面
        signContract (id) {
          this.$http({
            url: this.$http.adornOperateUrl(`/contract/getSignUrl/${id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0 && data.data) {
              var link = document.createElement('a')
              link.target = '_blank'
              link.href = data.data
              link.rel = 'noopener noreferrer'
              document.body.appendChild(link)
              link.click()
              link.parentNode.removeChild(link)
            }
          })
        }
      }
    }
</script>