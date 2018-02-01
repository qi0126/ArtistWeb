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
          @keyup.enter.native="searchRequest"
          v-model.trim="searchParams.name">
        </el-input>

        <span class="title">产品类别</span>
        <el-select v-model="searchParams.productClassId" size="small" placeholder="请选择" class="searchKind" @change="searchRequest">
          <el-option
            v-for="item in kinds"
            :key="item.id"
            :label="item.className"
            :value="item.id">
          </el-option>
        </el-select>

        <span class="title">产品状态</span>
        <el-select v-model="searchParams.productStatus" size="small" placeholder="请选择" class="searchState" @change="searchRequest">
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
          v-model="searchParams._start_createTime"
          type="datetime"
          placeholder="开始时间"
          align="right"
          size="small"
          @change="searchRequest"
          :picker-options="$store.state.pickerOptions">
        </el-date-picker>
        <span class="spe">至</span>
        <el-date-picker
          class="myDateTime"
          v-model="searchParams._end_createTime"
          type="datetime"
          placeholder="结束时间"
          align="right"
          size="small"
          @change="searchRequest"
          :picker-options="$store.state.pickerOptions">
        </el-date-picker>

      </div>
      <div class="options">
        <el-button size="small" plain @click="batchAddKindDialog = true" icon="el-icon-plus" :disabled="batchDelDisabled">批量添加到推广类别</el-button>
        <el-button size="small" plain @click="upAndDownDialog = true" icon="el-icon-sort" :disabled="batchDelDisabled">批量上下架</el-button>
        <!-- <el-button size="small" plain @click="tsDialog = true" icon="el-icon-upload2" :disabled="batchDelDisabled">产品推送</el-button> -->
        <el-button size="small" plain @click="setWaterMaskDialog = true" icon="el-icon-picture-outline">设置图片水印</el-button>
        <el-button size="small" plain @click="newProSettingDialog = true" icon="el-icon-date">设置新品时间</el-button>
        <!-- <el-button size="small" plain @click="jsDialog = true" icon="el-icon-sold-out">产品接收</el-button> -->
        <el-button size="small" plain icon="el-icon-refresh" @click="refreshProduct">更新产品</el-button>
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
            <div class="proImgWrapper">
              <img
                v-if="!scope.row.headImage || scope.row.headImage == ''"
                src="static/imgs/syBg.png"
                alt="暂无图片"
                @click="showMore(scope.row.id)"
                class="proImg bt-hover">
              <img
                v-else
                :src="fileAddress + scope.row.headImage"
                alt="暂无图片"
                class="proImg bt-hover"
                @click="showMore(scope.row.id)">
              <span class="totalText">共{{ scope.row.imageCount }}张</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="产品名称"
          prop="productName">
        </el-table-column>
        <el-table-column
          align="center"
          label="产品品类"
          prop="productClass.className">
        </el-table-column>
        <el-table-column
          align="center"
          label="产品编号"
          prop="productNumber">
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          label="创建时间"
          prop="putawayTime">
        </el-table-column>
        <el-table-column
          align="center"
          label="产品状态">
          <template slot-scope="scope">
            <span v-if="scope.row.productStatus == 0">待处理</span>
            <span v-else-if="scope.row.productStatus == 1">已上架</span>
            <span v-else-if="scope.row.productStatus == 2" class="down">已下架</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="380"
          label="操作">
          <template slot-scope="scope">
            <div class="proOptions">
              <el-button type="primary" size="small" icon="" plain v-if="scope.row.productStatus == 1" @click="downConfirm(scope.row.id)">下架</el-button>
              <el-button type="primary" size="small" icon="" plain v-if="scope.row.productStatus == 2" @click="upConfirm(scope.row.id)">上架</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit-outline" plain @click="editPro(scope.row.id)">编辑</el-button>
              <el-button type="primary" size="small" icon="el-icon-setting" plain @click="settingNewPro(scope.row.id)">设为新品</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="delSinglePro(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pageWrapper" v-show="pagerStatus">
      <el-pagination
        background
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
        width="50%">
        <div class="batchAddKindElem">
          <div class="item" v-for="(item,index) in allPromotions" :key="index">
            <el-checkbox-group v-model="selPromotions[index]" :max="1">
              <el-checkbox :label="item.id">{{ item.categoryName }}</el-checkbox>【
              <el-checkbox v-for="(child,childIndex) in item.categoryList" :key="childIndex" :label="child.id" class="childCheckbox">{{ child.categoryName }}</el-checkbox>
            </el-checkbox-group>
          </div>
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
              <el-checkbox v-model="checkBoxState">开启水印</el-checkbox>
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
              <el-button type="primary" size="small" @click="confirmSy">确定</el-button>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="批量上下架"
        :visible.sync="upAndDownDialog"
        width="30%">
        <el-radio v-model="upAndDown" :label="1">上架</el-radio>
        <el-radio v-model="upAndDown" :label="2">下架</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="upAndDownDialog = false">取 消</el-button>
          <el-button type="primary" @click="upAndDownConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="新品显示时间设置"
        :visible.sync="newProSettingDialog"
        width="30%">
        <el-radio v-model="newProSetting" :label="7">7天</el-radio>
        <el-radio v-model="newProSetting" :label="15">15天</el-radio>
        <el-radio v-model="newProSetting" :label="30">30天</el-radio>
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
            <input type="file" hidden id="puloadImgFile" @change="uploadImgChange" ref="fileInput">
            <el-button type="primary" size="small" icon="el-icon-upload" plain onClick="puloadImgFile.click()">上传图片</el-button>
            <!-- <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button> -->
          </div>
          <div class="contentWrapper">
            <!-- <draggable v-model="proDetails.imageList" :move="getdata" @update="datadragEnd">
              <transition-group class="draggableSpan"> -->
                <div
                  class="draggableItem"
                  v-for="element in proDetails.imageList"
                  @mouseover="selImg = element"
                  @mouseout="selImg = null">
                  <img :src="fileAddress + element.imageUrl">
                  <i class="el-icon-error delIcon bt-hover" v-show="selImg == element" @click="delPreImg(element.imageUrl)"></i>
                </div>
              <!-- </transition-group>
            </draggable> -->
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="选择将要推送的公司"
        :visible.sync="tsDialog"
        width="30%">
        <div class="tsWrapper">
          <div class="checkBoxPlace">
            <el-checkbox-group v-model="selCompany">
              <el-checkbox label="和合百泰"></el-checkbox>
              <el-checkbox label="金百泰"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="cb">
            <el-checkbox v-model="isAddWatermark">发送带水印的图片</el-checkbox>
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

    <div class="proDetail" v-show="proDetailLayer == true">
      <editProduction @syncLayerStatus="syncLayerStatus" :selProId="selProId" :proDetailLayer="proDetailLayer"></editProduction>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'
import draggable from 'vuedraggable'
import editProduction from '@/components/editProduction/editProduction'

export default {
  data() {
    return {
      proDetailLayer: false,
      pageSizes: [10, 20, 50],
      currentPage: 1,
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
      isAddWatermark: false,
      selCompany: [],
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
      newProSetting: null,
      newProSettingDialog: false,
      upAndDown: 1, // 1：上架 2：下架
      upAndDownDialog: false,
      kinds: [],
      states: [
        {
          value: null,
          label: '全部状态'
        },
        {
          value: 1,
          label: '已上架'
        },
        {
          value: 2,
          label: '已下架'
        },
        // {
        //   value: 3,
        //   label: '删除'
        // }
      ],
      batchDelDisabled: true, // 批量删除禁用状态
      pagerStatus: false,
      allPromotions: [], // 所有的推广类别
      selPromotions: [],
      selRowIds: [], // 被选择产品的id集合
      selProId: null, // 编辑产品的id
      selImg: null,
      proDetails: {}, // 点击获取图片获取详情
      searchParams: {
        name: null,
        productClassId: null,
        productStatus: null,
        _start_createTime: null,
        _end_createTime: null
      }
    }
  },
  methods: {
    confirmSy(){

    },
    refreshProduct() {
      const loading = this.$loading({
        lock: true,
        text: '正在刷新产品库，请耐心等待...',
        spinner: 'el-icon-loading'
      })
      this.Axios.post('/product/product/import')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            loading.close()
            this.$message.success('产品库刷新成功')
            this.getProByParams()
          } else {
            loading.close()
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.refreshProduct)
        })
    },
    searchRequest() {
      this.getProByParams()
    },
    uploadImgChange(e) {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      formData.append('type', 1)
      this.Axios.post(`${this.fileAddress}/image/upload`, formData)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.proDetails.imageList.push({ imageUrl: result.data[0].url })
            this.updateImgInfo()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.uploadFile)
        })
    },
    delPreImg(url) {
      for (let i = 0; i < this.proDetails.imageList.length; i++) {
        if (this.proDetails.imageList[i].imageUrl == url) {
          this.proDetails.imageList.splice(i, 1)
          break
        }
      }
      this.updateImgInfo()
    },
    updateImgInfo() {
      this.Axios.put(`/product/product/${this.proDetails.id}`, this.proDetails)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('更新成功')
            this.getProByParams()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.submit)
        })
    },
    syncLayerStatus(val) {
      this.proDetailLayer = val
      this.getProByParams()
    },
    editPro(id) {
      this.selProId = id
      this.proDetailLayer = true
    },
    delSinglePro(row) {
      this.$confirm('确定删除', '提示', { type: 'warning' })
        .then(res => {
          this.Axios.delete(`/product/product/${row.id}`)
            .then(res => {
              let result = res.data
              if (result.code == 0) {
                this.$message.success('删除成功')
                this.getProByParams()
              } else {
                this.$message.error(result.msg)
              }
            })
            .catch(err => {
              this.extCatch(err, this.delSinglePro)
            })
        })
        .catch(err => {})
    },
    tsConfirm() {},
    getdata(evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.proDetails.imageList)
    },
    dtFile(e) {
      utils.encodeBase64(e).then(data => {
        this.dtImg = data
      })
    },
    syFile(e) {
      utils.commonUpload(this, e, 2, data => {
        let params = {
          waterImage: data[0].url,
          diaphaneity: 0.5,
          x: 0,
          y: 0
        }
        this.Axios.post('/image/config',params).then(res=>{
          console.log(res)
        })
      })
    },
    batchDel() {
      this.$confirm('确定要删除选中的产品？', '提示', {
        type: 'warning'
      })
        .then(res => {
          this.batchDelDetail()
        })
        .catch(err => {})
    },
    batchDelDetail() {
      let params = {
        PRS: {
          ids: this.selRowIds
        }
      }
      this.Axios.delete('/product/product/batch', params)
        .then(res => {
          this.$message.success('批量删除成功')
          this.getProByParams()
        })
        .catch(err => {
          this.extCatch(err, this.batchDelDetail)
        })
    },
    batchAddKindConfirm() {
      if (this.categoryIds.length > 0) {
        let params = {
          categoryIds: this.categoryIds,
          productIds: this.selRowIds
        }
        this.Axios.post('/promotion/category/product', params)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.$message.success('添加成功')
              this.batchAddKindDialog = false
              this.getProByParams()
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.batchAddKindConfirm)
          })
      } else {
        this.$message.warning('请选择推广类别')
      }
    },
    newProSettingConfirm() {
      let params = {
        newTime: this.newProSetting
      }
      this.Axios.post('/product/product/newTime', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('设置成功')
            this.newProSettingDialog = false
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.settingNewproTime)
        })
    },
    upAndDownConfirm() {
      if (this.upAndDown == 1) this.upConfirm()
      else if (this.upAndDown == 2) this.downConfirm()
    },
    upConfirm(id) {
      let params = {
        ids: null
      }
      id ? (params.ids = [id]) : (params.ids = this.selRowIds)
      this.Axios.post('/product/product/putawayUp', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('上架成功')
            this.upAndDownDialog = false
            this.getProByParams()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.upConfirm)
        })
    },
    downConfirm(id) {
      let params = {
        ids: null
      }
      id ? (params.ids = [id]) : (params.ids = this.selRowIds)
      this.Axios.post('/product/product/putawayDown', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('下架成功')
            this.upAndDownDialog = false
            this.getProByParams()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.upConfirm)
        })
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
      val.length > 0
        ? (this.batchDelDisabled = false)
        : (this.batchDelDisabled = true)
      this.selRowIds = []
      val.forEach(item => {
        this.selRowIds.push(item.id)
      })
    },
    showMore(id) {
      this.preViewDialog = true
      this.Axios.get(`/product/product/${id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.proDetails = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.showMore)
        })
    },
    getAllPros(params = {}) {
      this.loading = true
      this.Axios.get('/product/product', params)
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
    getProByParams() {
      let params = {
        PRS: {
          page: this.currentPage,
          size: this.pageSize
        }
      }
      let searchParams = utils.deepClone(this.searchParams)
      for (let key in searchParams) {
        if (searchParams[key] != null && searchParams[key] != '') {
          if (key == '_start_createTime') {
            searchParams['_start_createTime'] = utils.formatDataTime(
              searchParams[key]
            )
          } else if (key == '_end_createTime') {
            searchParams['_end_createTime'] = utils.formatDataTime(
              searchParams[key]
            )
          }
          let resultKey = `query.${key}`
          params.PRS[resultKey] = searchParams[key]
        }
      }
      this.getAllPros(params)
    },
    getAllKind() {
      let params = {
        PRS: {
          size: 999
        }
      }
      this.Axios.get('/product/productClass', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.kinds = result.data.list
            this.kinds.unshift({ id: null, className: '全部类别' })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getAllKind)
        })
    },
    getAllPromotions() {
      this.Axios.get('promotion/category')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allPromotions = result.data
            this.allPromotions.forEach(item => {
              this.selPromotions.push([])
            })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getAllPromotions)
        })
    },
    getCurrentNewtime() {
      this.Axios.get('/product/product/newTime')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.newProSetting = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getCurrentNewtime)
        })
    },
    settingNewPro(id) {
      this.Axios.put(`/product/product/${id}/new`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('设置成功')
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.settingNewPro)
        })
    }
  },
  created() {
    this.getAllPros()
    this.getAllKind()
  },
  components: {
    draggable,
    editProduction
  },
  watch: {
    preViewDialog(val) {
      if (!val) {
        utils.reset(this.$refs.fileInput)
      }
    },
    opacity(val) {
      let syBgElement = this.$refs.syBgElement
      syBgElement.style.opacity = val / 100
    },
    batchAddKindDialog(val) {
      if (val) {
        this.getAllPromotions()
      } else {
        this.selPromotions.forEach((item, index) => {
          if (item.length > 0) {
            item.splice(0, 1)
          }
        })
      }
    },
    newProSettingDialog(val) {
      if (val) {
        this.getCurrentNewtime()
      }
    },
    upAndDownDialog(val) {
      if (!val) {
        this.upAndDown = 1
      }
    },
    allProList(val) {
      val.length > 0 ? (this.pagerStatus = true) : (this.pagerStatus = false)
    }
  },
  computed: {
    allProList() {
      return this.allPros.list
    },
    categoryIds() {
      // 计算过后的推广类别数组
      let result = []
      this.selPromotions.forEach(item => {
        if (item[0]) {
          result.push(item[0])
        }
      })
      return result
    }
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
    .down
      color $base-color
  .pageWrapper
    text-align center
    margin-bottom 40px
  .dialogWrapper
    .batchAddKindElem
      .item
        display flex
        flex-wrap wrap
        .childCheckbox
          color #A7A7A7
    .settingWaterMark
      display flex
      .leftWrapper
        margin-right 1%
        flex 1
        .top
          margin-bottom 0.5rem
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
        max-height 30rem
        overflow auto
        display flex
        flex-wrap wrap
        .draggableItem
          width 23.7%
          margin 0.5%
          position relative
          .delIcon
            color $base-color
            position absolute
            top 5px
            right 5px
          img
            width 100%
            border-radius 3px
    .tsWrapper
      .cb
        margin-top 2rem
    .jsWrapper, .myPro
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
  .proDetail
    padding 15px 15px 0 15px
    overflow auto
    position fixed
    top 50px
    left 210px
    right 0
    bottom 0
    z-index 100
    background white
</style>
