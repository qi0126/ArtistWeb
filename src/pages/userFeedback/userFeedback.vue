<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <div class="hr"/>
            <div class="topmenu">
                <el-row>
                    <el-col :span="18">
                        状态查看
                        <el-select v-model="selectState" placeholder="请选择" size="small">
                            <el-option
                            v-for="item in allState"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        分类查看
                        <el-select v-model="selectProblem" placeholder="请选择" size="small">
                            <el-option
                            v-for="item in allProblem"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        此类问题共有<span>{{problemNum}}</span>个
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="problemSearch" placeholder="客户名、客户编号、产品名称" suffix-icon="el-icon-search" size="small"></el-input>
                    </el-col>
                </el-row>
            </div>
            <el-collapse v-model="activeNames" class="collaBigDiv">
                <el-collapse-item name="1" class="collaTwoDiv">
                    <template slot="title">
                        <div :class="0?'collaRedMenu':'collaBlackMenu'">
                            <el-row>
                                <el-col :span="5">
                                    <div class="collaSubMenu">
                                        反馈单号 
                                        <span class="blackFont">2017120888888</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        账号 
                                        <span class="blackFont">周大福</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        编号 
                                        <span class="blackFont">1096</span>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="collaSubMenu">
                                        下单时间 
                                        <span class="blackFont">2017-12-08 8888888</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenuRight">
                                        状态 
                                        <span :class="0?'redFont':''">{{0?"未处理":"已处理"}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                    <div class="collaContant">
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">联系方式:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">139999999999</div>
                            </el-col>
                            <el-col :span="1">
                                <div class="SubContant">
                                    <el-button type="primary" size="small">提交</el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题意见:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">XXXXXXXXXX</div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题分类:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">苹果APP程序问题</div>
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
                                        autosize
                                        placeholder="请填写处理意见"
                                        v-model="feedText"
                                        v-if = "0">
                                    </el-input>
                                    <span v-else>处理意见</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="2" class="collaTwoDiv">
                    <template slot="title">
                        <div :class="1?'collaRedMenu':'collaBlackMenu'" >
                            <el-row>
                                <el-col :span="5">
                                    <div class="collaSubMenu">
                                        反馈单号 
                                        <span class="blackFont">2017120888888</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        账号 
                                        <span class="blackFont">周大福</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        编号 
                                        <span class="blackFont">1096</span>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="collaSubMenu">
                                        下单时间 
                                        <span class="blackFont">2017-12-08 8888888</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenuRight">
                                        状态 
                                        <span :class="1?'redFont':''">{{1?"未处理":"已处理"}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                    <div class="collaContant">
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">联系方式:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">139999999999</div>
                            </el-col>
                            <el-col :span="1">
                                <div class="SubContant">
                                    <el-button type="primary" size="small">提交</el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题意见:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">XXXXXXXXXX</div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题分类:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">苹果APP程序问题</div>
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
                                        v-model="feedText"
                                        v-if = "1">
                                    </el-input>
                                    <span v-else>处理意见</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="3" class="collaTwoDiv">
                    <template slot="title">
                        <div :class="0?'collaRedMenu':'collaBlackMenu'">
                            <el-row>
                                <el-col :span="5">
                                    <div class="collaSubMenu">
                                        反馈单号 
                                        <span class="blackFont">2017120888888</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        账号 
                                        <span class="blackFont">周大福</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenu">
                                        编号 
                                        <span class="blackFont">1096</span>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="collaSubMenu">
                                        下单时间 
                                        <span class="blackFont">2017-12-08 8888888</span>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="collaSubMenuRight">
                                        状态 
                                        <span :class="0?'redFont':''">{{0?"未处理":"已处理"}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                    <div class="collaContant">
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">联系方式:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">139999999999</div>
                            </el-col>
                            <el-col :span="1">
                                <div class="SubContant">
                                    <el-button type="primary" size="small">提交</el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题意见:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">XXXXXXXXXX</div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2">
                                <div class="SubContant textRight">问题分类:</div>
                            </el-col>
                            <el-col :span="20">
                                <div class="SubContant blackFont">苹果APP程序问题</div>
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
                                        v-model="feedText"
                                        v-if = "0">
                                    </el-input>
                                    <span v-else>处理意见</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>

            </el-collapse>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: ["1"], //用户反馈打开name数组
      allState: [
        //全部状态
        {
          value: "1",
          label: "全部状态"
        },
        {
          value: "2",
          label: "未查看问题"
        },
        {
          value: "3",
          label: "已查看问题"
        }
      ],
      selectState: "1", //选择全部状态
      allProblem: [
        //全部状态
        {
          value: "1",
          label: "全部问题"
        },
        {
          value: "2",
          label: "苹果APP程序问题"
        },
        {
          value: "3",
          label: "安卓APP程序问题"
        },
        {
          value: "4",
          label: "产品问题"
        },
        {
          value: "5",
          label: "跳转问题（后台设置）"
        },
        {
          value: "6",
          label: "客户建议"
        }
      ],
      selectProblem: "1", //选择全部状态
      problemNum: "0", //此类问题有几个
      problemSearch: "", //问题搜索
      feedText:"",//意见反馈内容
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {}
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
            box-shadow 2px 2px 1px #d8d8d8
            border-radius 3px
            margin-bottom 10px
            border-left 1px solid #f0f0f0
            border-top 1px solid #f0f0f0
            .collaRedMenu
                border-left 4px solid red
                color $font-color
                border-bottom 1px #d8d8d8 solid
            .collaBlackMenu
                border-left 4px solid $font-color
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
    .redFont
        color $base-color
    .blackFont
        color $backfont-color
</style>