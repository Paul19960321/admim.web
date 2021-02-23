<template>
    <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="开票信息" name="first">
            <InvoiceConfig v-if="activeTab === 'first'" />
        </el-tab-pane>
        <el-tab-pane label="商品信息" name="second">
            <ProductManagement v-if="activeTab === 'second'" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import InvoiceConfig from './components/invoice-config'
    import ProductManagement from './components/product-management'
    export default {
      data () {
        return {
          activeTab: 'first'
        }
      },
      components: {
        ProductManagement,
        InvoiceConfig
      }
    }
</script>