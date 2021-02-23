<template>
    <div v-loading='loading'>
        <el-form :inline="true" @keyup.enter.native="getProductList()">
            <el-form-item>
                <el-input placeholder="根据名称关键词查询" v-model="queryKey" style="width: 300px;">
                    <el-button @click="getProductList()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-form-item>
            <el-button v-if="selectedRow.length > 0" @click="deleteProduct(selectedRow)" style="float: right;" type="primary">批量删除</el-button>
        </el-form>
        <el-table
            :data="productList"
            border
            @selection-change="handleSelectChange"
            style="width: 100%">
            <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="55">
            </el-table-column>
            <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="商品名称">
            </el-table-column>
            <el-table-column
            header-align="center"
            align="center"
            label="税率"
            width="100px">
            <template slot-scope="scope">
                {{`${parseFloat(scope.row.taxRate) * 100}%`}}
            </template>
            </el-table-column>
            <el-table-column
            prop="price"
            header-align="center"
            align="center"
            label="商品单价">
            </el-table-column>
            <el-table-column
            prop="unit"
            label="单位"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            prop="spec"
            label="规格"
            header-align="center"
            align="center">
            </el-table-column>
            <el-table-column
            label="操作"
            header-align="center"
            width="120px"
            align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="updateProductHandle(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteProduct([scope.row.id])">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :current-page="pagination.currPage"
            @current-change="(currentPage) => getProductList(currentPage)"
            :total="pagination.totalCount">
        </el-pagination>
        <UpdateProduct v-if="visible" ref="updateProduct" @refresh="getProductList()" />
    </div>
</template>
  
<script>
    import UpdateProduct from './update-product'
    import omit from 'lodash/omit'
    export default {
      name: 'product-manage',
      data () {
        return {
          queryKey: '',
          visible: false,
          loading: false,
          productList: [],
          selectedRow: [],
          pagination: {}
        }
      },
      components: {
        UpdateProduct
      },
      mounted () {
        this.getProductList()
      },
      methods: {
        // 编辑产品
        updateProductHandle (values) {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['updateProduct'].init(values)
          })
        },
        // 获取产品列表
        getProductList (currentPage) {
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl('/product/query'),
            method: 'get',
            params: {
              Page: currentPage || 1,
              Limit: 10,
              key: this.queryKey
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              let pagination = omit(data.data, ['list'])
              this.pagination = pagination
              this.productList = data.data.list
            }
          }).finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        },
        // 选中商品行
        handleSelectChange (value) {
          let ids = value.map(item => item.id)
          this.selectedRow = ids
        },
        // 删除产品
        deleteProduct (ids) {
          this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            this.$http({
              url: this.$http.adornOperateUrl(`/product/delete`),
              method: 'post',
              data: ids
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getProductList()
              }
            }).finally(() => {
              this.loading = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        }
      }
    }
</script>