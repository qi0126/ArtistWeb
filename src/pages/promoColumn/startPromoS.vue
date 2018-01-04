<template>
    <div class="carouselBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
            <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
            <el-breadcrumb-item>推广栏目</el-breadcrumb-item>
            <el-breadcrumb-item>启动推广设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="redfont">
          启动推广设置
        </div>
        <div class="contant">
          <el-row>
            <el-col :span="8">
              <div class="startimg" @click="uploadImg"> 
                <img src="\static\imgs\startPromoImg.png"/>            
              </div>
              <input type="file" ref="imgUpload" v-show="0">
              <div class="startimgText">
                <span v-show="selectMode == '1'">点击图片上传推广图片</span>
                <span v-show="selectMode == '2'">点击图片上传推广动画</span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="rightdiv">
                <div class="rightSubdiv">
                  <el-checkbox v-model="open_tf">开启推广</el-checkbox>
                </div>
                <div class="rightSubdiv">
                  选择推广方式<br/>
                  <el-select v-model="selectMode" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in promoModeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="rightSubdiv">
                  倒计时时间<br/>
                  <el-select v-model="selectTime" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in setTimeLong"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="selectShow" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in setShow"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="rightSubdiv">
                  设置推广路径<br/>
                  <el-select v-model="selectValue" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in setpromoUrl"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="hr"/>
                  <span v-show="selectValue == '1'">
                      <el-button type="primary" plain size="small" class="carou_sub_selectbtn" @click="selectcarou_btn">选择类别</el-button>
                      <div class="carou_subbottom_txt">
                          <span class="carou_subbottom_span">已选择类别 : </span>珠宝花开系列
                      </div>
                  </span>
                  <span v-show="selectValue == '2'">
                      <el-button type="primary" plain size="small" class="carou_sub_selectbtn" @click="selectonepro">选择单品</el-button>
                      <div class="carou_subbottom_txt">
                          <img src="/static/imgs/test2.png" class="carou_subbottom_img"/>
                          在水一方<br/>
                          <span class="carou_subbottom_span">100010-1 </span>
                      </div>
                  </span>
                  <div v-show="selectValue == '3'" class="carou_subbottom_txt">
                      <el-input v-model="url_input" placeholder="请输入要跳转的网址" size="small"></el-input>
                  </div>
                </div>
              </div>

              
              <!-- 选择类别弹出框 -->
              <el-dialog
              title="选择推广类别"
              :visible.sync="selectpromo_dialog"
              width="950px">
                <div class="content">
                      <div class="item" v-for="cate in allCategory" :key="cate.id">
                          <div class="parent">
                            <el-radio v-model="catecheckedId" :label="cate.id">{{cate.categoryName}}</el-radio>
                          </div>
                          <div class="child" v-show="cate.children != undefined">
                            【 <el-radio v-model="catecheckedId" class="childText" :label="catesub.id" v-for="catesub in cate.children" :key="catesub.id">{{ catesub.categoryName }}</el-radio> 】
                          </div>
                      </div>
                </div>
                  <span slot="footer" class="dialog-footer">
                      <el-button @click="selectpromo_dialog = false" size="small">取 消</el-button>
                      <el-button type="primary" @click="selectedPromo" size="small">确 定</el-button>
                  </span>
              </el-dialog>

              <!-- 选择单品弹出框 -->
              <el-dialog
              title="选择单品"
              :visible.sync="selectone_dialog"
              width="950px">
                  <div>
                      <el-input
                          placeholder="请输入内容"
                          v-model="selecone_search" size="small">
                          <i slot="prefix" class="el-input__icon el-icon-search"></i>
                      </el-input>
                      <el-row :gutter="20">
                          <el-col :span="8" v-for="item in 8" :key="item">
                              <div class="selectone_img_div">
                                  <img src="/static/imgs/test2.png" class="carou_subbottom_img"/>
                                  在水一方<br/>
                                  <span class="carou_subbottom_span">100010-1</span>
                              </div>
                          </el-col>
                      </el-row>
                  </div>
                  <span slot="footer" class="dialog-footer">
                      <el-button @click="selectone_dialog = false" size="small">取 消</el-button>
                      <el-button type="primary" @click="selectone_dialog = false" size="small">确 定</el-button>
                  </span>
              </el-dialog>
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
      open_tf: false,
      promoModeList: [
        //选择推广方式
        {
          value: "1",
          label: "图片推广"
        },
        {
          value: "2",
          label: "动画推广"
        }
      ],
      selectMode: "1",

      setpromoUrl: [
        //设置推广路径
        {
          value: "1",
          label: "推广类别"
        },
        {
          value: "2",
          label: "单个产品"
        },
        {
          value: "3",
          label: "网址"
        }
      ],
      selectValue: "1",
      setTimeLong: [
        //倒计时时间
        {
          value: "2",
          label: "2秒"
        },
        {
          value: "3",
          label: "3秒"
        },
        {
          value: "4",
          label: "4秒"
        }
      ],
      selectTime: "2",
      setShow: [
        //显示
        {
          value: "1",
          label: "显示"
        },
        {
          value: "0",
          label: "不显示"
        }
      ],
      selectShow: "1",
      selectpromo_dialog: false, //选择类别弹出框
      selectone_dialog: false, //选择单品弹出框
      allCategory: [], // 全部推广类别
      catecheckedId: "", //选中推广类别的id
      catecheckedName: "", //选中推广类别的名称
      url_input: "", //跳转地址
      selecone_search: "" //选择单品搜索
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {},
    //点击图片上传图片
    uploadImg() {
      this.$refs.imgUpload.click();
    },
    //选择类别弹出框
    selectcarou_btn() {
      var self = this;
      //推广类别数据属性
      this.Axios
        .get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.categoryData = data.data.data;
            var data = data.data.data,
              tree = (function(data, root) {
                var r,
                  o = {};
                var temp_data = [];
                data.forEach(function(a) {
                  a.children = o[a.id] && o[a.id].children;
                  o[a.id] = a;
                  if (a.parentId == 0) {
                    r = a;
                    temp_data.push(a);
                  } else {
                    o[a.parentId] = o[a.parentId] || {};
                    o[a.parentId].children = o[a.parentId].children || [];
                    o[a.parentId].children.push(a);
                  }
                });
                return temp_data;
              })(data, null);
            self.allCategory = tree;
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
      this.selectpromo_dialog = true;
    },
    //选择类别确认按钮
    selectedPromo() {
      console.log(this.allCategory);
      console.log(this.catecheckedId);

      this.selectpromo_dialog = false;
    },
    //选择单品弹出框
    selectonepro() {
      this.selectone_dialog = true;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.carouselBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 15px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
    color #333
  .red_font
    color $base-color
  .contant
    border 1px solid #e4e4e4
    margin-top 10px
    padding 60px
    border-radius 5px
    .startimg
      cursor pointer
      img
        width 90%
    .startimgText
      margin-top 24px
      text-align center
      color #a8a8a8
    .rightdiv
      line-height 50px
      color $font-color
      .rightSubdiv
        line-height 30px
        margin-bottom 30px
      .carou_sub_selectbtn
        float right
    .selectone_img_div
      margin 10px 0 10px 0
    .carou_subbottom_img
      width 100px
      height 75px
      float left
      margin-right 5px
      border 1px solid red
  .item
    width 100%
    margin-bottom 30px
    display flex
    align-items top
    .child .el-radio
      color #999
    .text
      white-space nowrap
</style>