<template>
    <el-dialog
        title=""
        width="850px"
        :visible.sync="visible"
        :append-to-body="true">
        <iframe width="100%" height="600" :src="`${SITE_CONFIG.version}/static/plugins/pdfjs/web/viewer.html?file=${file}`" title="pdf" />
    </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          visible: false,
          file: ''
        }
      },
      computed: {
        SITE_CONFIG: () => window.SITE_CONFIG
      },
      methods: {
        // 初始化
        init (data) {
          this.file = data
          this.visible = true
        }
      }
    }
</script>