<template>
    <el-dialog
        title="修改商品信息"
        width="500px"
        :visible.sync="visible"
        :append-to-body="true">
        <el-form :model="dataForm" style="width: 420px;margin: 0 auto" :rules="dataRule" ref="dataForm" label-width="120px">
            <el-form-item label="商品名称：" prop="name">
                <el-input :maxLength="64" placeholder="请输入商品名称" v-model="dataForm.name"></el-input>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input :maxLength="16" placeholder="请输入商品单价" v-model="dataForm.price"></el-input>
            </el-form-item>
            <el-form-item label="税率：" prop="taxRate">
                <el-select v-model="dataForm.taxRate" placeholder="请选择商品税率" style="width: 100%;">
                    <el-option label="0%" :value="0"></el-option>
                    <el-option label="1%" :value="0.01"></el-option>
                    <el-option label="2%" :value="0.02"></el-option>
                    <el-option label="3%" :value="0.03"></el-option>
                    <el-option label="4%" :value="0.04"></el-option>
                    <el-option label="5%" :value="0.05"></el-option>
                    <el-option label="6%" :value="0.06"></el-option>
                    <el-option label="9%" :value="0.09"></el-option>
                    <el-option label="10%" :value="0.1"></el-option>
                    <el-option label="11%" :value="0.11"></el-option>
                    <el-option label="13%" :value="0.13"></el-option>
                    <el-option label="16%" :value="0.16"></el-option>
                    <el-option label="17%" :value="0.17"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单位：" prop="unit">
                <el-input v-model="dataForm.unit" :maxLength="22" placeholder="请输入商品单位"></el-input>
            </el-form-item>
            <el-form-item label="规格型号：" prop="spec">
                <el-input v-model="dataForm.spec" :maxLength="40" placeholder="请输入商品规格型号"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="submit" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>
  
<script>
    import pick from 'lodash/pick'
    export default {
      data () {
        return {
          submit: false,
          visible: false,
          dataForm: {
            name: '',
            price: '',
            taxRate: 0,
            unit: '',
            spec: ''
          },
          dataRule: {
            name: [{
              required: true,
              message: '商品名称不能为空'
            }],
            price: [{
              required: true,
              message: '商品单价不能为空'
            }],
            taxRate: [{
              required: true,
              message: '商品税率不能为空'
            }]
          }
        }
      },
      methods: {
        // 初始化
        init (data) {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            let record = pick(data, ['name', 'taxRate', 'price', 'unit', 'spec', 'id'])
            this.dataForm = record
          })
        },
        // 表单提交
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.submit = true
              this.$http({
                url: this.$http.adornOperateUrl('/product/update'),
                method: 'post',
                data: this.dataForm
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.visible = false
                  this.$emit('refresh')
                }
              }).finally(() => {
                this.submit = false
              })
            }
          })
        }
      }
    }
</script>
  
  