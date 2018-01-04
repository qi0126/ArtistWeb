<template>
  <div class="production">
    <div class="topWrapper">
      <div class="nav">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>Artist</el-breadcrumb-item>
          <el-breadcrumb-item>产品管理</el-breadcrumb-item>
          <el-breadcrumb-item>产品库</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="search">
        <el-input
          class="searchKey"
          size="small"
          placeholder="输入产品编号、名称搜索"
          prefix-icon="el-icon-search"
          v-model="searchKey">
        </el-input>

        <span class="title">产品类别</span>
        <el-select v-model="selKind" size="small" placeholder="请选择" class="searchKind">
          <el-option
            v-for="item in kinds"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <span class="title">产品状态</span>
        <el-select v-model="selState" size="small" placeholder="请选择" class="searchState">
          <el-option
            v-for="item in states"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <span class="title">时间筛选</span>
        <el-date-picker
          class="myDateTime"
          v-model="startTime"
          type="datetime"
          placeholder="开始时间"
          align="right"
          size="small"
          :picker-options="shortcutsOptions">
        </el-date-picker>
        <span class="spe">至</span>
        <el-date-picker
          class="myDateTime"
          v-model="endTime"
          type="datetime"
          placeholder="结束时间"
          align="right"
          size="small"
          :picker-options="shortcutsOptions">
        </el-date-picker>

      </div>
      <div class="options">
        <el-button size="small" plain @click="batchAddKindDialog = true" icon="el-icon-plus">批量添加到推广类别</el-button>
        <el-button size="small" plain @click="setWaterMaskDialog = true" icon="el-icon-picture-outline">设置图片水印</el-button>
        <el-button size="small" plain @click="upAndDownDialog = true" icon="el-icon-sort">批量上下架</el-button>
        <el-button size="small" plain @click="newProSettingDialog = true" icon="el-icon-date">设置新品时间</el-button>
        <el-button size="small" plain @click="jsDialog = true" icon="el-icon-sold-out">产品接收</el-button>
        <el-button size="small" plain @click="tsDialog = true" icon="el-icon-upload2">产品推送</el-button>
        <el-button size="small" plain icon="el-icon-refresh">更新产品</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" :disabled="batchDelDisabled" @click="batchDel">批量删除</el-button>
      </div>
    </div>

    <div class="contentWrapper">
      <el-table
        stripe
        border
        v-loading="loading"
        :data="allPros.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          type="selection"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          label="匹配图"
          width="120">
          <template slot-scope="scope">
            <img v-if="!scope.row.headImage || scope.row.headImage == ''" src="static/imgs/syBg.png" alt="暂无图片" class="proImg">
            <div v-else class="proImgWrapper">
              <img :src="scope.row.headImage" alt="暂无图片" class="proImg bt-hover" @click="showMore">
              <span class="totalText">共2张</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="产品名称"
          prop="productName"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          label="产品品类"
          prop="productClassName"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          label="产品编号"
          prop="productNumber"
          width="220">
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          label="创建时间"
          prop="putawayTime"
          width="220">
        </el-table-column>
        <el-table-column
          align="center"
          label="产品状态"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.productStatus == 0">待处理</span>
            <span v-else-if="scope.row.productStatus == 1">已上架</span>
            <span v-else-if="scope.row.productStatus == 2">已下架</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          width="433"
          label="操作">
          <template slot-scope="scope">
            <div class="proOptions">
              <el-button type="primary" size="small" icon="" plain>上架</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit-outline" plain>编辑</el-button>
              <el-button type="primary" size="small" icon="el-icon-setting" plain>设为新品</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pageWrapper" v-show="pagerStatus">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="allPros.total">
      </el-pagination>
    </div>

    <div class="dialogWrapper">
      <el-dialog
        title="批量添加到推广类别"
        :visible.sync="batchAddKindDialog"
        width="30%">
        <div>
          <el-radio v-model="r1" label="上海"></el-radio>
          【 <el-radio-group v-model="r1">
            <el-radio label="北京"></el-radio>
            <el-radio label="广州"></el-radio>
            <el-radio label="深圳"></el-radio>】
          </el-radio-group> 】
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchAddKindDialog = false" icon="">取 消</el-button>
          <el-button type="primary" @click="batchAddKindConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="设置图片水印"
        :visible.sync="setWaterMaskDialog">
        <div class="settingWaterMark">
          <div class="leftWrapper">
            <div class="top">
              <i class="iconfont checkBoxIcon bt-hover" :class="{'checkBoxIconSel': checkBoxState}" @click="checkBoxState = !checkBoxState"></i>
              <span class="bt-hover" @click="checkBoxState = !checkBoxState">开启水印</span>
            </div>
            <div class="bottom">
              <img src="static/imgs/syBg.png">
            </div>
          </div>
          <div class="rightWrapper">
            <div class="top">
              <span class="text">上传水印图片</span>
              <div class="syPlace bt-hover" ref="syBgElement" onClick="syFile.click()">
                <img :src="syImg">
                <input type="file" id="syFile" @change="syFile" hidden>
              </div>
              <div>设置水印透明度（{{ opacity }}%）</div>
              <el-slider v-model="opacity"></el-slider>
            </div>
            <div class="middle">
              <span class="text">上传底图</span>
              <div class="dtPlace bt-hover" onClick="dtFile.click()">
                <img :src="dtImg" alt="">
                <input type="file" id="dtFile" @change="dtFile" hidden>
              </div>
            </div>
            <div class="bottom">
              <el-button type="primary" size="small" plain>预览</el-button>
              <el-button type="primary" size="small" plain>取消</el-button>
              <el-button type="primary" size="small">确定</el-button>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="批量上下架"
        :visible.sync="upAndDownDialog"
        width="30%">
        <el-radio v-model="upAndDown" label="1">上架</el-radio>
        <el-radio v-model="upAndDown" label="2">下架</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="upAndDownDialog = false">取 消</el-button>
          <el-button type="primary" @click="upAndDownConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="新品显示时间设置"
        :visible.sync="newProSettingDialog"
        width="30%">
        <el-radio v-model="newProSetting" label="7">7天</el-radio>
        <el-radio v-model="newProSetting" label="15">15天</el-radio>
        <el-radio v-model="newProSetting" label="30">30天</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newProSettingDialog = false">取 消</el-button>
          <el-button type="primary" @click="newProSettingConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="产品图片"
        :visible.sync="preViewDialog"
        width="50%">
        <div class="previewImg">
          <div class="topWrapper">
            <el-button type="primary" size="small" icon="el-icon-upload" plain>上传图片</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
          </div>
          <div class="contentWrapper">
            <draggable v-model="previewImgs" :move="getdata" @update="datadragEnd">
              <transition-group class="draggableSpan">
                <div class="draggableItem" v-for="element in previewImgs" :key="element.id">
                  <img :src="element.imgSrc">
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="选择将要推送的公司"
        :visible.sync="tsDialog"
        width="30%">
        <div class="tsWrapper">
          <div class="checkBoxPlace">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="和合百泰"></el-checkbox>
              <el-checkbox label="金百泰"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="cb">
            <el-checkbox v-model="syCb">发送带水印的图片</el-checkbox>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tsDialog = false">取 消</el-button>
          <el-button type="primary" @click="tsConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="产品接收列表（共接收产品2135项）"
        :visible.sync="jsDialog"
        top="10vh"
        width="60%">
        <div class="jsWrapper">
          <div class="myPro">
            <div class="top">
              <span>新产品列表（1234项）</span>
              <el-checkbox v-model="newProAllSel">全选</el-checkbox>
            </div>
            <div class="bottom">
              <div class="detail" v-for="item in jsDatas">
                <div class="imgPlace">
                  <el-checkbox class="cb"></el-checkbox>
                  <img :src="item.src">
                  <span class="pager">3/张</span>
                </div>
                <div class="desPlace">
                  <div class="topText">平面密口实心手镯</div>
                  <div class="bottomText">45646564-1</div>
                </div>
              </div>
            </div>
          </div>
          <div class="myPro">
            <div class="top">
              <span>重复产品列表（8888项）</span>
              <el-checkbox v-model="repeatProAllSel">全选</el-checkbox>
            </div>
            <div class="bottom">
              <div class="detail" v-for="item in jsDatas">
                <div class="imgPlace">
                  <el-checkbox class="cb"></el-checkbox>
                  <img :src="item.src">
                  <span class="pager">3/张</span>
                </div>
                <div class="desPlace">
                  <div class="topText">平面密口实心手镯</div>
                  <div class="bottomText">45646564-1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      pageSizes: [10, 20, 50],
      pageSize: 10,
      allPros: {},
      loading: true,
      jsDatas: [
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' },
        { src: 'static/imgs/test.png' }
      ],
      newProAllSel: false,
      repeatProAllSel: false,
      syCb: false,
      checkList: [],
      previewImgs: [
        { id: '1', imgSrc: 'static/imgs/test.png' },
        { id: '2', imgSrc: 'static/imgs/test2.png' },
        { id: '3', imgSrc: 'static/imgs/test2.png' },
        { id: '4', imgSrc: 'static/imgs/test2.png' },
        { id: '5', imgSrc: 'static/imgs/test2.png' },
        { id: '6', imgSrc: 'static/imgs/test2.png' },
        { id: '7', imgSrc: 'static/imgs/test2.png' },
        { id: '8', imgSrc: 'static/imgs/test2.png' },
        { id: '9', imgSrc: 'static/imgs/test2.png' },
        { id: '10', imgSrc: 'static/imgs/test2.png' }
      ],
      jsDialog: false,
      tsDialog: false,
      preViewDialog: false,
      dtImg: 'static/imgs/syBg.png',
      syImg: 'static/imgs/syBg.png',
      checkBoxState: false,
      opacity: 100,
      r1: '',
      setWaterMaskDialog: false,
      batchAddKindDialog: false,
      newProSetting: '7',
      newProSettingDialog: false,
      upAndDown: '1',
      upAndDownDialog: false,
      kinds: [
        {
          value: 'all',
          label: '全部大类'
        },
        {
          value: '手镯',
          label: '手镯'
        },
        {
          value: '戒指',
          label: '戒指'
        },
        {
          value: '项链',
          label: '项链'
        }
      ],
      states: [
        {
          value: 'all',
          label: '全部状态'
        },
        {
          value: '未上架',
          label: '未上架'
        },
        {
          value: '已上架',
          label: '已上架'
        },
        {
          value: '删除',
          label: '删除'
        }
      ],
      shortcutsOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      selKind: 'all',
      selState: 'all',
      searchKey: '',
      currentPage: 1,
      startTime: '',
      endTime: '',
      batchDelDisabled: true, // 批量删除禁用状态
      pagerStatus: false
    }
  },
  methods: {
    getAllPros(params = {}) {
      this.loading = true
      this.Axios
        .get('/product/product', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allPros = result.data
            this.loading = false
            if (this.allPros.list.length > 0) this.pagerStatus = true
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.extCatch(err, this.getAllPros)
        })
    },
    tsConfirm() {},
    getdata(evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.previewImgs)
    },
    dtFile(e) {
      utils.encodeBase64(e).then(data => {
        this.dtImg = data
      })
    },
    syFile(e) {
      utils.encodeBase64(e).then(data => {
        this.syImg = data
      })
    },
    batchDel() {
      this.$confirm('确定要删除选中的产品？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      })
    },
    batchAddKindConfirm() {
      this.batchAddKindDialog = false
    },
    newProSettingConfirm() {
      console.log(this.newProSetting)
      this.newProSettingDialog = false
    },
    upAndDownConfirm() {
      console.log(this.upAndDown)
      this.upAndDownDialog = false
    },
    formatter(row, column) {
      return row.address
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProByParams()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getProByParams()
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.batchDelDisabled = false
      } else {
        this.batchDelDisabled = true
      }
    },
    showMore() {
      this.preViewDialog = true
    },
    getProByParams() {
      let params = {
        PRS: {
          page: this.currentPage,
          size: this.pageSize
        }
      }
      this.getAllPros(params)
    }
  },
  watch: {
    opacity(val) {
      let syBgElement = this.$refs.syBgElement
      syBgElement.style.opacity = val / 100
    }
  },
  components: {
    draggable
  },
  created() {
    this.getAllPros()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.production
  .topWrapper
    .search
      margin 1rem 0
      display flex
      align-items center
      .title
        flex 0 65px
        width 65px
      .searchKind
        flex 0 10%
        margin-right 10px
      .searchKey
        flex 0 15%
        margin-right 10px
      .searchState
        flex 0 10%
        margin-right 10px
      .myDateTime
        flex 0 20%
        margin-right 10px
        &:last-of-type
          margin-right 0
          margin-left 10px
  .contentWrapper
    margin 20px 0 40px 0
    .proImg
      width 100%
      height 75px
      border-radius 5px
  .pageWrapper
    text-align center
    margin-bottom 40px
.dialogWrapper
  .settingWaterMark
    display flex
    .leftWrapper
      margin-right 1%
      flex 1
      .top
        margin-bottom 0.5rem
        i.checkBoxIcon:after
          content '\e658'
        i.checkBoxIconSel:after
          content '\e657'
          color $base-color
      .bottom, img
        width 100%
    .rightWrapper
      width 16rem
      overflow hidden
      .top
        .syPlace
          width 100%
          height 12rem
          display flex
          justify-content center
          align-items center
          margin 0.5rem 0
          overflow hidden
          img
            width 100%
      .middle
        img
          width 100%
          margin 0.5rem 0
      .bottom
        display flex
        justify-content center
        margin-top 1rem
  .previewImg
    .contentWrapper
      height 30rem
      overflow auto
      .draggableSpan
        display flex
        flex-wrap wrap
        .draggableItem
          width 23.7%
          margin 0.5%
          img
            width 100%
            border-radius 3px
  .tsWrapper
    .cb
      margin-top 2rem
  .jsWrapper
    .myPro
      padding-bottom 1rem
      border-bottom 1px solid #EDEDED
      &:last-child
        margin-top 1rem
        border-bottom none
      .bottom
        display flex
        flex-wrap wrap
        max-height 20rem
        overflow-y auto
        .detail
          display flex
          width 32%
          margin 0.5% 1% 0.5% 0
          .imgPlace
            position relative
            width 40%
            margin-right 5%
            img
              width 100%
              height 100%
            .cb
              position absolute
              top -0.3rem
              left 0
            .pager
              position absolute
              right 0
              bottom 0
              background rgba(0, 0, 0, 0.3) none repeat scroll !important
              color #ffffff
              padding 0 0.3rem
              line-height 1.3rem
              font-size 0.8rem
              border-top-left-radius 0.3rem
        .desPlace
          .bottomText
            color #C0C0C0
</style>
