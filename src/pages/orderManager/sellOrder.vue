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
      <el-collapse accordion>
        <el-collapse-item v-for="order in allOrders" :key="order.id">
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
              <div class="item">
                <span class="title">状态：</span>
                <span class="detail noDeal" v-if="order.orderStatus == 0">待处理</span>
                <span class="detail noConfirm" v-else-if="order.orderStatus == 1">待确认</span>
                <span class="detail haveConfirm" v-else-if="order.orderStatus == 2">已确认</span>
              </div>
            </div>
          </template>
          <div class="content">
            <div class="title">
              <span>出货明细详情</span>
            </div>
            <div class="detail">
              <div class="left">
                <div class="item bt-hover" v-for="(item,index) in order.detailList" :key="item.id">
                  <img v-if="item.product.headImage" :src="item.product.headImage" alt="暂无图片">
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
                <template v-for="item in order.detailList">
                  <template v-for="remarkObj in item.remark" v-if="remarkObj.type == 2">
                    <div class="audio bt-hover">
                      <i class="iconfont audioIcon"></i>
                    </div>
                  </template>
                </template>
                <template v-for="item in order.detailList">
                  <template v-for="remarkObj in item.remark" v-if="remarkObj.type == 1">
                    <div class="remark">{{ remarkObj.content }}</div>
                  </template>
                </template>
              </div>
              <div class="right">
                <div class="optionWrapper">
                  <div class="tip">出货明细编辑</div>
                  <div class="btns">
                    <el-button type="primary" class="el-icon-circle-plus" size="mini" plain> 添加明细</el-button>
                    <el-button type="danger" class="el-icon-circle-close" size="mini"> 删除明细</el-button>
                  </div>
                </div>
                <el-table
                  :data="addSpeciDatas"
                  border
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                </el-table>
                <div class="submitDetail">
                  <el-button type="primary" size="small" class="el-icon-success"> 提交明细</el-button>
                </div>
              </div>
            </div>
            <div class="total"></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
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
      addSpeciDatas: [] // 新增规格数组
    }
  },
  methods: {
    getAllOrders() {
      this.Axios
        .get('/order/orders/sales')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allOrders = result.data.data.list
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getAllOrders)
        })
    }
  },
  created() {
    this.getAllOrders()
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
      justify-content space-between
      margin-right 100px
      padding-left 16px
      .item
        .title
          color #999999
        .noDeal
          color #F56C6C
        .noConfirm
          color #E6A23C
        .haveConfirm
          color $base-color
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
            margin-bottom 8px
            img
              width 90px
              height 60px
              margin-right 10px
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
          padding 8px
          border-left none
          height 300px
          overflow auto
          .tip
            font-size 14px
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
            margin-top 30px
</style>
