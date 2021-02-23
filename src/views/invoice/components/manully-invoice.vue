<template>
    <el-dialog
        title="开票申请"
        width="1248px"
        :visible.sync="visible"
        top="24px"
        :append-to-body="true">
        <div class="invoice-detail">
            <el-form :model="invoiceForm" ref="invoiceForm" :rules="formRules" class="invoice-inner">
                <div class="invoice-title">
                    <dl>
                        <dd><em class="f-brown">发票代码：</em></dd>
                        <dd><em class="f-brown">发票号码：</em></dd>
                        <dd><em class="f-brown">开票日期：</em>
                        {{$moment(new Date()).format('YYYY年MM月DD日')}}
                        </dd>
                    </dl>
                    <h3>
                        <span>
                            <em>
                                <span id="invoice-zhang"></span>
                                <span v-if="this.invoiceLine === 'p'">增值税电子普通发票</span>
                                <span v-else-if="this.invoiceLine === 's'">增值税专用发票</span>
                            </em>
                        </span>
                    </h3>
                </div>
                <table class="detail-table">
                    <tbody>
                        <tr>
                            <th style="width: 24px">购买方</th>
                            <td style="width: 50%">
                                <div class="input-item">
                                    <label class="table-label"><span>名称</span>：</label>
                                    <el-form-item class="input-wrap" prop="buyName" :show-message="false">
                                        <input v-model="invoiceForm.buyName" :maxLength="128" placeholder="请输入购买方名称（必填）" />
                                        <span @click="handleCustomListVisible(true)" style="position: absolute; right: 0; width: 30px; font-size: 20px; border-left: 1px solid #e6e6e6; cursor: pointer; text-align: center;">
                                            <i class="el-icon-more"></i>
                                        </span>
                                    </el-form-item>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>纳税人识别号</span>：</label>
                                    <el-form-item class="input-wrap" prop="buyTaxNum" :show-message="false">
                                        <input v-model="invoiceForm.buyTaxNum" :maxLength="64" :placeholder="`请输入纳税人识别号${ this.invoiceLine === 's' ? '(必填)' : ''}`" />,
                                    </el-form-item>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>地址</span>：</label>
                                    <el-form-item class="input-wrap" prop="buyAddress" :show-message="false">
                                        <input v-model="invoiceForm.buyAddress" :maxLength="200" placeholder="请输入地址" />,
                                    </el-form-item>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>开户行</span>：</label>
                                    <el-form-item class="input-wrap" prop="buyBank" :show-message="false">
                                        <input v-model="invoiceForm.buyBank" :maxLength="64" placeholder="请输入银行账户" />,
                                    </el-form-item>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>开户账号</span>：</label>
                                    <el-form-item class="input-wrap" prop="buyBankAccount" :show-message="false">
                                        <input v-model="invoiceForm.buyBankAccount" :maxLength="64" placeholder="请输入银行账户" />,
                                    </el-form-item>
                                </div>
                            </td>
                            <th style="width: 24px">通知到</th>
                            <td>
                                <div class="input-item">
                                    <label class="table-label"><span>手机号码</span>：</label>
                                    <el-form-item class="input-wrap" prop="mobile" :show-message="false">
                                        <input v-model="invoiceForm.mobile" :maxLength="16" placeholder="请输入手机号码（必填）" />,
                                    </el-form-item>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>邮箱地址</span>：</label>
                                    <el-form-item class="input-wrap" prop="email" :show-message="false">
                                        <input v-model="invoiceForm.email" :maxLength="50" placeholder="请输入邮箱地址" />,
                                    </el-form-item>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="invoice-grid">
                    <table class="datagrid-table">
                        <colgroup>
                            <col width="24px" />
                            <col width="22%" />
                            <col width="10%" />
                            <col width="6%" />
                            <col width="10%" />
                            <col width="14%" />
                            <col width="14%" />
                            <col width="8%" />
                        </colgroup>
                        <thead class="datagrid-thead">
                            <tr class="table-row">
                                <th style="cursor: pointer; borderRight: 1px solid #e6e6e6" @click="productListHandle">
                                    <i class="el-icon-more"></i>
                                </th>
                                <th style="border-left: 0">
                                    <span class="cell-text">*简称*货物或应税劳务、服务名称</span>
                                </th>
                                <th>
                                    <span class="cell-text">规格型号</span>
                                </th>
                                <th>
                                    <span class="cell-text">单位</span>
                                </th>
                                <th>
                                    <span class="cell-text">数量</span>
                                </th>
                                <th>
                                    <span class="cell-text">单价</span>
                                </th>
                                <th>
                                    <span class="cell-text">金额（含税）</span>
                                </th>
                                <th>
                                    <span class="cell-text">税率</span>
                                </th>
                                <th>
                                    <span class="cell-text">税额</span>
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <div :style="{maxHeight: '228px', overflowY: 'auto', marginRight: goodsList.length > 8 ? `-${scrollBarWidth}px` : 0}">
                        <table class="datagrid-table">
                            <colgroup>
                                <col width="24px" />
                                <col width="22%" />
                                <col width="10%" />
                                <col width="6%" />
                                <col width="10%" />
                                <col width="14%" />
                                <col width="14%" />
                                <col width="8%" />
                            </colgroup>
                            <tbody>
                                <tr v-for="item, index in goodsList">
                                    <td style="border-right: 1px solid #e6e6e6">
                                        <span class="cell-text">
                                            <i class="el-icon-delete" @click="removeRowItem(index)" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <input :maxLength="64" :value="item.name" @change="e => handleChange(e, index, 'name')" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <input :maxLength="40" :value="item.spec" @change="e => handleChange(e, index, 'spec')" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <input :maxLength="22" :value="item.unit" @change="e => handleChange(e, index, 'unit')" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <input type="number" :min="0" :max="2147483647" :value="item.num" @change="e => handleChange(e, index, 'num')" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <input type="number" :min="0" :max="2147483647" :value="item.price" @change="e => handleChange(e, index, 'price')" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <input type="number" :min="0" :max="2147483647" :value="item.priceTotal" @change="e => handleChange(e, index, 'priceTotal')" />
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            <el-select size="mini" :value="item.taxRate" style="width: 100%" @change="value => handleSelectChange(value, index)">
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
                                        </span>
                                    </td>
                                    <td>
                                        <span class="cell-text">
                                            {{item.tax}}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-right: 1px solid #e6e6e6">
                                        <span class="cell-text">
                                            <i class="el-icon-plus" @click="addTableRow" />
                                        </span>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <table class="datagrid-table">
                        <colgroup>
                            <col width="24px" />
                            <col width="22%" />
                            <col width="10%" />
                            <col width="6%" />
                            <col width="10%" />
                            <col width="14%" />
                            <col width="14%" />
                            <col width="8%" />
                        </colgroup>
                        <tbody>
                            <tr style="text-align: center">
                                <td style="border-right: 1px solid #e6e6e6"></td>
                                <td>
                                    <span class="cell-text f-brown">合计</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>{{totalPrice}}</td>
                                <td></td>
                                <td>{{totalTax}}</td>
                            </tr>
                            <tr style="border: 2px solid #9e5209; color: #9e5209">
                                <td colspan="2">
                                    <span class="cell-text">价税合计(大写)</span>
                                </td>
                                <td colspan="7">
                                    <span class="cell-text" style="width: 50%; float: left">
                                    {{priceParseChina}}
                                    </span>
                                    <span class="cell-text" style="width: 50%; float: left">
                                    (小写){{totalPrice + totalTax}}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <table class="detail-table">
                    <tbody>
                        <tr>
                            <th style="width: 24px">销售方</th>
                            <td style="width: 50%">
                                <div class="input-item">
                                    <label class="table-label"><span>名称</span>：</label>
                                    <span class="input-wrap">
                                        <input readOnly :value="currentCompany && currentCompany.name" />
                                    </span>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>纳税人识别号</span>：</label>
                                    <span class="input-wrap">
                                        <input readOnly :value="currentCompany && currentCompany.taxNum" />
                                    </span>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>地址</span>：</label>
                                    <span class="input-wrap">
                                        <input readOnly :value="currentCompany && `${currentCompany.province || ''}${currentCompany.city || ''}${currentCompany.area || ''}${currentCompany.address || ''}`" style="float: left; width: 270px" />
                                        <label class="table-label" style="width: auto"><span style="width: auto">电话</span>：</label>
                                        <span class="input-wrap" style="padding-left: 0; margin-left: 0; width: 150px">
                                            <input readOnly :value="currentCompany && currentCompany.mobile" />
                                        </span>
                                    </span>
                                </div>
                                <div class="input-item">
                                    <label class="table-label"><span>开户行及账号</span>：</label>
                                    <span class="input-wrap">
                                        <input readOnly :value="currentCompany && `${currentCompany.bank || ''}${currentCompany.bankAccount || ''}`" />
                                    </span>
                                </div>
                            </td>
                            <th style="width: 24px">备注</th>
                            <td>
                                <textarea :maxLength="200" v-model="invoiceForm.remark" style="width: 100%; resize: none; border: 0; outline: none;" rows="5"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="invoice-bottom">
                    <el-row>
                        <el-col :span="6">
                            <label class="table-label">收款人 :</label>
                            <el-form-item class="input-wrap" prop="payee" :show-message="false">
                                <input v-model="invoiceForm.payee" :maxLength="8" placeholder="收款人" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="table-label">复核人 :</label>
                            <el-form-item class="input-wrap" prop="checker" :show-message="false">
                                <input v-model="invoiceForm.checker" :maxLength="8" placeholder="复核人" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="table-label">开票人 :</label>
                            <el-form-item class="input-wrap" prop="clerk" :show-message="false">
                                <input v-model="invoiceForm.clerk" :maxLength="8" placeholder="开票人（必填）" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="table-label">销售方 :</label>
                            <span class="input-wrap f-brown">
                                （章）
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="submit" @click="onSubmit()">提交</el-button>
        </span>
        <CustomList @selected="selectedCustom" v-if="customListVisible" ref="customList" />
        <ProductList @selected="selectedProduct" v-if="productListVisible" ref="productList" />
    </el-dialog>
</template>

<script>
    import map from 'lodash/map'
    import every from 'lodash/every'
    import assign from 'lodash/assign'
    import reduce from 'lodash/reduce'
    import isEmpty from 'lodash/isEmpty'
    import pick from 'lodash/pick'
    import concat from 'lodash/concat'
    import find from 'lodash/find'
    import { numberParseChina, scrollbarWidth } from '@/utils'
    import CustomList from './custom-list'
    import ProductList from './product-list'
    export default {
      name: 'manully-invoice',
      data () {
        var validateMobile = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('公司电话不能为空'))
          } else if (!/^1\d{10}$/.test(value)) {
            callback(new Error('请输入正确的电话号码'))
          } else {
            callback()
          }
        }
        return {
          submit: false,
          invoiceLine: 'p',
          customListVisible: false,
          productListVisible: false,
          visible: false,
          goodsList: [],
          totalPrice: 0,
          totalTax: 0,
          invoiceForm: {
            buyName: '',
            buyTaxNum: '',
            buyAddress: '',
            buyBank: '',
            buyBankAccount: '',
            mobile: '',
            email: '',
            remark: '',
            payee: '',
            checker: '',
            clerk: ''
          },
          formRules: {
            buyName: [{
              required: true,
              message: '购买方名称不能为空'
            }],
            buyTaxNum: [{
              required: this.invoiceLine === 's',
              message: '购买方税号不能为空'
            }],
            mobile: [{
              required: true,
              message: '购买方联系方式不能为空'
            }, {
              validator: validateMobile,
              trigger: 'blur'
            }],
            clerk: [{
              required: true,
              message: '开票人不能为空'
            }]
          }
        }
      },
      mounted () {
        this.$watch('goodsList', function (newVal, oldVal) {
          this.totalPrice = Number(reduce(this.goodsList, (total, obj) => {
            return total + (obj.priceTotal || 0)
          }, 0).toFixed(2))
          this.totalTax = Number(reduce(this.goodsList, (total, obj) => {
            return total + (obj.tax || 0)
          }, 0).toFixed(2))
        }, {
          deep: true
        })
      },
      components: {
        CustomList,
        ProductList
      },
      computed: {
        currentCompany: {
          get () { return this.$store.state.user.currentCompany },
          set (val) { this.$store.commit('user/updateCurrentCompany', val) }
        },
        scrollbarWidth: () => scrollbarWidth(),
        priceParseChina: function () {
          return numberParseChina(this.totalPrice + this.totalTax)
        }
      },
      methods: {
        // 初始化
        init (invoiceLine) {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['invoiceForm'].resetFields()
            this.invoiceLine = invoiceLine
          })
        },
        // 客户列表
        handleCustomListVisible () {
          this.customListVisible = true
          this.$nextTick(() => {
            this.$refs['customList'].init()
          })
        },
        // 选中客户
        selectedCustom (values) {
          let customInfo = pick(values, ['buyName', 'buyAddress', 'buyTaxNum', 'mobile', 'email', 'buyBank', 'buyBankAccount'])
          this.invoiceForm = assign({}, this.invoiceForm, customInfo)
        },
        // 选中商品
        selectedProduct (values) {
          if (isEmpty(values)) {
            this.$message.info('未选择商品')
            return false
          }
          this.goodsList = concat(this.goodsList, values)
        },
        // 产品列表
        productListHandle () {
          this.productListVisible = true
          this.$nextTick(() => {
            this.$refs['productList'].init()
          })
        },
        // 移除商品行
        removeRowItem (index) {
          this.goodsList.splice(index, 1)
        },
        // 税率选择框Change
        handleSelectChange (value, index) {
          let list = this.goodsList
          list[index].taxRate = value
          if (list[index].price && list[index].num) {
            list[index].tax = parseFloat((list[index].price * list[index].taxRate * list[index].num).toFixed(2))
            list[index].taxAmt = (list[index].price + list[index].tax) * list[index].num
          }
          this.goodsList = list
        },
        handleChange (event, index, key) {
          const value = event.target.value
          let list = this.goodsList
        // 输入内容为价格、数量、含税金额
          if ((/price|num|taxAmt/).test(key)) {
            list[index][key] = value ? Number(value) : 0
          } else {
            list[index][key] = value
          }
            // 数量不为空时计算单价、含税金额
          if (list[index].num) {
                // 输入内容为价格
            if (key === 'price') {
              list[index].priceTotal = parseFloat((list[index].price * list[index].num).toFixed(2))
                // 输入内容为含税金额
            } else if (key === 'priceTotal') {
              list[index].price = parseFloat((list[index].priceTotal / list[index].num).toFixed(2))
                // 输入内容为数量
            } else if (key === 'num') {
                    // 价格不为空计算含税金额
              if (list[index].price) {
                list[index].priceTotal = parseFloat((list[index].price * list[index].num).toFixed(2))
                    // 含税金额不为空计算单价
              } else if (list[index].priceTotal) {
                list[index].price = parseFloat((list[index].priceTotal / list[index].num).toFixed(2))
              }
            }
                // 计算税额
            if (list[index].priceTotal) {
              list[index].tax = parseFloat((list[index].priceTotal * list[index].taxRate).toFixed(2))
            }
          }
          this.goodsList = list
        },
        // 添加商品行
        addTableRow () {
          this.goodsList.push({
            name: '',
            spec: '',
            taxRate: 0,
            price: null,
            num: null
          })
        },
        // 表单提交
        onSubmit () {
          this.$refs['invoiceForm'].validate((valid, err) => {
            if (valid) {
              this.submit = true
              // 验证商品信息列表
              if (!every(map(this.goodsList, (value) => {
                return every(pick(value, ['name', 'price', 'num']))
              }))) {
                this.$message.info('map')
                return false
              }
              let productDtos = map(this.goodsList, (item) => {
                return pick(item, ['id', 'name', 'tax', 'taxRate', 'price', 'num', 'unit', 'spec'])
              })
              let buyDtoInfo = pick(this.invoiceForm, ['id', 'companyId', 'mobile', 'email', 'buyName', 'buyTaxNum', 'buyAddress', 'buyBank', 'buyBankAccount'])
              this.$http({
                url: this.$http.adornOperateUrl('/invoice/save'),
                method: 'post',
                data: {
                  buyDto: buyDtoInfo,
                  productDtos: productDtos,
                  remark: this.invoiceForm.remark || '',
                  clerk: this.invoiceForm.clerk,
                  payee: this.invoiceForm.payee || '',
                  checker: this.invoiceForm.checker || '',
                  invLine: this.invoiceLine,
                  kpType: 1
                }
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  this.visible = false
                  this.$emit('refresh')
                }
              }).finally(() => {
                this.submit = false
              })
            } else {
              this.$message.info(find(err)[0].message)
            }
          })
        }
      }
    }
</script>