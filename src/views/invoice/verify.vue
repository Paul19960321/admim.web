<template>
    <div v-loading='loading'>
        <el-form :inline="true" ref="queryForm" :model="queryForm">
            <el-form-item prop="FPHM">
              <el-input v-model="queryForm.FPHM" placeholder="发票号码"></el-input>
            </el-form-item>
            <el-form-item prop="invoiceLine">
              <el-select v-model="queryForm.invoiceLine" placeholder="发票种类">
                <el-option label="增值税电子普通发票" value="p"></el-option>
                <el-option label="增值税普通发票(纸票)" value="c"></el-option>
                <el-option label="增值税专用发票" value="s"></el-option>
                <el-option label="收购发票(电子)" value="e"></el-option>
                <el-option label="收购发票(纸质)" value="f"></el-option>
                <el-option label="增值税普通发票(卷式)" value="r"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="RecordStatus">
                <el-select v-model="queryForm.RecordStatus" placeholder="查验状态">
                  <el-option label="查询中" :value="0"></el-option>
                  <el-option label="查询失败" :value="1"></el-option>
                  <el-option label="真票" :value="2"></el-option>
                  <el-option label="查验不一致" :value="3"></el-option>
                  <el-option label="查无此票" :value="4"></el-option>
                  <el-option label="超过当天查验次数" :value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-form-item prop="invoiceDate">
                    <el-date-picker
                        v-model="queryForm.kpTime"
                        type="daterange"
                        start-placeholder="开票时间"
                        end-placeholder="开票时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="checkDate">
                    <el-date-picker
                        v-model="queryForm.recordTime"
                        type="daterange"
                        start-placeholder="查验时间"
                        end-placeholder="查验时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getRecordList()">查询</el-button>
                    <el-button @click="$refs['queryForm'].resetFields()">重置</el-button>
                </el-form-item>
                <el-button style="float: right;" type="primary" @click="veriftFormHandle">
                    发票查验
                </el-button>
            </el-row>
        </el-form>
        <el-table
            :data="recordList"
            border
            style="width: 100%">
            <el-table-column
            prop="fpdm"
            header-align="center"
            align="center"
            label="发票代码"
            width="150px">
            </el-table-column>
            <el-table-column
            prop="fphm"
            header-align="center"
            align="center"
            label="发票号码"
            width="150px">
            </el-table-column>
            <el-table-column
            header-align="center"
            align="center"
            label="发票种类"
            width="200px">
            <template slot-scope="scope">
                <span v-if="scope.row.recordInvoiceLine === 0">增值税普通发票含电子</span>
                <span v-else-if="scope.row.recordInvoiceLine === 1">增值税专用发票/机动车票</span>
            </template>
            </el-table-column>
            <el-table-column
            header-align="center"
            align="center"
            label="开票时间"
            minWidth="100px">
            <template slot-scope="scope">
                {{$moment(scope.row.kpTime).format('YYYY-MM-DD HH:MM:SS')}}
            </template>
            </el-table-column>
            <el-table-column
            header-align="center"
            align="center"
            label="查验时间"
            minWidth="100px">
            <template slot-scope="scope">
                {{$moment(scope.row.createTime).format('YYYY-MM-DD HH:MM:SS')}}
            </template>
            </el-table-column>
            <el-table-column
            label="查验状态"
            header-align="center"
            align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.status === 0">查询中</span>
                <span v-else-if="scope.row.status === 1">查询失败</span>
                <span v-else-if="scope.row.status === 2" style="cursor: pointer" @click="recordDetail(scope.row.logs)">
                    真票 <i class="el-icon-search primary-icon"></i>
                </span>
                <el-tooltip v-else-if="scope.row.status === 3" effect="dark" placement="left">
                    <div slot="content" style="width: 200px">{{scope.row.logs}}</div>
                    <span>查验不一致 <i class="el-icon-warning-outline info-icon"></i></span>
                </el-tooltip>
                <span v-else-if="scope.row.status === 4">查无此票</span>
                <span v-else-if="scope.row.status === 5">超过当天查验次数</span>
            </template>
            </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :current-page="pagination.currPage"
            @current-change="(currentPage) => getRecordList(currentPage)"
            :total="pagination.totalCount">
        </el-pagination>
        <VerifyDetail v-if="verifyDetailVisible" ref="verifyDetail" />
        <VerifyForm v-if="veriftFormVisible" ref="verifyForm" @refresh="getRecordList()" />
    </div>
</template>

<script>
    import VerifyDetail from './components/verify-detail'
    import VerifyForm from './components/verify-form'
    import omit from 'lodash/omit'
    import isEmpty from 'lodash/isEmpty'
    export default {
      data () {
        return {
          loading: false,
          veriftFormVisible: false,
          verifyDetailVisible: false,
          queryForm: {
            FPHM: null,
            invoiceLine: null,
            RecordStatus: null,
            kpTime: [],
            recordTime: []
          },
          recordList: [],
          pagination: {}
        }
      },
      components: {
        VerifyDetail,
        VerifyForm
      },
      mounted () {
        this.getRecordList()
      },
      methods: {
        veriftFormHandle () {
          this.veriftFormVisible = true
          this.$nextTick(() => {
            this.$refs['verifyForm'].init()
          })
        },
        getRecordList (currentPage) {
          this.loading = true
          const queryData = this.queryForm
          let params = omit(queryData, ['kpTime', 'recordTime'])
          if (!isEmpty(queryData.kpTime)) {
            params.KpTimeStart = queryData.kpTime[0]
            params.KpTimeEnd = queryData.kpTime[1]
          }
          if (!isEmpty(queryData.recordTime)) {
            params.RecordTimeStart = queryData.recordTime[0]
            params.RecordTimeEnd = queryData.recordTime[1]
          }
          this.$http({
            url: this.$http.adornOperateUrl('/record/query'),
            method: 'get',
            params: {
              Page: currentPage || 1,
              Limit: 10,
              ...params
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              let pagination = omit(data.data, ['list'])
              this.pagination = pagination
              this.recordList = data.data.list
            }
          }).finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        },
        // 查看查验详情
        recordDetail (record) {
          this.verifyDetailVisible = true
          this.$nextTick(() => {
            this.$refs['verifyDetail'].init(record)
          })
        }
      }
    }
</script>