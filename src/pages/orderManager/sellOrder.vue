<template>
  <div class="sellOrder">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>销售订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="searchWrapper">
      <div class="searchPlace">
        <div class="item">
          <el-input placeholder="请输入关键词搜索" prefix-icon="el-icon-search" v-model="filterKeys.searchKey" size="small"></el-input>
        </div>
        <div class="item">
          <span class="title">订单状态</span>
          <el-select v-model="filterKeys.orderStatus" placeholder="请选择" size="small">
            <el-option
              v-for="item in staticData.allOrderStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="title">时间筛选</span>
          <el-date-picker
            v-model="filterKeys.startTime"
            align="right"
            size="small"
            type="date"
            placeholder="开始日期"
            :picker-options="$store.state.pickerOptions">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="filterKeys.endTime"
            align="right"
            size="small"
            type="date"
            placeholder="结束日期"
            :picker-options="$store.state.pickerOptions">
          </el-date-picker>
        </div>
      </div>
      <div class="optionPlace">
        <el-button class="item" type="primary" size="small" plain>指派订单</el-button>
        <el-button class="item" type="primary" size="small" plain>导入订单</el-button>
        <el-button class="item" type="primary" size="small">导出订单</el-button>
      </div>
    </div>

    <div class="contentWrapper">
      <el-collapse
        v-loading="loading"
        accordion
        @change="collapseChange">
        <el-collapse-item v-for="(order,index) in allOrders" :key="index" :name="index">
          <template slot="title">
            <div class="header">
              <el-checkbox></el-checkbox>
              <div class="item">
                <span class="title">订单编号：</span>
                <span class="detail">{{ order.orderNumber }}</span>
              </div>
              <div class="item">
                <span class="title">时间筛选：</span>
                <span class="detail">{{ order.createTime }}</span>
              </div>
              <div class="item">
                <span class="title">客户名称：</span>
                <span class="detail">{{ order.customerName }}</span>
              </div>
              <div class="item">
                <span class="title">客户编号：</span>
                <span class="detail">{{ order.customerId }}</span>
              </div>
              <div class="item">
                <span class="title">处理人：</span>
                <span class="detail">{{ order.customerName }}</span>
              </div>
              <div class="item waitDetail">
                <span class="title">状态：</span>
                <span class="detail noDeal" v-if="order.orderStatus == 0">待明细</span>
                <span class="detail noConfirm" v-else-if="order.orderStatus == 1">待确认</span>
                <span class="detail haveConfirm" v-else-if="order.orderStatus == 2">已确认</span>
              </div>
            </div>
          </template>
          <div class="content">
            <div class="title" v-if="order.orderStatus == 0">
              <span>出货明细详情</span>
            </div>
            <div class="detail" v-if="order.orderStatus == 0">
              <div class="left">
                <div
                  class="item bt-hover"
                  :class="{'active':activeIndex == index}"
                  v-for="(item,index) in order.ordersProductList"
                  :key="item.id"
                  @click="proClick(index)">
                  <img v-if="item.product.headImage" :src="fileAddress + item.product.headImage" alt="暂无图片">
                  <img v-else src="static/imgs/syBg.png" alt="暂无图片">
                  <div class="info">
                    <div>{{ item.product.productName }}</div>
                    <div>{{ item.product.productNumber }}</div>
                    <div class="attrs">
                      <template v-for="attrName in item.product.productExtend">
                        {{ attrName }}、
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="middle">
                <div class="tip">备注信息</div>
                <div class="allRemarks">
                  <template v-for="remark in remarks" v-if="remark.type == 2">
                    <div class="audio bt-hover">
                      <i class="iconfont audioIcon"></i>
                    </div>
                  </template>
                  <template v-for="remark in remarks" v-if="remark.type == 1">
                    <div class="remark">{{ remark.content }}</div>
                  </template>
                </div>
              </div>
              <div class="right">
                <div class="optionWrapper">
                  <div class="tip">出货明细编辑</div>
                  <div class="btns">
                    <el-button type="primary" size="mini" plain @click="addDetail">添加明细</el-button>
                  </div>
                </div>
                <el-table
                  :data="addSpeciDatas"
                  border
                  size="small"
                  :max-height="200"
                  style="width: 100%">
                  <el-table-column
                    label="产品克重"
                    align="center">
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row.proWeight"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="出货重量"
                    align="center">
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row.sellWeight"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="出货数量"
                    align="center">
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row.sellCount"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="(value,index) in tempSpecificationAttrs"
                    :key="index"
                    :label="value"
                    align="center">
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row[index]"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" :disabled="delBtnStatus" @click.native.prevent="delDetail(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="submitDetail">
                  <el-button type="primary" size="mini" plain>提交明细</el-button>
                </div>
              </div>
            </div>
            <div class="total">
              <div class="title" v-if="order.orderStatus == 0">
                <span>出货明细汇总</span>
              </div>
              <div class="totalTable">
                <el-table
                  border
                  size="small"
                  :stripe="true"
                  max-height="200"
                  :data="totalDatas"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    width="50"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="产品名称"
                    prop="productName"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="产品编码"
                    prop="productNumber"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="产品类目"
                    prop="className"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    v-for="(value,index) in tempAllAttrs"
                    :key="index"
                    :prop="index"
                    :label="value"
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
              <div class="sendOrder">
                <el-button size="mini" type="primary" class="el-icon-success" v-if="order.orderStatus == 0"> 发送订单</el-button>
                <el-button size="mini" type="primary" class="el-icon-error" plain v-if="order.orderStatus == 2"> 取消订单</el-button>
                <el-button size="mini" type="primary" class="el-icon-success" v-if="order.orderStatus == 2"> 跟进订单</el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="pagerWrapper">
      <span class="demonstration">共 {{ totalOrderCount }} 条</span>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="totalOrderCount">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'
export default {
  data() {
    return {
      currentPage: 1,
      loading: null,
      allOrders: [], // 所有订单
      filterKeys: {
        orderStatus: 0,
        startTime: null,
        endTime: null,
        searchKey: null
      },
      staticData: {
        allOrderStatus: [
          { id: 0, name: '全部订单' },
          { id: 1, name: '待明细订单' },
          { id: 2, name: '待确认订单' },
          { id: 3, name: '已确认订单' }
        ]
      },
      addSpeciDatas: [{ proWeight: '', sellWeight: '', sellCount: '' }], // 新增规格数组
      totalDatas: [], // 汇总数据
      activeIndex: null,
      selOrderIndex: null,
      tempSpecificationAttrs: {},
      tempAllAttrs: {},
      delBtnStatus: true,
      remarks: [],
      totalOrderCount: 0,
      pageSizes: [10, 20, 50],
      pageSize: 10,
      currentPage: 1
      
    }
  },
  methods: {
    handleSizeChange(val){
      console.log(val)
    },
    handleCurrentChange(val){
      console.log(val)
    },
    addDetail() {
      let result = { proWeight: '', sellWeight: '', sellCount: '' }
      for (let key in this.tempSpecificationAttrs) {
        result[key] = ''
      }
      this.addSpeciDatas.push(result)
    },
    delDetail(index) {
      this.addSpeciDatas.splice(index, 1)
    },
    proClick(proIndex) {
      this.resetData()
      this.activeIndex = proIndex
      this.drawSpeciTable(proIndex)
      this.drawTotalTable(proIndex)

      this.remarks = this.allOrders[this.selOrderIndex].ordersProductList[
        proIndex
      ].remark
    },
    resetData() {
      this.addSpeciDatas = [{ proWeight: '', sellWeight: '', sellCount: '' }]
      this.tempSpecificationAttrs = {}
      this.totalDatas = []
      this.tempAllAttrs = {}
    },
    collapseChange(orderIndex) {
      if (orderIndex !== '') {
        this.resetData()
        this.activeIndex = 0

        this.selOrderIndex = orderIndex
        this.remarks = this.allOrders[
          this.selOrderIndex
        ].ordersProductList[0].remark
        this.drawSpeciTable(0)
        this.drawTotalTable(0)
      }
    },
    drawSpeciTable(index) {
      let currentProAttrs = this.allOrders[this.selOrderIndex]
        .ordersProductList[index].product.productClass.attrList
      currentProAttrs.forEach(attrObj => {
        if (attrObj.attrType == 3) {
          let key = attrObj.id
          let value = attrObj.attrCnName
          this.$set(this.addSpeciDatas[0], [key], '')
          this.$set(this.tempSpecificationAttrs, [key], value)
        }
      })
    },
    drawTotalTable(index) {
      let currentProductData = this.allOrders[this.selOrderIndex]
        .ordersProductList[index]

      let currentProAttrs = currentProductData.product.productClass.attrList
      let attrJsons = currentProductData.attrJson // type = 2(可选数据)
      let SpecificationList = currentProductData.detailList // type = 3（规格数据）

      let baseDataByBody = {
        productName: currentProductData.product.productName,
        productNumber: currentProductData.product.productNumber,
        className: currentProductData.product.productClass.className
      }

      currentProAttrs.forEach(item => {
        let key = item.id
        let value = item.attrCnName
        // drawHeader
        if (item.attrType == 2 || item.attrType == 3) {
          this.$set(this.tempAllAttrs, [key], value)
        }
        // 组装type = 2的数据到singleDataByBody
        if (item.attrType == 2) {
          let id = item.id
          for (let key in attrJsons) {
            if (id == key) {
              baseDataByBody[id] = attrJsons[key]
              break
            } else {
              baseDataByBody[id] = ''
            }
          }
        }
      })
      // drawBody
      if (SpecificationList.length > 0) {
        SpecificationList.forEach(item => {
          let tempObj = {}
          currentProAttrs.forEach(childItem => {
            if (childItem.attrType == 3) {
              let id = childItem.id
              for (let key in item.specificationJosn) {
                if (id == key) {
                  tempObj[id] = item.specificationJosn[key]
                  break
                } else {
                  tempObj[id] = ''
                }
              }
            }
          })
          let singleDataByBody = utils.deepClone(baseDataByBody)
          for (let key in tempObj) {
            singleDataByBody[key] = tempObj[key]
          }
          this.totalDatas.push(singleDataByBody)
        })
      }
    },
    getAllOrders() {
      this.loading = true
      this.Axios.get('/order/orders/sales')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.totalOrderCount = result.data.data.total
            this.loading = false
            this.allOrders = result.data.data.list
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.extCatch(err, this.getAllOrders)
        })
    }
  },
  created() {
    this.getAllOrders()
  },
  watch: {
    addSpeciDatas(val) {
      val.length <= 1 ? (this.delBtnStatus = true) : (this.delBtnStatus = false)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.sellOrder
  color #333333
  .headerWrapper
    border-bottom 1px solid #D9D9D9
    padding-bottom 10px
  .searchWrapper
    display flex
    justify-content space-between
    height 70px
    .searchPlace
      display flex
      .item
        display flex
        align-items center
        justify-content center
        span
          color #999999
          margin 0 10px
          white-space nowrap
    .optionPlace
      display flex
      align-items center
      .item
        margin-right 10px
        &:last-of-type
          margin 0
  .contentWrapper
    .header
      display flex
      padding-left 16px
      .item
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        flex auto
        text-align center
        width 20%
        .title
          color #999999
        .noDeal
          color #F56C6C
        .noConfirm
          color #E6A23C
        .haveConfirm
          color #909399
        &.waitDetail
          flex 0 120px
          width 120px
    .content
      padding-left 16px
      .title
        padding 10px 0
        font-size 14px
        span
          border-left 3px solid $base-color
          padding-left 10px
      .detail
        display flex
        .left
          flex 0 15%
          width 15%
          height 300px
          overflow auto
          padding 8px
          border 1px solid #DBDBDB
          border-radius 5px 0 0 5px
          font-size 12px
          .item
            display flex
            align-items center
            padding 10px
            transition all 0.5s
            &.active
              background-color #FDE7EB
            img
              width 90px
              height 60px
              margin-right 10px
              border-radius 3px
            .info
              overflow hidden
              div
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
        .middle
          flex 0 15%
          width 15%
          border 1px solid #DBDBDB
          border-left none
          .tip
            font-size 14px
            margin-left 8px
            margin-top 10px
          .allRemarks
            height 280px
            overflow auto
            padding 0 10px
            .audio
              background #F2F2F2
              height 30px
              padding-left 10px
              border-radius 5px
              line-height 30px
              margin-top 10px
              .audioIcon:after
                content '\e62c'
                font-size 20px
            .remark
              background #F2F2F2
              margin-top 10px
              padding 5px 10px
              font-size 12px
              border-radius 5px
        .right
          overflow hidden
          flex auto
          border 1px solid #DBDBDB
          padding 8px
          border-left none
          border-radius 0 5px 5px 0
          .optionWrapper
            display flex
            justify-content space-between
            align-items center
            margin-bottom 10px
            .tip
              font-size 14px
          .submitDetail
            display flex
            justify-content center
            margin-top 20px
      .total
        .sendOrder
          display flex
          justify-content center
          margin-top 20px
  .pagerWrapper
    display flex
    justify-content center
    align-items center
    margin 40px 0
</style>
