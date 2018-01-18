<template>
    <div class="conBigDiv"  v-loading="qCodeloading">
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
                  <el-button type="primary" size="small">下载二维码</el-button>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="codeRegRight">
                  <div class="regSubDiv">
                    设置产品信息<br/>
                    <el-col :span="12">
                      <img src="static/imgs/syBg.png" class="imgNoClass" @click="proClick"/>
                      点击图片添加产品信息
                    </el-col>
                    <el-col :span="12">
                      <div class="imgDisClass">
                        <img src="static/imgs/test.png" class="imgNoClass" @click="proClick"/>
                        <div class="imgDisText">点击更换产品</div>
                      </div>
                    </el-col>
                  </div>
                  <div class="regSubDiv">
                    客户信息<br/>
                    <el-input type="text" id="getval" v-model="Qcode" placeholder="请输入客户用户名称" size="small" class="qcodeInput"/><br/>
                    <el-button type="info" @click="qrcodeFun" size="small">生成二维码</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-dialog
              title="选择单个产品"
              :visible.sync="proVisible"
              width="960px">
                产品品类
                <el-select v-model="value" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in proClass"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="proSearch" 
                  size="small"
                  class="proSearchClass">
                </el-input>
                <br/>
                <el-row :gutter="20" v-loading="productLoading">
                      <el-col :span="8" v-for="(item,index) in productData" :key="index">
                        <div class="selectone_img_div" @click="proClickId(item)">
                          <img :src="fileAddress+item.headImage" :class="[item.id==proClickedId  ? 'carouSubbottomImg_border' : 'carouSubbottomImg']"/>
                          {{item.productName}}<br/>
                          <span class="carou_subbottom_span">{{item.productNumber}}</span>
                        </div>
                      </el-col>
                </el-row>
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
import QrCode from "@/commons/libs/QrCode";
export default {
  data() {
    return {
      Qcode: "www.baidu.com", //二维码数据生成渲染
      productLoading: false,
      qrcode: [], //qrcode对象
      checked: true,
      options: [
        {
          value: "1",
          label: "访客权限"
        },
        {
          value: "2",
          label: "客户权限"
        }
      ],
      value: "1", //用户权限
      productData: [], //产品数据
      productAllData: [], //产品全部数据
      proVisible: false, //产品弹出框
      proClass: [
        //产品分类数据
        {
          value: "1",
          name: "全部产品"
        },
        {
          value: "2",
          name: "牛鼻手镯"
        }
      ],
      proSearch: "", //产品搜索
      proClickedId: "", //产品选中Id
      qCodeloading: false //网页加载中
    };
  },
  mounted() {
    this.qCodeloading = true;
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      this.loading = false;
      self.qrcode = new QRCode(self.$refs.qrcode, {
        width: 200, //设置二维码宽高
        height: 200
      });
      self.qrcodeFun();
    },
    //渲染成二维码
    qrcodeFun() {
      var self = this;
      
      self.qrcode.makeCode(self.Qcode);
      self.qCodeloading = false;
    },
    //点击更换产品弹出框
    proClick() {
      var self = this;
      self.productLoading = true;
      let params = {
        PRS: {
          page: 1,
          size: 15
        }
      };
      this.Axios
        .get("/product/product", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            self.productData = data.data.data.list;
            self.productAllData = data.data.data;
            self.productLoading = false;
            self.proVisible = true;
          }
        })
        .catch(err => {
          this.extCatch(err, this.proClick);
        });
    },
    //选择产品Id
    proClickId(elem) {
      var self = this;
      self.proClickedId = elem.id;
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
        .regSubDiv
          margin-bottom 20px
          font-size 16px
          color $font-color
          float left
          width 100%
          line-height 40px
          .qcodeInput
            width 240px
          .imgNoClass
            width 120px
            height 90px
            margin-right 20px
            float left
            cursor pointer
          .imgDisClass
            width 120px
            height 90px
            position relative
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
      .proSearchClass
        width 240px
    .mobileReg
      padding 20px 0 30px 30px
      line-height 35px
    .selectone_img_div
      font-size 16px
      margin-top 15px
      cursor pointer
      .carou_subbottom_span
        color $font-color
        font-size 12px
      .carouSubbottomImg_border
        width 98px
        height 73px
        float left
        margin-right 5px
        border 1px solid red
      .carouSubbottomImg
        width 100px
        height 75px
        float left
        margin-right 5px
</style>