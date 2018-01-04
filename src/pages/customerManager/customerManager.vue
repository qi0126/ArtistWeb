<template>
  <div class="customerManager">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="contentWrapper">
      <div class="leftWrapper">
        <div class="top">
          <span class="title">客户列表</span>
        </div>
        <div class="bottom">
          <el-input class="searchInput" placeholder="客户名称、编号、客户联系人" prefix-icon="el-icon-search" v-model="searchKey" size="small" @blur="searchCust"></el-input>
          <el-button class="addCustInput" icon="el-icon-plus" @click="addNewCustOuterDialog = true" plain>添加新客户</el-button>
          <div class="custOptions">
            <el-button class="custOptionsItem" size="small" plain icon="el-icon-circle-check" :disabled="startAndStopUseState" @click="startAndStopUse(1)">启用</el-button>
            <el-button class="custOptionsItem" size="small" plain icon="el-icon-remove" :disabled="startAndStopUseState" @click="startAndStopUse(0)">禁用</el-button>
            <el-button type="danger" class="custOptionsItem" icon="el-icon-delete" :disabled="startAndStopUseState" @click="delCust" size="small">删除</el-button>
          </div>
          <div class="custListParent">
            <el-table
              v-loading="loading"
              :data="customers"
              ref="customersTable"
              :show-header="false"
              max-height="500"
              :highlight-current-row="true"
              @select="custSelete"
              @row-click="getCustInfo"
              @current-change="customersChange"
              style="width: 100%">
              <el-table-column
                align="center"
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                class-name="bt-hover">
                <template slot-scope="scope">
                  <div :class="{'forbidden':scope.row.status == 0}">{{scope.row.customerName}}
                    <span class="forbidden" v-show="scope.row.status == 0">(已禁用)</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="rightWrapper">
        <div class="top">
          <span class="title">客户信息</span>
        </div>
        <div class="bottom">
          <div class="custInfo">
            <div class="title">客户基本信息</div>
            <div class="content">
              <div class="contentItem">
                <span class="contentItemText">客户名称</span>
                <el-input v-model="customer.customerName" size="small" placeholder="请填写客户名称" @change="setCustInfo(customer.id)"></el-input>
                <span class="mark">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">上级客户</span>
                <el-input v-model="customer.parentCustomer" size="small" placeholder="请填写上级客户" @change="setCustInfo('')"></el-input>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">客户编码</span>
                <el-input v-model="customer.customerNumber" size="small" placeholder="请填写客户编码" @change="setCustInfo('')"></el-input>
                <span class="mark">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">新品时效</span>
                <el-select class="allScreen" v-model="customer.looknewAging" placeholder="请选择" size="small" @change="setCustInfo('')">
                  <el-option
                    v-for="item in newProValiditys"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">所属省份</span>
                <el-select class="allScreen" v-model="customer.provinceId" placeholder="请选择" size="small" @change="provinceChange(false)">
                  <el-option
                    v-for="item in provincesAndCitys"
                    :key="item.provinceId"
                    :value="item.provinceId"
                    :label="item.provinceName">
                  </el-option>
                </el-select>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">所属城市</span>
                <el-select class="allScreen" v-model="customer.cityId" placeholder="请选择" size="small" @change="setCustInfo(null)">
                  <el-option
                    v-for="item in citys"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                  </el-option>
                </el-select>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">业务跟进人</span>
                <el-select class="allScreen" v-model="customer.busiSaleId" placeholder="请选择" size="small" @change="setCustInfo(null)">
                  <el-option
                    v-for="item in followPeoples"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                  </el-option>
                </el-select>
                <span class="mark">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">月 利 率</span>
                <el-input v-model="customer.monthRate" size="small" placeholder="请填写月利率" @change="setCustInfo(null)"></el-input>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">授信额度</span>
                <el-input v-model="customer.creditLine" size="small" placeholder="请填写授信额度" @change="setCustInfo(null)"></el-input>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">免息周期</span>
                <el-input v-model="customer.gracePeriod" size="small" placeholder="请填写免息周期" @change="setCustInfo(null)"></el-input>
                <span class="mark hidden">*</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">出货返利</span>
                <el-input v-model="customer.shipmentRebate" size="small" placeholder="请填写出货返利" @change="setCustInfo(null)"></el-input>
                <span class="unit">元/g</span>
              </div>

              <div class="contentItem">
                <span class="contentItemText">工费优惠</span>
                <el-input v-model="customer.wageDiscounts" size="small" placeholder="请填写工费优惠" @change="setCustInfo(null)"></el-input>
                <span class="unit">元/g</span>
              </div>

            </div>
          </div>
          <div class="custLinkman">
            <div class="custLinkmanTop">
              <div class="title">客户联系人</div>
              <el-button type="primary" size="small" @click="addLinkmanDialog = true">新增联系人</el-button>
            </div>
            <div class="content">
              <el-table
                :data="customerContact"
                max-height="220"
                border
                style="width: 100%">
                <el-table-column
                  align="center"
                  label="姓名">
                  <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.name" size="small" @change="linkmanBlurEvent(scope.row,'name')"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="昵称">
                  <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.nickname" size="small" @change="linkmanBlurEvent(scope.row,'nickname')"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="联系电话">
                  <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.phone" size="small" :maxlength="11" @change="linkmanBlurEvent(scope.row,'phone')"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="密码">
                  <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.password" size="small" @change="linkmanBlurEvent(scope.row,'password')"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="linkmanDelState" @click="deleteLinkman(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dialogWrapper">
      <el-dialog
        title="新增联系人"
        :visible.sync="addLinkmanDialog"
        width="30%">
        <div class="addLinkman">
          <div class="info">
            <el-input type="text" size="small" placeholder="请输入姓名" v-model.trim="addLinkmanInfo.name" class="childInp"></el-input>
            <el-input type="text" size="small" placeholder="请输入昵称" v-model.trim="addLinkmanInfo.nickname" class="childInp"></el-input>
            <el-input type="text" size="small" placeholder="请输入联系电话" :maxlength="11" v-model.trim="addLinkmanInfo.phone" class="childInp"></el-input>
            <el-input type="text" size="small" placeholder="请输入密码" v-model.trim="addLinkmanInfo.password" class="childInp"></el-input>
          </div>
          <div class="btns">
            <el-button type="primary" class="confirmBtn" @click="addLinkmanEvent">确 定</el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="添加新客户"
        :visible.sync="addNewCustOuterDialog"
        width="50%">
        <div class="addNewCust">
          <div class="baseInfoWrapper">
            <el-input size="small" v-model.trim="newCustObj.customerName" placeholder="客户名称（必填）" class="childInp"></el-input>
            <el-input size="small" v-model.trim="newCustObj.parentCustomer" placeholder="上级客户" class="childInp"></el-input>
            <el-input size="small" v-model.trim="newCustObj.customerNumber" placeholder="客户编码（必填）" class="childInp"></el-input>
            <el-select size="small" v-model.trim="newCustObj.looknewAging" placeholder="新品时效" class="childInp">
              <el-option
                v-for="item in newProValiditys"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
            <el-select size="small" v-model.trim="newCustObj.provinceId" placeholder="所属省份" class="childInp" @change="provinceChange(true)">
              <el-option
                v-for="item in provincesAndCitys"
                :key="item.provinceId"
                :value="item.provinceId"
                :label="item.provinceName">
              </el-option>
            </el-select>
            <el-select size="small" v-model.trim="newCustObj.cityId" placeholder="所属城市" class="childInp">
              <el-option
                v-for="item in citys"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
            <el-select size="small" v-model.trim="newCustObj.busiSaleId" placeholder="业务跟进人（必填）" class="childInp">
              <el-option
                v-for="item in followPeoples"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
            <el-input size="small" v-model.trim="newCustObj.monthRate" placeholder="月利率" class="childInp"></el-input>
            <el-input size="small" v-model.trim="newCustObj.creditLine" placeholder="授信额度" class="childInp"></el-input>
            <el-input size="small" v-model.trim="newCustObj.gracePeriod" placeholder="免息周期" class="childInp"></el-input>
            <el-input size="small" v-model.trim="newCustObj.shipmentRebate" placeholder="出货返利" class="childInp"></el-input>
            <el-input size="small" v-model.trim="newCustObj.wageDiscounts" placeholder="工费优惠" class="childInp"></el-input>
          </div>
          <div class="linkmanWrapper">
            <el-button size="mini" icon="el-icon-plus" @click="addNewCustInnerDialog = true">新增联系人</el-button>
            <el-table
              :data="newCustObj.customerContacts"
              size="small"
              max-height="200"
              style="width: 100%">
              <el-table-column
                label="姓名"
                align="center"
                prop="name">
              </el-table-column>
              <el-table-column
                label="昵称"
                align="center"
                prop="nickname">
              </el-table-column>
              <el-table-column
                label="联系电话"
                align="center"
                prop="phone">
              </el-table-column>
              <el-table-column
                label="密码"
                align="center"
                prop="password">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button size="mini" :disabled="linkmanDelByNewCustState" @click.native.prevent="delLinkman(scope.$index,newCustObj.customerContacts)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog
            width="30%"
            title="新增联系人"
            :visible.sync="addNewCustInnerDialog"
            append-to-body>
              <div class="linkmanChildWrapper">
                <div class="inpWrapper">
                  <el-input size="small" class="inpChild" v-model.trim="addLinkmanObj.name" placeholder="姓名"></el-input>
                  <el-input size="small" class="inpChild" v-model.trim="addLinkmanObj.nickname" placeholder="昵称"></el-input>
                  <el-input size="small" class="inpChild" :maxlength="11" v-model.trim="addLinkmanObj.phone" placeholder="联系电话"></el-input>
                  <el-input size="small" class="inpChild" v-model.trim="addLinkmanObj.password" placeholder="密码"></el-input>
                </div>
                <div class="btnWrapper">
                  <el-button type="primary" @click="addLinkmanByAdd">确 定</el-button>
                </div>
              </div>
            </el-dialog>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addNewCustOuterDialog = false">取消</el-button>
          <el-button type="primary" @click="saveNewCustEvent">保存</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      loading: true,
      // 添加客户数据对象
      newCustObj: {
        customerContacts: []
      },
      // 添加客户中的添加联系人
      addLinkmanObj: {},

      customerId: '',
      addLinkmanInfo: {
        name: '',
        nickname: '',
        phone: '',
        password: ''
      },
      addLinkmanDialog: false,
      customer: '', // 单个客户信息
      customers: [], // 所有客户
      customerContact: [], // 客户联系人
      searchKey: null,
      newProValiditys: [
        { value: 0, label: '即时可查看新品' },
        { value: 7, label: '7天后可查看新品' },
        { value: 15, label: '15天后可查看新品' },
        { value: 30, label: '30天后可查看新品' }
      ],
      provincesAndCitys: [], // 所有省、市
      citys: [],
      followPeoples: [], // 所有的业务跟进人
      selectCustomer: [], // 左侧选择的客户数组
      startAndStopUseState: true, // “启用”和“禁用”按钮是否被禁用
      linkmanDelState: true, // 客户联系人删除按钮禁用状态
      addNewCustOuterDialog: false,
      addNewCustInnerDialog: false,
      linkmanDelByNewCustState: false // 添加客户时新增客户联系人“删除”按钮禁用状态
    }
  },
  methods: {
    // 保存新客户
    saveNewCustEvent() {
      if (this.saveNewCustCheck()) {
        this.Axios
          .post('/customer/customer', this.newCustObj)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.$message.success('客户添加成功')
              this.getCustomers()
              this.addNewCustOuterDialog = false
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.saveNewCustEvent)
          })
      }
    },
    // 保存新客户条件过滤
    saveNewCustCheck() {
      if (!this.newCustObj.customerName) {
        this.$message.error('客户名称不能为空')
        return false
      }
      if (!this.newCustObj.customerNumber) {
        this.$message.error('客户编码不能为空')
        return false
      }
      if (!this.newCustObj.busiSaleId) {
        this.$message.error('业务跟进人不能为空')
        return false
      }
      if (this.newCustObj.customerContacts.length < 1) {
        this.$message.error('请至少添加一位客户联系人')
        return false
      }
      if (!this.newCustObj.parentCustomer) {
        this.$set(this.newCustObj, 'parentCustomer', '')
      }
      if (!this.newCustObj.looknewAging) {
        this.$set(this.newCustObj, 'looknewAging', '')
      }
      if (!this.newCustObj.provinceId) {
        this.$set(this.newCustObj, 'provinceId', '')
      }
      if (!this.newCustObj.cityId) {
        this.$set(this.newCustObj, 'cityId', '')
      }
      if (!this.newCustObj.monthRate) {
        this.$set(this.newCustObj, 'monthRate', '')
      }
      if (!this.newCustObj.creditLine) {
        this.$set(this.newCustObj, 'creditLine', '')
      }
      if (!this.newCustObj.gracePeriod) {
        this.$set(this.newCustObj, 'gracePeriod', '')
      }
      if (!this.newCustObj.shipmentRebate) {
        this.$set(this.newCustObj, 'shipmentRebate', '')
      }
      if (!this.newCustObj.wageDiscounts) {
        this.$set(this.newCustObj, 'wageDiscounts', '')
      }
      return true
    },
    // 删除客户联系人（添加客户）
    delLinkman(index, rows) {
      rows.splice(index, 1)
    },
    // 添加客户联系人
    addLinkmanByAdd() {
      let linkmanObj = this.addLinkmanObj
      if (
        !linkmanObj.name ||
        !linkmanObj.nickname ||
        !linkmanObj.phone ||
        !linkmanObj.password
      ) {
        this.$message.error('数据填写不完整')
      } else {
        this.newCustObj.customerContacts.unshift(this.addLinkmanObj)
        this.addNewCustInnerDialog = false
      }
    },
    // 客户搜索
    searchCust() {},
    // 启用或禁用
    startAndStopUse(mark) {
      let ids = []
      this.selectCustomer.forEach(value => {
        ids.push(value.id)
      })
      let params = {
        ids: ids,
        isDisable: mark == 1 ? 1 : 0
      }
      this.Axios
        .put('/customer/customer/disable', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.getCustomers()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.startUse)
        })
    },
    // 删除客户
    delCust() {
      let ids = []
      this.selectCustomer.forEach(val => {
        ids.push(val.id)
      })
      let params = {
        PRS: {
          ids: ids
        }
      }
      this.$confirm('确定永久删除选中客户？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.Axios
            .delete('/customer/customer/batch', params)
            .then(res => {
              this.getCustomers()
            })
            .catch(err => {
              this.extCatch(err, this.delCust)
            })
        })
        .catch(() => {})
    },
    // 添加客户联系人
    addLinkmanEvent() {
      this.addLinkmanInfo.customerId = this.customerId
      if (this.addLinkmanCheck()) {
        this.Axios
          .post('customer/customer/contact', this.addLinkmanInfo)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.addLinkmanDialog = false
              this.getCustInfo({ id: this.customerId })
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.addLinkmanEvent)
          })
      }
    },
    // 修改客户联系人
    linkmanBlurEvent(row, columnName) {
      let obj = {
        id: row.id
      }
      if (columnName == 'name') {
        obj.name = row.name
      } else if (columnName == 'nickname') {
        obj.nickname = row.nickname
      } else if (columnName == 'phone') {
        obj.phone = row.phone
      } else if (columnName == 'password') {
        obj.password = row.password
      }
      this.Axios
        .put('customer/customer/contact', obj)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.linkmanBlurEvent)
        })
    },
    // 删除客户联系人
    deleteLinkman(row) {
      this.$confirm('确定删除该联系人？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.Axios
            .delete(`customer/customer/contact/${row.id}`)
            .then(res => {
              this.getCustInfo({ id: this.customerId })
            })
            .catch(err => {
              this.extCatch(err, this.deleteLinkman)
            })
        })
        .catch(() => {})
    },
    // 添加客户联系人条件过滤
    addLinkmanCheck() {
      let obj = this.addLinkmanInfo
      if (obj.id == '') {
        this.$message.error('客户id不能为空')
        return false
      } else if (obj.name == '') {
        this.$message.error('姓名不能为空')
        return false
      } else if (obj.nickname == '') {
        this.$message.error('昵称不能为空')
        return false
      } else if (obj.phone == '') {
        this.$message.error('联系电话不能为空')
        return false
      } else if (obj.password == '') {
        this.$message.error('密码不能为空')
        return false
      }
      return true
    },
    // 获取所有客户列表
    getCustomers() {
      this.Axios
        .get('/customer/customer')
        .then(res => {
          this.loading = false
          let result = res.data
          if (result.code == 0) {
            this.customers = result.data
            this.$nextTick(() => {
              if (this.customers.length > 0) {
                let defaultItem = this.customers[0]
                this.$refs.customersTable.setCurrentRow(defaultItem)

                this.selectCustomer = []
              }
            })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.extCatch(err, this.getCustomers)
        })
    },
    // 获取客户信息
    getCustInfo(row) {
      this.Axios
        .get(`/customer/customer/${row.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.customer = result.data.customer
            this.customerContact = result.data.customerContact

            this.newProValidity = this.customer.looknewAging // 新品时效
            this.provinceId = this.customer.provinceId
            this.cityId = this.customer.cityId
            this.followPeople = this.customer.busiSaleId
            this.customerId = this.customer.id
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getCustInfo)
        })
    },
    // 左侧客户复选框选择事件
    custSelete(selection) {
      this.selectCustomer = selection
    },
    // 获取所有省、市
    provincesAndcitys() {
      this.Axios
        .get('customer/customer/provinceCity')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.provincesAndCitys = result.data
            this.getCustomers()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.provincesAndcitys)
        })
    },
    // 省、市二级联动
    provinceChange(isAddCustModel) {
      let obj = isAddCustModel ? this.newCustObj : this.customer
      for (let i = 0; i < this.provincesAndCitys.length; i++) {
        if (obj.provinceId == this.provincesAndCitys[i].provinceId) {
          this.citys = this.provincesAndCitys[i].cities
          obj.cityId = this.provincesAndCitys[i].cities[0].id
          // 修改客户模块
          if (!isAddCustModel) {
            this.setCustInfo(null)
          }
          break
        }
      }
    },
    // 获取业务跟进人
    getFollowPeoples() {
      this.Axios
        .get('/saler/saler')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.followPeoples = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getFollowPeoples)
        })
    },
    // 默认加载第一个客户
    customersChange(val) {
      this.getCustInfo(val)
    },
    // 修改客户信息
    setCustInfo(id) {
      this.Axios
        .put(`/customer/customer/${this.customer.id}`, this.customer)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
            this.customers.forEach(val => {
              if (val.id == id) {
                val.customerName = this.customer.customerName
              }
            })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.setCustInfo)
        })
    }
  },
  created() {
    this.provincesAndcitys()
    this.getFollowPeoples()
  },
  watch: {
    myProvinceId(val) {
      for (let i = 0; i < this.provincesAndCitys.length; i++) {
        if (val == this.provincesAndCitys[i].provinceId) {
          this.citys = this.provincesAndCitys[i].cities
          break
        }
      }
    },
    addLinkmanDialog(val) {
      if (!val) {
        this.addLinkmanInfo.name = ''
        this.addLinkmanInfo.nickname = ''
        this.addLinkmanInfo.phone = ''
        this.addLinkmanInfo.password = ''
      }
    },
    selectCustomer(val) {
      if (val.length > 0) {
        this.startAndStopUseState = false
      } else {
        this.startAndStopUseState = true
      }
    },
    customerContact(val) {
      if (val.length > 1) {
        this.linkmanDelState = false
      } else {
        this.linkmanDelState = true
      }
    },
    addNewCustOuterDialog(val) {
      if (!val) {
        this.newCustObj = {
          customerContacts: []
        }
      }
    },
    addNewCustInnerDialog(val) {
      if (!val) {
        this.addLinkmanObj = {}
      }
    },
    batchLinkman(val) {
      if (val.length > 1) {
        this.linkmanDelByNewCustState = false
      } else {
        this.linkmanDelByNewCustState = true
      }
    }
  },
  computed: {
    myProvinceId() {
      return this.customer.provinceId
    },
    batchLinkman() {
      return this.newCustObj.customerContacts
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.customerManager
  .contentWrapper
    display flex
    .leftWrapper
      flex 0 20rem
      width 20rem
      margin 20px 40px 20px 0
      .top
        margin-bottom 20px
        .title
          font-size 16px
          color #333333
          padding-left 8px
          border-left 2px solid $base-color
      .bottom
        padding 10px
        border 1px solid #D9D9D9
        border-radius 3px
        min-height 750px
        .addCustInput
          margin 10px 0
          width 100%
        .custOptions
          display flex
          justify-content space-between
          margin-bottom 10px
          .custOptionsItem
            width 28%
          .custItem
            padding 15px 0
            border-bottom 1px solid #F1F1F1
            margin 0
        .custListParent
          .forbidden
            color #CFCFCF
    .rightWrapper
      flex 1
      overflow hidden
      margin 20px 40px 20px 0
      .top
        margin-bottom 20px
        .title
          font-size 16px
          color #333333
          padding-left 8px
          border-left 2px solid $base-color
      .bottom
        padding 10px
        border 1px solid #D9D9D9
        border-radius 3px
        min-height 750px
        .custInfo
          margin-left 30px
          .title
            margin 16px 16px 16px 0
          .content
            display flex
            flex-wrap wrap
            justify-content space-around
            .contentItem
              width 45%
              display flex
              align-items center
              margin 15px 0
              .allScreen
                width 100%
              .contentItemText
                white-space nowrap
                margin-right 10px
                color #999999
                width 80px
                text-align right
              .mark
                color $base-color
                font-weight bold
                margin-left 8px
              .hidden
                opacity 0
              .unit
                margin-left 8px
        .custLinkman
          margin-top 50px
          margin-left 30px
          .custLinkmanTop
            display flex
            justify-content space-between
            align-items center
            margin-bottom 15px
  .dialogWrapper
    .addLinkman
      display flex
      flex-wrap wrap
      .info
        display flex
        flex-wrap wrap
        justify-content space-between
        .childInp
          width 48%
          margin-bottom 15px
      .btns
        margin 15px auto 0 auto
    .addNewCust
      .baseInfoWrapper
        display flex
        flex-wrap wrap
        justify-content space-between
        .childInp
          width 30%
          margin-bottom 15px
.linkmanChildWrapper
  .inpWrapper
    display flex
    flex-wrap wrap
    justify-content space-between
    .inpChild
      width 48%
      margin-bottom 15px
  .btnWrapper
    display flex
    justify-content center
    margin-top 10px
</style>
