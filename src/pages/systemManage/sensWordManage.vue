<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>敏感词管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <el-input
            placeholder="请输入敏感词搜索"
            prefix-icon="el-icon-search"
            v-model="wordSearch"
            @change="wordSearchFun"
            class="searchInput"
            >
          </el-input>
        </div>
        <div class="wordDiv">
          <el-row>
            <el-col :span="16">
              <el-input
                type="textarea"
                :autosize="{ minRows:10,}"
                placeholder="请输入内容"
                v-model="wordDisplay"
                @change="editWordFun"
                >
              </el-input>
            </el-col>
            <el-col :span="8">
              <div class="wordTitB">提示</div>
              <div class="wordTit">设置敏感词时请使用,逗号、空格、顿号作为分隔符。</div>
            </el-col>
          </el-row>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      wordSearch: "",
      wordDisplay: ""
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.wordSearchFun();
    },
    //关键字搜索
    wordSearchFun() {
      var self = this;
      // console.log(self.wordSearch);
      let params = {
        PRS: {
          keyword: self.wordSearch
        }
      };
      this.Axios.get("/common/keyword", params)
        .then(data => {
          // console.log(data.data);
          // if (data.data.code == 0) {
          //   console.log(data.data);
          // }
        })
        .catch(err => {
          this.extCatch(err, this.wordSearchFun);
        });
    },
    //关键字添加
    editWordFun() {
      var self = this;
      
      if (self.wordDisplay.length != 0) {
        // console.log(self.wordDisplay);
        let params = {
          keyword: self.wordDisplay
        };
        // console.log(params)
      this.Axios
        .post("/common/keyword",params)
        .then(data => {
          // if (data.data.code == 0) {
          //   console.log(data.data.data);
          //   this.$message({
          //     message: data.data.msg,
          //     type: "success"
          //   });
          // } else {
          //   this.$message({
          //     message: data.data.msg,
          //     type: "warning"
          //   });
          // }
        }).catch(err => {
          this.extCatch(err, this.editWordFun);
        });

      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
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
  .searchInput
    width 320px
  .wordDiv
    margin-top 15px
    .wordTitB
      color $font-color
      font-size 18px
      padding-left 20px
    .wordTit
      color $font-color
      font-size 14px
      padding-left 20px
      margin-top 15px
</style>