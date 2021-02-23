<template>
    <el-dialog
        title="请选择商品"
        width="900px"
        :visible.sync="visible"
        :append-to-body="true">
        <div v-loading="loading">
            <el-form :inline="true" @keyup.enter.native="getProductList()">
                <el-form-item>
                    <el-input placeholder="根据名称关键词查询" v-model="queryKey" style="width: 300px;">
                        <el-button @click="getProductList()" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
            @selection-change="(val) => selectedRow=val"
            :data="productList"
            border
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
        </el-table>
        <el-pagination
            style="text-align: right; margin-top: 15px;"
            layout="prev, pager, next"
            :current-page="pagination.currPage"
            @current-change="(currentPage) => getProductList(currentPage)"
            :total="pagination.totalCount">
        </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import omit from 'lodash/omit'
    export default {
      data () {
        return {
          loading: false,
          visible: false,
          queryKey: '',
          productList: [],
          selectedRow: [],
          pagination: {}
        }
      },
      methods: {
        // 初始化
        init () {
          this.visible = true
          this.getProductList()
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
            this.loading = false
          })
        },
        onSubmit () {
          this.visible = false
          this.$emit('selected', this.selectedRow)
        }
      }
    }
</script>