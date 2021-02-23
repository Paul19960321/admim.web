<template>
    <div v-loading='loading'>
        <el-form :inline="true" ref="dataForm" :model="dataForm">
            <el-form-item prop="BuyName">
              <el-input v-model="dataForm.BuyName" placeholder="购方名称"></el-input>
            </el-form-item>
            <el-form-item prop="InvoiceLine">
              <el-select v-model="dataForm.InvoiceLine" placeholder="发票类型">
                <el-option label="增值税电子普通发票" value="p"></el-option>
                <el-option label="增值税普通发票(纸票)" value="c"></el-option>
                <el-option label="增值税专用发票" value="s"></el-option>
                <el-option label="收购发票(电子)" value="e"></el-option>
                <el-option label="收购发票(纸质)" value="f"></el-option>
                <el-option label="增值税普通发票(卷式)" value="r"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="Status">
                <el-select v-model="dataForm.Status" placeholder="开票状态">
                  <el-option label="开票完成" :value="2"></el-option>
                  <el-option label="发票已作废" :value="3"></el-option>
                  <el-option label="开票中" :value="20"></el-option>
                  <el-option label="开票成功签章中" :value="21"></el-option>
                  <el-option label="开票成功签章失败" :value="24"></el-option>
                  <el-option label="开票失败" :value="22"></el-option>
                  <el-option label="发票作废中" :value="31"></el-option>
                </el-select>
              </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getInoviceList()">查询</el-button>
                <el-button @click="$refs['dataForm'].resetFields()">重置</el-button>
            </el-form-item>
            <el-dropdown style="float: right;" placement="bottom">
                <el-button type="primary">
                    手动开票<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="text-align: center;">
                    <el-dropdown-item>
                        <el-button type="text" @click="manullyInoviceHandle('p')">增值税电子普通发票</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button type="text" @click="manullyInoviceHandle('s')">增值税专用发票</el-button>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-form>
        <el-table
            :data="invoiceList"
            border
            style="width: 100%">
            <el-table-column
            prop="buyName"
            header-align="center"
            align="center"
            label="购方名称">
            </el-table-column>
            <el-table-column
            header-align="center"
            align="center"
            label="发票种类"
            width="200px">
            <template slot-scope="scope">
                <span v-if="scope.row.invLine === 0">增值税电子普通发票</span>
                <span v-else-if="scope.row.invLine === 1">增值税普通发票（纸票）</span>
                <span v-else-if="scope.row.invLine === 2">增值税专用发票</span>
                <span v-else-if="scope.row.invLine === 3">收购发票（电子）</span>
                <span v-else-if="scope.row.invLine === 4">收购发票（纸质）</span>
                <span v-else-if="scope.row.invLine === 5">增值税普通发票（卷式）</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="clerk"
            header-align="center"
            align="center"
            label="开票人">
            </el-table-column>
            <el-table-column
            label="申请状态"
            header-align="center"
            align="center"
            width="100px">
            <template slot-scope="scope">
                <span v-if="scope.row.applyStatus === 0">草稿</span>
                <span v-if="scope.row.applyStatus === 1">申请中</span>
                <span v-if="scope.row.applyStatus === 2">申请成功</span>
                <span v-if="scope.row.applyStatus === 3">申请失败</span>
                <span v-if="scope.row.applyStatus === 4">待申请</span>
            </template>
            </el-table-column>
            <el-table-column
            label="开票状态"
            header-align="center"
            align="center"
            width="150px">
            <template slot-scope="scope">
                <span v-if="scope.row.kpStatus === 2">开票完成</span>
                <span v-else-if="scope.row.kpStatus === 3">发票已作废</span>
                <span v-else-if="scope.row.kpStatus === 20">开票中</span>
                <span v-else-if="scope.row.kpStatus === 21">开票成功签章中</span>
                <span v-else-if="scope.row.kpStatus === 24">开票成功签章失败</span>
                <el-tooltip v-else-if="scope.row.kpStatus === 22" effect="dark" placement="left">
                    <div slot="content" style="width: 200px">{{scope.row.logs}}</div>
                    <span>开票失败 <i class="el-icon-warning-outline info-icon"></i></span>
                </el-tooltip>
                <span v-else-if="scope.row.kpStatus === 31">发票作废中</span>
            </template>
            </el-table-column>
            <el-table-column
            label="操作"
            header-align="center"
            align="center"
            width="350px">
            <template slot-scope="scope">
                <el-button type="text" @click="invoiceDetailHandle(scope.row.id)">查看详情</el-button>
                <template v-if="scope.row.applyStatus === 2">
                  <el-button v-if="scope.row.kpStatus === 2 && scope.row.kpType === 1" type="text" @click="applyRedInvoice(scope.row.id)">冲红</el-button>
                  <el-button v-if="scope.row.kpStatus === 2 && scope.row.invLine !== 0" @click="deleteInvoice(scope.row.id)" type="text">作废</el-button>
                </template>
                <template v-if="scope.row.applyStatus === 2 && scope.row.kpStatus === 2">
                  <el-button type="text" @click="downloadInvoicePdf(scope.row.id)">下载</el-button>
                  <el-button type="text" @click="showInvoiceQrcode(scope.row.id)">二维码</el-button>
                  <el-button type="text" @click="previewPDF(scope.row.id)">查看发票</el-button>
                </template>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :current-page="pagination.currPage"
            @current-change="(currentPage) => getInoviceList(currentPage)"
            :total="pagination.totalCount">
        </el-pagination>
        <InvoiceDetail v-if="invoiceDetailVisible" ref="invoiceDetail" @previewPDF="previewPDF" />
        <ManullyInvoice v-if="manullyInvoiceVisible" ref="manullyInvoice" @refresh="getInoviceList()" />
        <PreviewPdf v-if="previewPDFVisible" ref="previewPdf" />
        <el-dialog
          width="500px"
          title="发票二维码"
          :visible.sync="qrcodeModalVisible"
          :append-to-body="true">
          <div style="textAlign: center" id="invoice-qrcode"></div>
        </el-dialog>
    </div>
</template>

<script>
    import InvoiceDetail from './components/invoice-detail'
    import ManullyInvoice from './components/manully-invoice'
    import PreviewPdf from './components/preview-pdf'
    import omit from 'lodash/omit'
    import QRCode from 'qrcode'
    export default {
      data () {
        return {
          loading: false,
          invoiceDetailVisible: false,
          manullyInvoiceVisible: false,
          previewPDFVisible: false,
          qrcodeModalVisible: false,
          dataForm: {
            BuyName: '',
            InvoiceLine: null,
            Status: null
          },
          invoiceList: [],
          pagination: {}
        }
      },
      components: {
        InvoiceDetail,
        ManullyInvoice,
        PreviewPdf
      },
      mounted () {
        this.getInoviceList()
      },
      methods: {
        // 发票详情
        invoiceDetailHandle (id) {
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl(`/invoice/${id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.invoiceDetailVisible = true
              this.$nextTick(() => {
                this.$refs['invoiceDetail'].init(data.data)
              })
            }
          }).finally(() => {
            this.loading = false
          })
        },
        // 发票冲红
        applyRedInvoice (id) {
          this.$confirm('冲红该发票?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            this.$http({
              url: this.$http.adornOperateUrl(`/invoice/redTicket/${id}`),
              method: 'post'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('提交成功')
              }
            }).finally(() => {
              this.loading = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        },
        // 下载发票
        downloadInvoicePdf (id) {
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl(`/invoice/${id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.data && data.data.sourcePDF) {
                window.open(data.data.sourcePDF)
              }
            }
          }).finally(() => {
            this.loading = false
          })
        },
        // 发票作废
        deleteInvoice (id) {
          this.$confirm('作废该发票?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            this.$http({
              url: this.$http.adornOperateUrl(`/invoice/invalid/${id}`),
              method: 'post'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('提交成功')
              }
            }).finally(() => {
              this.loading = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        },
        // 查看发票PDF
        previewPDF (id) {
          // pdf.js ie9下不支持中文字体
          if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
            this.downloadInvoicePdf(id)
            return
          }
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl(`/invoice/${id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.data && data.data.pdf) {
                this.previewPDFVisible = true
                this.$nextTick(() => {
                  this.$refs['previewPdf'].init(`https://${data.data.pdf}`)
                })
              }
            }
          }).finally(() => {
            this.loading = false
          })
        },
        // 发票二维码
        showInvoiceQrcode (id) {
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl(`/invoice/${id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.data && data.data.sourceJPG) {
                this.qrcodeModalVisible = true
                this.$nextTick(() => {
                  const qrcodeWrap = document.getElementById('invoice-qrcode')
                  qrcodeWrap.innerHTML = null
                  QRCode.toDataURL('https://' + data.data.sourceJPG)
                        .then(url => {
                          var qrcodeDom = document.createElement('img')
                          qrcodeDom.src = url
                          qrcodeDom.height = 200
                          qrcodeDom.width = 200
                          qrcodeWrap.appendChild(qrcodeDom)
                        })
                        .catch(err => {
                          console.error(err)
                        })
                })
              }
            }
          }).finally(() => {
            this.loading = false
          })
        },
        /*
         * 手动开票
         * params {string} invoiceLine 开票种类
         */
        manullyInoviceHandle (invoiceLine) {
          this.manullyInvoiceVisible = true
          this.$nextTick(() => {
            this.$refs['manullyInvoice'].init(invoiceLine)
          })
        },
        // 获取发票列表
        getInoviceList (currentPage) {
          this.loading = true
          this.$http({
            url: this.$http.adornOperateUrl('/invoice'),
            method: 'get',
            params: {
              Page: currentPage || 1,
              Limit: 10,
              ...this.dataForm
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              let pagination = omit(data.data, ['list'])
              this.pagination = pagination
              this.invoiceList = data.data.list
            }
          }).finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        }
      }
    }
</script>