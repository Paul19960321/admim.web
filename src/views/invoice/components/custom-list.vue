<template>
    <el-dialog
        title="客户列表"
        width="900px"
        :visible.sync="visible"
        :append-to-body="true">
            <el-table
            v-loading="loading"
            @row-dblclick="onSubmit"
            :data="customList"
            border
            style="width: 100%">
            <el-table-column
            prop="buyName"
            header-align="center"
            align="center"
            label="购方名称">
            </el-table-column>
            <el-table-column
            prop="buyTaxNum"
            header-align="center"
            align="center"
            label="纳税人识别号">
            </el-table-column>
            <el-table-column
            prop="buyAddress"
            header-align="center"
            align="center"
            label="购方地址">
            </el-table-column>
            <el-table-column
            prop="buyBank"
            label="开户行"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            prop="buyBankAccount"
            label="银行账号"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="联系方式"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱"
            header-align="center"
            align="center">
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          loading: false,
          visible: false,
          customList: []
        }
      },
      methods: {
        // 初始化
        init () {
          this.visible = true
          this.getCustomList()
        },
        // 获取客户列表
        getCustomList () {
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl('/buys'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.customList = data.data
            }
          }).finally(() => {
            this.loading = false
          })
        },
        onSubmit (row, column, event) {
          console.log(row)
          this.visible = false
          this.$emit('selected', row)
        }
      }
    }
</script>