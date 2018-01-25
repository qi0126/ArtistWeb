<template>
  <div class="contactWe">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>公司管理</el-breadcrumb-item>
        <el-breadcrumb-item>联系我们</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="tipWrapper">
      <span>联系我们</span>
    </div>

    <div class="contentWrapper">
      <div class="item">
        <el-checkbox v-model="companyInfo.isUrl" @change="saveValEvent" class="childCheck">跳转主页</el-checkbox>
        <el-input size="small" v-model="companyInfo.url" @change="saveValEvent" placeholder="请输入需要跳转的网址" class="childInp"></el-input>
      </div>
      <div class="item">
        <el-checkbox v-model="companyInfo.isTel" @change="saveValEvent" class="childCheck">拨打电话</el-checkbox>
        <el-input size="small" v-model="companyInfo.tel" :maxlength="11" @change="saveValEvent" placeholder="请输入跳转的电话号码" class="childInp"></el-input>
      </div>
      <div class="item">
        <el-checkbox v-model="companyInfo.isAddress" @change="saveValEvent" class="childCheck">公司地址</el-checkbox>
        <el-input size="small" v-model="companyInfo.address" @change="saveValEvent" placeholder="请输入公司地址" class="childInp"></el-input>
      </div>
      <div class="item">
        <el-checkbox v-model="companyInfo.isSale" @change="saveValEvent" class="childCheck">联系业务员</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      companyInfo: {}
    }
  },
  methods: {
    getCompanyInfoEvent() {
      this.Axios
        .get('company/contactUs')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.companyInfo = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getCompanyInfoEvent)
        })
    },
    saveValEvent(val) {
      this.Axios
        .post('company/contactUs', this.companyInfo)
        .then(res => {
          let result = res.data
          if(result.code == 0) {
            this.$message.success('修改成功')
          }else{
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.saveValEvent)
        })
    }
  },
  created() {
    this.getCompanyInfoEvent()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.contactWe
  .headerWrapper
    border-bottom 1px solid #D9D9D9
    padding-bottom 10px
  .tipWrapper
    padding 20px 0
    span
      padding-left 10px
      font-size 14px
      border-left 3px solid $base-color
  .contentWrapper
    border 1px solid #D9D9D9
    padding 30px
    .item
      display flex
      align-items center
      margin-bottom 30px
      .childCheck
        width 130px
      .childInp
        width 20%
</style>
