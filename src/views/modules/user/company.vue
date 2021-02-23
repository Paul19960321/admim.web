<template>
    <div class="mod-user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.CompanyName" placeholder="企业名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.Status" placeholder="状态" clearable>
            <el-option label="已维护" :value="1"></el-option>
            <el-option label="待维护" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          prop="companyId"
          header-align="center"
          align="center"
          label="企业ID">
        </el-table-column>
        <el-table-column
          prop="companyName"
          header-align="center"
          align="center"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="taxNum"
          header-align="center"
          align="center"
          label="企业税号">
        </el-table-column>
        <el-table-column
          prop="areaCode"
          header-align="center"
          align="center"
          label="地区编码">
        </el-table-column>
        <el-table-column
          prop="taxAuthoritCode"
          header-align="center"
          align="center"
          label="税务机关代码">
        </el-table-column>
        <el-table-column
          prop="invoiceSealNo"
          header-align="center"
          align="center"
          label="发票章备案号">
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="公司注册地址">
        </el-table-column>
        <el-table-column
          prop="identity"
          header-align="center"
          align="center"
          label="授权码">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="注册时间">
          <template slot-scope="scope">
            {{$moment(scope.row.registDate).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="80px"
          label="状态">
          <template slot-scope="scope">
            {{scope.row.state === 1 ? '已维护' : scope.row.state === 2 ? '待维护' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          width="80px"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.companyId)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </template>
  
  <script>
    import omitBy from 'lodash/omitBy'
    export default {
      data () {
        return {
          dataForm: {
            CompanyName: null,
            Status: null
          },
          dataList: [],
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          dataListLoading: false,
          dataListSelections: [],
          addOrUpdateVisible: false
        }
      },
      activated () {
        this.getDataList()
      },
      methods: {
        // 获取数据列表
        getDataList () {
          this.dataListLoading = true
          const params = omitBy(this.dataForm, (i) => !i)
          this.$http({
            url: this.$http.adornOperateUrl('/system'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              ...params
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.data.list
              this.totalPage = data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          })
        },
        // 每页数
        sizeChangeHandle (val) {
          this.pageSize = val
          this.pageIndex = 1
          this.getDataList()
        },
        // 当前页
        currentChangeHandle (val) {
          this.pageIndex = val
          this.getDataList()
        },
        // 多选
        selectionChangeHandle (val) {
          this.dataListSelections = val
        },
        // 新增 / 修改
        addOrUpdateHandle (id) {
          this.$prompt('请输入诺诺授权码', '修改', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            if (!value) {
              this.$message.info('诺诺授权码不能为空')
              return
            }
            this.$http({
              url: this.$http.adornOperateUrl('/system/update'),
              method: 'post',
              data: {
                companyId: id,
                identity: value
              }
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.getDataList()
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消操作'
            })
          })
        },
        // 删除
        deleteHandle (id) {
          var userIds = id ? [id] : this.dataListSelections.map(item => {
            return item.userId
          })
          this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/sys/user/delete'),
              method: 'post',
              data: this.$http.adornData(userIds, false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {})
        }
      }
    }
  </script>
  