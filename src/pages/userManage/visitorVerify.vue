<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>访客审核</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <el-tabs type="border-card" v-if="companyAllData.length !=0">
            <el-tab-pane v-for="item in companyAllData" :key="item.id">
              <span slot="label"><i class="el-icon-date"></i> {{item.name}}</span>
              {{item.name}}
            </el-tab-pane>
          </el-tabs>
          <div v-else align="center">暂无公司可选，请到公司设置添加公司！</div>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      companyAllData:[],//公司全部数据
    }
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this
      this.Axios.get("/company/company")
        .then(data => {
          if (data.data.code == 0) {
            console.log(data.data.data);
            self.companyAllData = data.data.data
            // self.companyAllData = []
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px;
    margin-bottom 10px;
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
</style>