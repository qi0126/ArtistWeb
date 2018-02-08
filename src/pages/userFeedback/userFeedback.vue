<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <div class="hr"/>
            <div class="topmenu"  v-loading="loading">
                <el-row>
                    <el-col :span="18">
                        状态查看
                        <el-select v-model="selectState" placeholder="请选择" size="small" @change="changeState">
                            <el-option
                            v-for="item in allState"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        分类查看
                        <el-select v-model="selectProblem" placeholder="请选择" size="small" @change="changeProblem">
                            <el-option-group
                            v-for="group in stateAllData"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        此类问题共有<span>{{feedbackAllData.total}}</span>个
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="problemSearch" placeholder="请输入关健字搜索..." size="small">
                            <el-button slot="append" icon="el-icon-search" @click="probSearch"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <el-collapse v-model="activeNames" class="collaBigDiv">
                <el-collapse-item :name="item.id" class="collaTwoDiv" v-for="item in feedbackData" :key="item.id">
                    <template slot="title">
                        <div :class="item.status === 1?'collaBlackMenu':'collaRedMenu'">
                            <el-row>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        反馈单号 
                                        <span class="blackFont">{{item.feedNumber}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        账号 
                                        <span class="blackFont">{{item.userName}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        编号 
                                        <span class="blackFont">{{item.number}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="3">
                                    <div class="collaSubMenu">
                                        平台 
                                        <span class="blackFont" v-if="item.appType == null">无此机型</span>
                                        <span class="blackFont" v-else-if="item.appType == 9">Android</span>
                                        <span class="blackFont" v-else-if="item.appType == 10">iOS</span>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div class="collaSubMenu">
                                        创建时间 
                                        <span class="blackFont">{{item.createTime}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="3">
                                    <div class="collaSubMenuRight">
                                        状态 
                                        <span :class="[item.status === 1?'':'redFont']">{{item.status === 1?"已处理":"未处理"}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                    <div class="collaContant">
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">程序问题:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">
                                    <span v-if="item.procedureType === 1">程序问题</span>
                                    <span v-else-if="item.procedureType === 2">跳转错误</span>
                                    <span v-else-if="item.procedureType === 3">其他问题</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div class="SubContant">
                                    <el-button type="primary" size="small" v-if="item.status === 2" @click="submitProblem(item)">提交</el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">业务问题:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">
                                    <!-- {{item.businessType}} -->
                                    <span v-if="item.businessType === 4">客户建议</span>
                                    <span v-else-if="item.businessType === 5">产品错误</span>
                                    <span v-else-if="item.businessType === 6">数据错误</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题意见:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">{{item.content}}</div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">联系方式:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">{{item.contact}}</div>
                            </el-col>
                            <el-col :span="1">

                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">
                                    处理意见:
                                </div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请填写处理意见"
                                        v-model="item.suggest"
                                        v-if = "item.status === 2">
                                    </el-input>
                                    <span v-else>{{item.suggest}}</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <div class="loading">
                    {{loadingTxt}}
                </div>
            </el-collapse>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: [0], //用户反馈打开name数组
      allState: [
        //全部状态
        {
          value: 0,
          label: "全部状态"
        },
        {
          value: 1,
          label: "已处理问题"
        },
        {
          value: 2,
          label: "未处理问题"
        }
      ],
      selectState: 0, //选择问题数据
      stateAllData: [
        //下拉选择问题数据
        {
          label: "问题类型",
          options: [
            {
              value: 1,
              label: "全部问题"
            },
            {
              value: 2,
              label: "苹果APP程序问题"
            },
            {
              value: 3,
              label: "安卓APP程序问题"
            }
          ]
        },
        {
          label: "程序问题",
          options: [
            {
              value: 4,
              label: "程序问题"
            },
            {
              value: 5,
              label: "跳转错误"
            },
            {
              value: 6,
              label: "其他问题"
            }
          ]
        },
        {
          label: "业务问题",
          options: [
            {
              value: 7,
              label: "客户建议"
            },
            {
              value: 8,
              label: "产品错误"
            },
            {
              value: 9,
              label: "数据错误"
            }
          ]
        }
      ],
      selectProblem: 1, //选择全部状态
      problemSearch: "", //问题搜索
      feedText: "", //意见反馈内容
      feedbackAllData: [], //意见反馈所有内容
      feedbackData: [], //意见反馈显示内容
      addlistenerTf: true, //监听事件
      pageNum: 1, //页码默认为第1页
      pageSize: 14, //下拉每页显示几条记录
      loadingTxt: "", //下拉加载提示语
      loading: false //网页加载中
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.loading = true;
      self.FindAllData(0, 0, 0, 0, 1, self.pageSize);

      //下拉加载监听事情
      setTimeout(function() {
        var Imgdiv = document.getElementsByClassName("rightWrapper")[0];
        // console.log(Imgdiv);
        Imgdiv.addEventListener("scroll", function() {
          if (this.scrollHeight - this.scrollTop === this.clientHeight) {
            //   console.log(self.feedbackAllData)
            if (self.pageNum * self.pageSize < self.feedbackAllData.total) {
              // self.loadingTxt = "下拉加载数据中..."
              self.pageNum++;
              switch (self.selectProblem) {
                case 1: //全部问题
                  self.AddAllData(
                    self.selectState,
                    0,
                    0,
                    0,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 2: //苹果APP程序问题
                  self.AddAllData(
                    self.selectState,
                    10,
                    0,
                    0,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 3: //安卓APP程序问题
                  self.AddAllData(
                    self.selectState,
                    9,
                    0,
                    0,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 4: //程序问题
                  self.AddAllData(
                    self.selectState,
                    0,
                    1,
                    0,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 5: //跳转错误
                  self.AddAllData(
                    self.selectState,
                    0,
                    2,
                    0,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 6: //其他问题
                  self.AddAllData(
                    self.selectState,
                    0,
                    3,
                    0,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 7: //客户建议
                  self.AddAllData(
                    self.selectState,
                    0,
                    0,
                    4,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 8: //产品错误
                  self.AddAllData(
                    self.selectState,
                    0,
                    0,
                    5,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
                case 9: //数据错误
                  self.AddAllData(
                    self.selectState,
                    0,
                    0,
                    6,
                    self.pageNum,
                    self.pageSize
                  );
                  break;
              }
            }
          }
        });
      }, 100);
    },
    //根据条件查询数据
    FindAllData(status, appType, procedureType, businessType, page, size) {
      var self = this;
      let params = {
        PRS: {
          status: status,
          appType: appType,
          procedureType: procedureType,
          businessType: businessType,
          page: page,
          size: size
        }
      };
      this.Axios.get("/common/feedback/list", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data)
            self.loading = false;
            self.feedbackAllData = data.data.data;
            self.feedbackData = data.data.data.list;
            if (self.feedbackAllData.total == 0) {
              self.loadingTxt = "用户还没有反馈！";
            } else {
              if (self.pageNum * self.pageSize < self.feedbackAllData.total) {
                if(self.pageSize < self.feedbackAllData.total){
                  self.loadingTxt = "";
                }else{
                  self.loadingTxt = "下拉加载数据中...";
                }
              } else {
                self.loadingTxt = "数据已全部加载完成";
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //根据条件分页增加数据
    AddAllData(status, appType, procedureType, businessType, page, size) {
      var self = this;
      self.loading = true;
      let params = {
        PRS: {
          status: status,
          appType: appType,
          procedureType: procedureType,
          businessType: businessType,
          page: page,
          size: size
        }
      };
      this.Axios.get("/common/feedback/list", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            self.loading = false;
            var tempData = self.feedbackData.concat(data.data.data.list);
            self.feedbackData = tempData;
            if (self.feedbackAllData.total == 0) {
              self.loadingTxt = "用户还没有反馈！";
            } else {
              if (self.pageNum * self.pageSize < self.feedbackAllData.total) {
                if(self.pageSize < self.feedbackAllData.total){
                  self.loadingTxt = "";
                }else{
                  self.loadingTxt = "下拉加载数据中...";
                }
              } else {
                self.loadingTxt = "数据已全部加载完成";
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //查看和未查看状态改变查询
    changeState() {
      var self = this;
      //   console.log(self.selectState);
      self.FindAllData(self.selectState, 0, 0, 0, 1, self.pageSize);
    },
    //查看问题类别
    changeProblem() {
      var self = this;
      // console.log(self.selectProblem)
      switch (self.selectProblem) {
        case 1: //全部问题
          self.FindAllData(self.selectState, 0, 0, 0, 1, self.pageSize);
          break;
        case 2: //苹果APP程序问题
          self.FindAllData(self.selectState, 10, 0, 0, 1, self.pageSize);
          break;
        case 3: //安卓APP程序问题
          self.FindAllData(self.selectState, 9, 0, 0, 1, self.pageSize);
          break;
        case 4: //程序问题
          self.FindAllData(self.selectState, 0, 1, 0, 1, self.pageSize);
          break;
        case 5: //跳转错误
          self.FindAllData(self.selectState, 0, 2, 0, 1, self.pageSize);
          break;
        case 6: //其他问题
          self.FindAllData(self.selectState, 0, 3, 0, 1, self.pageSize);
          break;
        case 7: //客户建议
          self.FindAllData(self.selectState, 0, 0, 4, 1, self.pageSize);
          break;
        case 8: //产品错误
          self.FindAllData(self.selectState, 0, 0, 5, 1, self.pageSize);
          break;
        case 9: //数据错误
          self.FindAllData(self.selectState, 0, 0, 6, 1, self.pageSize);
          break;
      }
    },
    //问题处理完成后提交事件
    submitProblem(elem) {
      //   console.log(elem);
      //   console.log(elem.suggest);
      var str = elem.suggest.replace(/\s+/g, "");
      if (str.length == 0) {
        this.$message({
          message: "处理意见不能为空，请重新输入！",
          type: "warning"
        });
        return false;
      }

      let params = {
        id: elem.id,
        suggest: elem.suggest
      };

      this.Axios.put("/common/feedback", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);

            this.$message({
              message: data.data.msg,
              type: "success"
            });
            this.created_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
          //   self.created_fun()
        })
        .catch(err => {
          this.extCatch(err, this.add_textpromo);
        });
    },
    //用户反馈搜索
    probSearch() {
      var self = this;
      //   console.log(self.problemSearch);

      let params = {
        PRS: {
          keyword: self.problemSearch,
          page: 1,
          size: self.pageSize
        }
      };
      this.Axios.get("/common/feedback/search", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            self.feedbackAllData = data.data.data;
            self.feedbackData = data.data.data.list;
            if (self.feedbackAllData.total < self.pageSize) {
              self.loadingTxt = "";
            } else {
              if (self.pageNum * self.pageSize < self.feedbackAllData.total) {
                self.loadingTxt = "下拉加载数据中...";
              } else {
                self.loadingTxt = "数据已全部加载完成";
              }
            }

            this.$message({
              message: data.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.probSearch);
        });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
$backfont-color = #333
.conBigDiv
  .hr
    border-top 1px solid #ddd
    height 3px
    margin 24px 0 24px 0
  .topmenu
    margin-bottom 20px
    color $font-color
  .collaBigDiv
    .collaTwoDiv
      box-shadow 2px 8px 6px #F0F0F0
      border-radius 3px
      margin-bottom 6px
      border-left 1px solid #f0f0f0
      border-top 1px solid #f0f0f0
      .collaRedMenu
        border-left 4px solid red
        color $font-color
        border-bottom 1px #d8d8d8 solid
      .collaBlackMenu
        border-left 4px solid $backfont-color
        color $font-color
        border-bottom 1px #d8d8d8 solid
      .collaContant
        color $font-color
        margin-top 20px
        .SubContant
          padding 10px 12px 0px 0
        .textRight
          text-align right
      .collaSubMenu
        padding-left 12%
      .collaSubMenuRight
        text-align right
    .loading
      padding 10px
      background-color #fff
      text-align center
      font-size 14px
  .redFont
    color $base-color
  .blackFont
    color $backfont-color
</style>