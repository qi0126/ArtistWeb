<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户注册</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div class="regDiv">
          <div class="redfont">邀请二维码生成</div>
          <div class="codeReg">
            <el-row>
              <el-col :span="10">
                <div class="codeRegLeft">
                  <div id="qrcode" ref="qrcode">  
                  </div>  
                  <br/>
                  <a :href="imgSrc" target="_blank" download="RegCode.png"><el-button type="primary" size="small">下载二维码</el-button></a>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="codeRegRight">
                  <div class="regSubDiv">
                    设置产品信息<br/>
                    <el-col :span="12" v-if="proClickedId == ''">
                      <img src="static/imgs/syBg.png" class="imgNoClass" @click="proClick"/>
                      点击图片添加<br/>
                    </el-col>
                    <el-col :span="12" v-else>
                      <div class="imgDisClass">
                        <img :src="fileAddress+proImgUrl" class="imgNoClass" @click="proClick"/>
                        <div class="imgDisText">点击更换产品</div>
                        <div class="nameClass">
                          <p class="nameC">{{selectedProName}}</p>
                          {{selectedProCode}}
                        </div>
                      </div>
                      
                    </el-col>
                  </div>
                  <div class="regSubDiv">
                    客户信息<br/>
                    <el-input type="text" id="getval" v-model="userName" placeholder="请输入客户用户名称" size="small" class="qcodeInput" @change="qrcodeBtnTF = true"/><br/>
                    <el-button type="info" @click="qrcodeFun" size="small" v-show="qrcodeBtnTF">生成二维码</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- {{Qcode}} -->
            <el-dialog
              title="选择单个产品"
              :visible.sync="proVisible"
              width="960px">
                <el-select v-model="proClassValue" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in proClass"
                    :key="item.id"
                    :label="item.className"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="proSearch" 
                  size="small"
                  class="proSearchClass"
                  @change="proSearchFun">
                </el-input>
                <br/>
                <div class="proImgDiv">
                  <el-row :gutter="20" v-loading="productLoading">
                    <el-col :span="8" v-for="(item,index) in productData" :key="index">
                      <div class="selectone_img_div" @click="proClickId(item)">
                        <div :class="[item.id==proClickedId  ? 'carouSubbottomImg_border' : 'carouSubbottomImg']">
                          <img :src="[item.headImage != null?fileAddress+item.headImage:'/static/imgs/syBg.png']" />
                          <div class="proImgNum">共{{item.imageCount}}张</div>
                        </div>
                        {{item.productName}}<br/>
                        <span class="carou_subbottom_span">{{item.productNumber}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- <div class="loading">{{proimgText?"正在加载中...":"产品已经加载完成！"}}</div> -->
                </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="proVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="proVisible = false" size="small">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
        <div class="regDiv">
          <div class="redfont">手机号注册设置</div>
          <div class="mobileReg">
            <el-checkbox v-model="checked">允许手机号注册</el-checkbox>
            <span>(勾选后允许手机发送验码注册)</span>
            <br/>
            权限设置
            <br/>
            <el-select v-model="value" placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
	    </div>
    </div>
</template>
<script>
var local = window.location.href;
var localUrl = local.split("#");
//html设置地址，部置时可能需要修改
const htmlURl = `${localUrl[0]}static/html5/AppDownload.html`;

import QrCode from "@/commons/libs/QrCode";
export default {
  data() {
    return {
      Qcode: "", //二维码数据生成渲染
      userName: "", //用户名称
      productLoading: false,
      qrcode: [], //qrcode对象
      checked: true,
      options: [
        //产品分类全部数据
        {
          value: "1",
          label: "全部分类"
        },
        {
          value: "2",
          label: "类别1"
        }
      ],
      value: "1", //产品分类选中
      productData: [], //产品数据
      productAllData: [], //产品全部数据
      proVisible: false, //产品弹出框
      proClass: [], //产品分类数据
      proClassValue: -1, //产品分类选中数据
      proSearch: "", //产品搜索
      proClickedId: "", //产品选中Id
      proImgUrl: "", //产品选中显示url
      imgSrc: "", //二维码下载
      qrcodeBtnTF: false, //生成二维码按钮显示
      EventListenerTf: true, //产品分页已加监听，true为未加载监听，false为已加载监听
      proimgText: true, //产品分页加载显示提示true显示“正在加载中...”，false显示“产品已经加载完成！”
      tempTxt: [],
      selectedProName: "", //选中产品名称
      selectedProCode: "", //选中产品编码
      companyId: "" //公司id
    };
  },
  mounted() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.qrcode = new QRCode(self.$refs.qrcode, {
        width: 200, //设置二维码宽高
        height: 200
      });
      var lStorage = window.localStorage;
      this.Axios.get("/common/keyword/company")
        .then(data => {
          if (data.data.code == 0) {
            self.companyId = lStorage.companyId;
            self.qrcodeFun();
          }
        })
        .catch(err => {
          self.qrcodeFun();
          this.extCatch(err, this.create_fun);
        });
    },
    //渲染成二维码
    qrcodeFun() {
      var self = this;

      self.tempTxt = [];
      self.tempTxt[0] = htmlURl;
      self.tempTxt[1] = self.selectedProCode; //选中产品ID
      self.tempTxt[2] = self.userName; //客户名称
      self.tempTxt[3] = self.companyId; //公司id
      self.Qcode = "";
      for (var i in self.tempTxt) {
        if (i == 0) {
          self.Qcode = self.tempTxt[i];
        } else {
          self.Qcode += "?" + self.tempTxt[i];
        }
      }
      self.qrcode.makeCode(self.Qcode);
      setTimeout(function() {
        var Imgdiv = document.getElementsByTagName("img");
        self.imgSrc = Imgdiv[1].currentSrc;
        self.qrcodeBtnTF = false;
      }, 10);
    },
    //点击更换产品弹出框
    proClick() {
      var self = this;
      self.proVisible = true;
      let params = {
        PRS: {
          page: 1,
          size: 15
        }
      };
      this.Axios.get("/product/product", params)
        .then(data => {
          if (data.data.code == 0) {
            //产品类目列表接口
            let params2 = {
              PRS: {
                page: 1,
                size: 9999
              }
            };
            this.Axios.get("/product/productClass", params2)
              .then(res => {
                if (res.data.code == 0) {
                  self.proClass = res.data.data.list;
                  var tempArray = [{ id: -1, className: "全部类别" }];

                  for (var i in self.proClass) {
                    if (self.proClass[i].className != null) {
                      tempArray.push(self.proClass[i]);
                    }
                  }
                  self.proClass = tempArray;
                }
              })
              .catch(err => {
                this.extCatch(err, this.create_fun);
              });
            self.productData = data.data.data.list;
            self.productAllData = data.data.data;
            self.EventListenerTf = false;
          }
        })
        .catch(err => {
          this.extCatch(err, this.proClick);
        });

      if (self.EventListenerTf) {
        //监听产品
        setTimeout(function() {
          var Imgdiv = document.getElementsByClassName("proImgDiv")[0];
          Imgdiv.addEventListener("scroll", function() {
            if (this.scrollHeight - this.scrollTop === this.clientHeight) {
              self.proimgText = true;
              var nextPage = self.productAllData.page + 1;
              var pageSize = self.productAllData.size;
              if ((nextPage - 1) * pageSize < self.productAllData.total) {
                let params = {
                  PRS: {
                    page: nextPage,
                    size: pageSize
                  }
                };
                self.Axios.get("/product/product", params).then(data => {
                  if (data.data.code == 0) {
                    var tempData = self.productData.concat(data.data.data.list);
                    self.productData = tempData;
                    self.productAllData = data.data.data;
                  } else {
                    self.$message({
                      message: data.data.msg,
                      type: "warning"
                    });
                  }
                });
              } else {
                self.nextPage = 0;
                self.proimgText = false;
                return false;
              }
            }
            self.EventListenerTf = false;
          });
        }, 100);
      }
    },
    //产品搜索事件
    proSearchFun() {
      var self = this;
      // console.log(self.proSearch)
      if (self.proSearch.length == 0) {
        self.proClick();
        return false;
      } else {
        let params = {
          keyword: self.proSearch,
          size: 99,
          page: 1
        };
        this.Axios.post("/product/product/search", params)
          .then(data => {
            if (data.data.code == 0) {
              self.productData = data.data.data.list;
              self.proimgText = 0;
            } else {
              this.$message({
                message: data.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.extCatch(err, this.proSearchFun);
          });
      }
    },
    //选择产品Id
    proClickId(elem) {
      var self = this;
      self.proClickedId = elem.id;
      self.selectedProName = elem.productName;
      self.selectedProCode = elem.productNumber;
      self.proImgUrl = elem.headImage;
      self.qrcodeBtnTF = true;
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
  .regDiv
    box-shadow 2px 2px 8px #d8d8d8
    padding 20px
    margin-top 15px
    .proImgDiv
      max-height 430px
      overflow-y auto
      overflow-x hidden
      .selectone_img_div
        font-size 16px
        margin-top 15px
        cursor pointer
        .carou_subbottom_span
          color $font-color
          font-size 12px
        .carouSubbottomImg_border
          width 98px
          height 74px
          float left
          margin-right 10px
          cursor pointer
          position relative
          border 1px solid red
          border-radius 5px
          img
            width 98px
            height 74px
            border-radius 5px
        .carouSubbottomImg
          width 100px
          height 76px
          float left
          margin-right 10px
          cursor pointer
          position relative
          border-radius 5px
          img
            width 98px
            height 74px
            border-radius 5px
        .proImgNum
          position absolute
          top 61px
          right 0
          margin-top -11px
          background-color #999
          opacity 0.8
          color #ffffff
          font-size 12px
          padding 0 5px
          border-bottom-right-radius 5px
      .loading
        text-align center
        padding 20px
    .codeReg
      padding 20px 0 30px 30px
      line-height 35px
      .codeRegLeft
        text-align center
        #qrcode
          width 200px
          height 200px
          margin 0 auto
      .codeRegRight
        text-align left
        margin-top -16px
        .regSubDiv
          margin-bottom 20px
          font-size 16px
          color $font-color
          float left
          width 100%
          line-height 34px
          .qcodeInput
            width 240px
          .imgNoClass
            width 120px
            height 90px
            margin-right 16px
            float left
            cursor pointer
            border-radius 5px
          .imgDisClass
            width 120px
            height 90px
            position relative
            .nameClass
              width 250px
              line-height 25px
              color $font-color
              font-size 16px
              .nameC
                color #333
            .imgDisText
              position absolute
              bottom 0
              text-align center
              color #fff
              background-color $font-color
              width 100%
              opacity 0.7
              height 24px
              font-size 12px
              cursor pointer
              line-height 25px
              border-bottom-left-radius 5px
              border-bottom-right-radius 5px
      .proSearchClass
        width 240px
    .mobileReg
      padding 20px 0 30px 30px
      line-height 35px
</style>