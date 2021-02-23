<template>
    <div class="mod-user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
            <el-input v-model="dataForm.UserId" placeholder="用户ID" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-input v-model="dataForm.Mobile" placeholder="注册手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-input v-model="dataForm.Name" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="userId"
          header-align="center"
          align="center"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="mobile"
          header-align="center"
          align="center"
          label="注册手机号"
          width="150px">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="注册时间">
          <template slot-scope="scope">
            {{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="所属公司">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="是否已设置密码">
          <template slot-scope="scope">
            {{scope.row.setPwd ? '是' : '否'}}
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
            UserId: '',
            Mobile: '',
            Name: ''
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
            url: this.$http.adornUrl('/sys/userinfo/list'),
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
        }
      }
    }
  </script>
  