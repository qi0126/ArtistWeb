// 动态属性参数还未校验
<template>
  <div class="addProduction">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增产品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="picWrapper">
      <div class="top">
        <span class="title">产品图片</span>
      </div>
      <div class="bottom">
        <div class="buttomItem bt-hover" v-for="src in allImgs"
             @mouseover="overImg(src)" 
             @mouseout="outImg(src)">
          <img :src="src" class="myImg" @click="tapImg(src)">
          <i class="myIcon bt-hover" @click.stop="delPic(src)" :class="{'el-icon-circle-close-outline':src==tempSrc}"></i>
        </div>
        <div class="uploadPlace bt-hover" onClick="uploadFile.click()">
          <i class="el-icon-circle-plus-outline"></i>
          <span>点击上传图片</span>
          <span>建议图片尺寸为16:9</span>
        </div>
      </div>
    </div>

    <div class="baseInfo">
      <div class="title">
        <span>产品基本信息</span>
      </div>
      <div class="content">
        <div class="item">
          <span class="text">产品类别：</span>
          <el-select v-model="submitData.productClassId" @change="kindChange" style="width:100%">
            <el-option
              v-for="kind in allKind.list"
              :key="kind.id"
              :label="kind.className"
              :value="kind.id">
            </el-option>
          </el-select>
          <span class="pointer">*</span>
        </div>
        <div class="item">
          <span class="text">产品名称：</span>
          <el-input v-model.trim="submitData.productName" placeholder="请填写产品名称"></el-input>
          <span class="pointer">*</span>
        </div>
        <div class="item">
          <span class="text">产品编号：</span>
          <el-input v-model.trim="submitData.productNumber" placeholder="请填写产品编号"></el-input>
          <span class="pointer">*</span>
        </div>
        <div class="item">
          <span class="text">是否上架：</span>
          <el-select v-model="submitData.productStatus" style="width:100%">
            <el-option
              v-for="item in putawaySelection"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="pointer">*</span>
        </div>
        <div class="item">
          <span class="text">供应商编号：</span>
          <el-input v-model.trim="submitData.supplierNumber" placeholder="请填写供应商编号"></el-input>
          <span class="pointer">*</span>
        </div>
        <template v-if="baseInfoLength > 0">
          <template v-for="item in allAttrsBykindId.attrList">
            <template v-if="item.attrType == 1">
              <div class="item">
                <span class="text">{{ item.attrCnName }}：</span>
                <template v-if="!item.dictDataObject">
                  <el-input v-model.trim="submitData.productExtend.valueJson[item.id]" :placeholder="'请填写' + item.attrCnName"></el-input>
                </template>
                <template v-else>
                  <template v-if="item.dataType == 10 || item.dataType == 20">
                    <el-select
                      v-model="submitData.productExtend.valueJson[item.id]"
                      style="width:100%"
                      :placeholder="'请填写' + item.attrCnName">
                      <el-option
                        v-for="child in item.dictDataObject"
                        :key="child.text"
                        :label="child.text"
                        :value="child.value">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else-if="item.dataType == 110 || item.dataType == 120">
                    <el-select
                      v-model="submitData.productExtend.valueJson[item.id]"
                      style="width:100%"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="'请选择' + item.attrCnName">
                      <el-option
                        v-for="child in item.dictDataObject"
                        :key="child.text"
                        :label="child.text"
                        :value="child.value">
                      </el-option>
                    </el-select>
                  </template>
                </template>
                <span class="pointer" v-show="item.isRequired == 1">*</span>
              </div>
            </template>
          </template>
        </template>
        <div class="proDesc item">
          <span class="text">产品描述：</span>
          <el-input class="proDescInp" v-model.trim="submitData.productDescribe" type="textarea" :rows="4" placeholder="请填写对产品的描述"></el-input>
        </div>
      </div>
    </div>

    <div class="property" v-if="propertyLength > 0">
      <div class="title">
        <span>产品属性</span>
      </div>
      <div class="content">
        <template v-for="item in allAttrsBykindId.attrList">
          <template v-if="item.attrType == 2">
            <div class="item">
              <span class="text">{{ item.attrCnName }}：</span>
              <template v-if="!item.dictDataObject">
                <el-input v-model.trim="submitData.productExtend.valueJson[item.id]" :placeholder="'请填写' + item.attrCnName"></el-input>
              </template>
              <template v-else>
                <template v-if="item.dataType == 10 || item.dataType == 20">
                  <el-select
                    v-model="submitData.productExtend.valueJson[item.id]"
                    style="width:100%"
                    :placeholder="'请填写' + item.attrCnName">
                    <el-option
                      v-for="child in item.dictDataObject"
                      :key="child.text"
                      :label="child.text"
                      :value="child.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.dataType == 110 || item.dataType == 120">
                  <el-select
                    v-model="submitData.productExtend.valueJson[item.id]"
                    style="width:100%"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :placeholder="'请选择' + item.attrCnName">
                    <el-option
                      v-for="child in item.dictDataObject"
                      :key="child.text"
                      :label="child.text"
                      :value="child.value">
                    </el-option>
                  </el-select>
                </template>
              </template>
              <span class="pointer" v-show="item.isRequired == 1">*</span>
            </div>
          </template>
        </template>
      </div>
    </div>

    <div class="specification" v-if="specificationLength > 0">
      <div class="title">
        <span class="text">产品规格</span>
        <el-button type="primary" size="small" icon="el-icon-circle-plus" class="btn" @click="addSpecification">添加新的产品规格</el-button>
      </div>
      <div class="content">
        <el-table
          border
          :data="submitData.specificationList"
          style="width: 100%">
          <template v-for="item in allAttrsBykindId.attrList">
            <template v-if="item.attrType == 3">
              <el-table-column
                align="center"
                :label="item.attrCnName"
                max-height="300">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.specificationJson[item.id]" size="mini"></el-input>
                </template>
              </el-table-column>
            </template>
          </template>
          <el-table-column
            align="center"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <div class="proOptions">
                <el-button type="danger" size="small" icon="el-icon-delete" @click.native.prevent="delSpecification(scope.$index,submitData.specificationList)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> 

    <div class="generalize">
      <div class="top">
        <span class="title">产品推广</span>
      </div>
      <div class="content">
        <div class="item" v-for="(item,index) in allPromotions" :key="index">
          <el-checkbox-group v-model="selPromotions[index]" :max="1">
            <el-checkbox :label="item.id">{{ item.categoryName }}</el-checkbox>【
            <el-checkbox v-for="(child,childIndex) in item.categoryList" :key="childIndex" :label="child.id" class="childCheckbox">{{ child.categoryName }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    
    <div class="btnWrapper">
      <el-button type="primary" @click="submit" :disabled="btnStatus">添 加</el-button>
    </div>

    <input type="file" hidden id="uploadFile" @change.stop="uploadFile" ref="fileInput">
  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'
export default {
  data() {
    return {
      allPromotions: [], // 产品推广种类
      addProToKind: {
        productIds: []
      },
      allImgs: [],
      tempSrc: null,
      allKind: [], // 所有类目
      kindDetail: [], // 类目所包含的属性
      putawaySelection: [{ label: '是', value: 1 }, { label: '否', value: 2 }],
      allAttrsBykindId: {
        attrList: []
      },
      baseInfoLength: 0,
      propertyLength: 0,
      specificationLength: 0,
      submitData: {
        productClassId: null,
        productName: null,
        productNumber: null,
        productStatus: 1,
        supplierNumber: null,
        productDescribe: null,
        productExtend: {
          valueJson: {}
        }, // 拓展属性
        imageList: [], // 图片列表
        specificationList: [
          {
            specificationJson: {}
          }
        ] // 所有规格
      },
      specificationAttrs: [], // 规格属性
      selPromotions: [],
      btnStatus: true
    }
  },
  methods: {
    submit() {
      if (this.checkSubmit()) {
        this.Axios
          .post('/product/product', this.submitData)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.addProToKind.productIds[0] = result.data.id
              this.addProductionToKind()
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.submit)
          })
      }
    },
    addProductionToKind() {
      this.Axios
        .post('/promotion/category/product', this.addProToKind)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.resetBaseData()
            this.$message.success('添加成功')
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.addProductionToKind)
        })
    },
    checkSubmit() {
      let sd = this.submitData
      let pk = this.addProToKind
      if (this.allImgs.length == 0) {
        this.$message.error('请至少上传一张产品图片')
        return false
      }
      if (!sd.productName || sd.productName == '') {
        this.$message.error('请输入产品名称')
        return false
      }
      if (!sd.productNumber || sd.productNumber == '') {
        this.$message.error('请输入产品编号')
        return false
      }
      if (!sd.supplierNumber || sd.supplierNumber == '') {
        this.$message.error('请输入供应商编号')
        return false
      }
      if (!sd.productDescribe || sd.productDescribe == '') {
        this.$message.error('请输入产品描述')
        return false
      }
      if (!pk.categoryIds || pk.categoryIds == '') {
        this.$message.error('请选择产品推广类别')
        return false
      }
      return true
    },
    addSpecification() {
      let tempAttrObj = {}
      this.specificationAttrs.forEach(attr => {
        tempAttrObj[attr] = null
      })
      this.submitData.specificationList.push({
        specificationJson: tempAttrObj
      })
    },
    delSpecification(index, allData) {
      if (this.submitData.specificationList.length <= 1) {
        this.$message({ message: '抱歉，至少保留一行规格！', type: 'warning' })
        return
      }
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      })
        .then(res => {
          allData.splice(index, 1)
        })
        .catch(err => {})
    },
    uploadFile(e) {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      formData.append('type', 1)
      this.Axios
        .post(`${this.fileAddress}/image/upload`, formData)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allImgs.push(`${this.fileAddress}${result.data[0].url}`)
            this.submitData.imageList.push({ imageUrl: result.data[0].url })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.uploadFile)
        })
    },
    kindChange() {
      this.getAttrByKindId(this.submitData.productClassId)
    },
    delPic(src) {
      utils.delDataFromArray(this.allImgs, src)
      let resultSrc = src.split(this.fileAddress)[1] // 截取后的字符串
      this.submitData.imageList.forEach((item,index)=>{
        let imageUrl = item.imageUrl
        if(resultSrc == imageUrl){
          this.submitData.imageList.splice(index,1)
        }
      })
    },
    overImg(src) {
      this.tempSrc = src
    },
    outImg() {
      this.tempSrc = null
    },
    getAllKind() {
      let params = {
        PRS: {
          size: 9999
        }
      }
      this.Axios
        .get('/product/productClass', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allKind = result.data
            if (this.allKind.list.length > 0) {
              this.submitData.productClassId = this.allKind.list[0].id
              this.getAttrByKindId(this.submitData.productClassId)
            }
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getAllKind)
        })
    },
    getAttrByKindId(id) {
      this.Axios
        .get(`/product/productClass/${id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allAttrsBykindId = result.data
            this.resetData()
            this.allAttrsBykindId.attrList.forEach(obj => {
              if (obj.attrType == 1) {
                this.baseInfoLength++
                let resultType = null
                if(!obj.dictDataObject){
                  resultType = ''
                }else{
                  if(obj.dataType == 10 || obj.dataType == 20){
                    resultType = ''
                  }else if(obj.dataType == 110 || obj.dataType == 120){
                    resultType = []
                  }
                }
                this.$set(this.submitData.productExtend.valueJson, obj.id, resultType)
              } else if (obj.attrType == 2) {
                this.propertyLength++
                let resultType = null
                if(!obj.dictDataObject){
                  resultType = ''
                }else{
                  if(obj.dataType == 10 || obj.dataType == 20){
                    resultType = ''
                  }else if(obj.dataType == 110 || obj.dataType == 120){
                    resultType = []
                  }
                }
                this.$set(this.submitData.productExtend.valueJson, obj.id, resultType)
              } else if (obj.attrType == 3) {
                this.specificationLength++
                this.specificationAttrs.push(obj.id)
                this.$set(
                  this.submitData.specificationList[0].specificationJson,
                  obj.id,
                  null
                )
              }
            })
            this.checkPropAndSpecLength()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getAttrByKindId)
        })
    },
    resetData() {
      this.baseInfoLength = 0
      this.propertyLength = 0
      this.specificationLength = 0

      this.resetBaseData()
    },
    resetBaseData() {
      this.allImgs = []
      this.submitData = {
        productClassId: this.submitData.productClassId,
        productName: null,
        productNumber: null,
        productStatus: 1,
        supplierNumber: null,
        productDescribe: null,
        imageList: [], // 图片列表
        productExtend: {
          valueJson: {}
        }, // 拓展属性
        specificationList: [
          {
            specificationJson: {}
          }
        ] // 所有规格
      }
      this.selPromotions.forEach((item, index) => {
        if (item.length > 0) {
          item.splice(0, 1)
        }
      })
    },
    checkPropAndSpecLength() {
      if (this.propertyLength == 0)
        this.$delete(this.submitData, 'productExtend')
      if (this.specificationLength == 0)
        this.$delete(this.submitData, 'specificationList')
    },
    getAllPromotions() {
      this.Axios
        .get('/promotion/category')
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
    }
  },
  created() {
    this.getAllKind()
    this.getAllPromotions()
  },
  watch: {
    allImgs(val) {
      if (val.length == 0) {
        utils.reset(this.$refs.fileInput)
      }
    },
    categoryIds(val) {
      this.$set(this.addProToKind, 'categoryIds', val)
    },
    allKindList(val) {
      val.length > 0 ? (this.btnStatus = false) : (this.btnStatus = true)
    }
  },
  computed: {
    categoryIds() {
      // 计算过后的推广类别数组
      let result = []
      this.selPromotions.forEach(item => {
        if (item[0]) {
          result.push(item[0])
        }
      })
      return result
    },
    allKindList() {
      return this.allKind.list
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$base-box-shadow = 0 0 10px #e5e5e5
$base-border-radius = 5px
.addProduction
  color #999999
  .picWrapper
    border-radius $base-border-radius
    margin-top 20px
    box-shadow $base-box-shadow
    padding-left 20px
    .top
      height 50px
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #D9D9D9
      .title
        color #333333
        padding-left 8px
        border-left 2px solid $base-color
      .topBtns
        margin-right 10px
    .bottom
      display flex
      flex-wrap wrap
      padding-bottom 15px
      .buttomItem
        margin 15px 15px 0 0
        position relative
        border-radius 5px
        overflow hidden
        .myImg
          box-sizing border-box
          width 144px
          height 108px
          transition padding 0.1s
        .myIcon
          color $base-color
          position absolute
          top 3px
          right 3px
          font-size 15px
      .uploadPlace
        margin-top 15px
        display flex
        flex-direction column
        justify-content center
        align-items center
        border 1px dashed $base-color
        border-radius 5px
        width 144px
        height 108px
        color $base-color
        line-height 14px
        font-size 12px
        i
          font-size 18px
  .baseInfo
    border-radius $base-border-radius
    margin-top 20px
    box-shadow $base-box-shadow
    padding-left 20px
    .title
      height 50px
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #D9D9D9
      span
        color #333333
        padding-left 8px
        border-left 2px solid $base-color
    .content
      margin-top 30px
      margin-right 20px
      display flex
      flex-wrap wrap
      .item
        width 30%
        margin-bottom 30px
        display flex
        align-items center
        margin-right 3%
        .pointer
          color $base-color
          margin-left 10px
          font-weight bold
        .text
          width 100px
          text-align right
          white-space nowrap
      .proDesc
        align-items flex-start
        width 100%
        margin-right 0
        .text
          width 83px
  .property
    border-radius $base-border-radius
    margin-top 20px
    box-shadow $base-box-shadow
    padding-left 20px
    .title
      height 50px
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #D9D9D9
      span
        color #333333
        padding-left 8px
        border-left 2px solid $base-color
    .content
      margin-top 30px
      margin-right 20px
      display flex
      flex-wrap wrap
      .item
        width 30%
        margin-right 3%
        margin-bottom 30px
        display flex
        align-items center
        .text
          white-space nowrap
        .pointer
          color $base-color
          margin-left 10px
          font-weight bold
  .specification
    border-radius $base-border-radius
    margin-top 20px
    box-shadow $base-box-shadow
    padding 0 0 30px 20px
    .title
      height 50px
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #D9D9D9
      .text
        color #333333
        padding-left 8px
        border-left 2px solid $base-color
      .btn
        margin-right 10px
    .content
      margin 16px 0 16px 0
  .generalize
    border-radius $base-border-radius
    margin-top 20px
    box-shadow $base-box-shadow
    padding-left 20px
    .top
      height 50px
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #D9D9D9
      .title
        color #333333
        padding-left 8px
        border-left 2px solid $base-color
    .content
      display flex
      flex-wrap wrap
      padding 20px 0
      .item
        width 100%
        padding 10px 0
        display flex
        line-height 25px
        .childCheckbox
          color #A7A7A7
  .btnWrapper
    height 100px
    display flex
    align-items center
    justify-content center
</style>
