<template>
  <div class="aboutWe">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>公司管理</el-breadcrumb-item>
        <el-breadcrumb-item>关于我们</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="contentWrapper">
      <div class="aboutCompany">
        <div class="title">
          <span>关于公司</span>
        </div>
        <div class="imgPlace">
          <div class="imgs">
            <div class="item" @mouseover="imgMouseover(imgObj.id)" @mouseout="imgMouseout" v-for="imgObj in allData.images" v-if="imgObj.type==0">
              <div class="itemImg">
                <img :src="imgObj.image" alt="暂无图片" class="myImg">
                <i class="el-icon-circle-close-outline bt-hover" v-show="imgObj.id == tempImgId" @click="delPic(imgObj.id)"></i>
              </div>
            </div>
          </div>
          <div class="upload bt-hover" @mouseover="setType(0)" onClick="uploadImg.click()">
            <i class="el-icon-circle-plus-outline"></i>
            <span>点击上传图片</span>
            <span>建议图片尺寸为16:9</span>
          </div>
        </div>
        <div class="desc">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容（0/500）"
            :maxlength="500"
            @change="introChange('companyIntro',allData.companyIntro,0)"
            v-model="allData.companyIntro">
          </el-input>
        </div>
      </div>
      <div class="aboutApp">
        <div class="title">
          <span>关于App</span>
        </div>
        <div class="imgPlace">
          <div class="imgs">
            <div class="item" @mouseover="imgMouseover(imgObj.id)" @mouseout="imgMouseout" v-for="imgObj in allData.images" v-if="imgObj.type==1">
              <div class="itemImg">
                <img :src="imgObj.image" alt="暂无图片" class="myImg">
                <i class="el-icon-circle-close-outline bt-hover" v-show="imgObj.id == tempImgId" @click="delPic(imgObj.id)"></i>
              </div>
            </div>
          </div>
          <div class="upload bt-hover" @mouseover="setType(1)" onClick="uploadImg.click()">
            <i class="el-icon-circle-plus-outline"></i>
            <span>点击上传图片</span>
            <span>建议图片尺寸为16:9</span>
          </div>
        </div>
        <div class="desc">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容（0/500）"
            :maxlength="500"
            @change="introChange('appIntro',allData.appIntro,1)"
            v-model="allData.appIntro">
          </el-input>
        </div>
      </div>
    </div>

    <div class="commonPlace">
      <input type="file" id="uploadImg" @change="uploadImgEvent" hidden>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'
export default {
  data() {
    return {
      allData: {},
      tempImgId: null,
      tempType: null
    }
  },
  methods: {
    delPic(id) {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      })
        .then(res => {
          this.Axios.delete(`/company/aboutUs/${id}`).then(res=>{
            let result = res.data
            if(result.code == 0){
              this.$message.success('删除成功')
              this.getAllInfo()
            }else{
              this.$message.error(result.msg)
            }
          }).catch(err=>{
            this.extCatch(err,this.delPic)
          })
        })
        .catch(err => {})
    },
    getAllInfo() {
      this.Axios
        .get('/company/aboutUs')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.allData = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getAllInfo)
        })
    },
    uploadImgEvent(e) {
      utils.encodeBase64(e).then(data => {
        let count = 0
        this.allData.images.forEach(imgObj => {
          if (imgObj.type == this.tempType) {
            count++
          }
        })
        if (count >= 4) {
          this.$message.error('抱歉，最多上传4张图片')
          return false
        }
        this.introChange('imageUrl', data, this.tempType)
      })
    },
    imgMouseover(imgId) {
      this.tempImgId = imgId
    },
    imgMouseout() {
      this.tempImgId = null
    },
    introChange(name, val, type) {
      let params = {
        [name]: val,
        type: type
      }
      this.Axios
        .post('/company/aboutUs', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('操作成功')
            this.getAllInfo()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.introChange)
        })
    },
    setType(type) {
      this.tempType = type
    }
  },
  created() {
    this.getAllInfo()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.aboutWe
  .headerWrapper
    border-bottom 1px solid #D9D9D9
    padding-bottom 10px
  .contentWrapper
    .aboutCompany, .aboutApp
      margin 10px
      padding 20px
      box-shadow 0 0 10px #CDCDCD
      border-radius 5px
      .title
        padding 0 0 15px 0
        border-bottom 1px solid #D9D9D9
        span
          padding-left 10px
          border-left 3px solid $base-color
      .imgPlace
        margin 20px 0
        display flex
        .imgs
          display flex
          .item
            position relative
            margin-right 10px
            .itemImg
              i
                position absolute
                top 3px
                right 3px
                color $base-color
                font-size 14px
                &:hover
                  font-weight bold
              .myImg
                width 160px
                height 90px
                border-radius 5px
                box-sizing border-box
                transition padding 0.1s
                &:hover
                  background linear-gradient(orange, $base-color)
                  padding 2px
        .upload
          display flex
          flex-direction column
          justify-content center
          align-items center
          border 1px dashed $base-color
          border-radius 5px
          width 160px
          height 90px
          color $base-color
          line-height 14px
          font-size 12px
          i
            font-size 18px
</style>
