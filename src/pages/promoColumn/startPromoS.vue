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
        <div class="contant" v-loading.fullscreen.lock="loading">
          <el-row>
            <el-col :span="6" class="leftcol">
              <div class="startimg" @click="uploadImg" v-if="startAllData.imageType == '0'"> 
                <img src="\static\imgs\startPromoImg.png" v-if="startAllData.imageUrl == ''" class="startImgClass"/>            
                <img :src="fileAddress+'/'+startAllData.imageUrl" v-else class="startImgClass"/>            
              </div>
              <div class="startimg" @click="uploadMoive" v-if="startAllData.imageType == '1'"> 
                <img src="\static\imgs\startPromoImg.png" v-if="startAllData.imageUrl == ''" class="startImgClass"/>
                <video v-else :src="startAllData.imageUrl" controls="controls" class="startImgClass" style="width:360px; height:640px;object-fit: fill">
                  您的浏览器不支持 video 标签。
                </video>
              </div>
              <input type="file" ref="imgUpload" v-show="0" @change="imgUpload" accept="image/*">
              <input type="file" ref="uploadMoive" v-show="0" @change="moiveUpload" accept="video/*,.mkv">
              <div class="startimgText">
                <span v-show="startAllData.imageType == '0'">点击图片上传推广图片</span>
                <span v-show="startAllData.imageType == '1'">点击图片上传推广动画</span>
              </div>
            </el-col>
            <el-col :span="15">
              <div class="rightdiv">
                <div class="rightSubdiv">
                  <el-checkbox v-model="startAllData.isOpen" @change="startDataChange">开启推广</el-checkbox>
                </div>
                <div class="rightSubdiv">
                  选择推广方式<br/>
                  <el-select v-model="startAllData.imageType" placeholder="请选择" size="small" @change="changeTypem">
                    <el-option
                      v-for="item in promoModeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="rightSubdiv" v-if="startAllData.imageType == 0" >
                  倒计时时间<br/>
                  <el-select v-model="startAllData.countDown" placeholder="请选择" size="small" @change="startDataChange">
                    <el-option
                      v-for="item in setTimeLong"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="startAllData.isShow" placeholder="请选择" size="small" @change="startDataChange">
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
                  <el-select v-model="startAllData.dataType" placeholder="请选择" size="small" @change="startDataChange">
                    <el-option
                      v-for="item in setpromoUrl"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="hr"/>
                  <span v-show="startAllData.dataType == 2">
                      <el-button type="primary" plain size="small" class="carou_sub_selectbtn" @click="selectcarou_btn">选择类别</el-button>
                      <div class="carou_subbottom_txt" v-if="startAllData.promoName != ''||startAllData.promoName != null">
                          <span class="carou_subbottom_span">已选择类别 : </span>{{startAllData.promoName}}
                      </div>
                      <div class="red_font" v-else>类别还未选择！</div>
                  </span>
                  <span v-show="startAllData.dataType == 1" v-if="modalShow">
                      <el-button type="primary" plain size="small" class="carou_sub_selectbtn" @click="selectonepro">选择单品</el-button>
                      <div class="carou_subbottom_txt" v-if="startAllData.headImage != null">
                          <img :src="[startAllData.headImage == null?'/static/imgs/syBg.png' : fileAddress+'/'+startAllData.headImage]" class="carou_subbottom_img"/>
                          {{startAllData.proName}}<br/>
                          <span class="carou_subbottom_span">{{startAllData.proNumber}}</span>
                      </div>
                      <div class="red_font" v-else>产品还未选择！</div>
                  </span>
                  <div v-show="startAllData.dataType == 0" class="carou_subbottom_txt">
                      <el-input v-model="startAllData.dataId" placeholder="请输入要跳转的网址" size="small" @blur="startDataChange"></el-input>
                  </div>
                </div>
              </div>

              
              <!-- 选择类别弹出框 -->
              <el-dialog
              title="选择推广类别"
              :visible.sync="selectpromo_dialog"
              width="950px">
                <el-checkbox-group v-model="checkList">
                  <div class="item" v-for="item in promoAllData" :key="item.id">
                    <div class="parent">
                      <el-checkbox :label="item.id" @change="changeItem(item)">{{item.categoryName}}</el-checkbox>
                    </div> 
                    <div class="child" v-show="item.categoryList.length > 0">
                        【 <el-checkbox class="childText" :label="child.id" v-for="child in item.categoryList" :key="child.id" @change="changeChild(child,item)">{{ child.categoryName }}</el-checkbox> 】
                    </div> 
                  </div>
                </el-checkbox-group>
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
                    <el-select v-model="value" placeholder="全部类别" size="small">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                      <el-input
                          placeholder="请输入内容"
                          v-model="selecone_search" size="small" class="proSearch">
                          <el-button slot="append" icon="el-icon-search" ></el-button>
                      </el-input>
                      <el-row :gutter="20" class="proImgDiv">
                          <el-col :span="8" v-for="item in productData" :key="item.id">
                              <div class="selectone_img_div" @click="selectedOnePro(item)">
                                  <div  :class="[proSelectId == item.id?'carou_subbottom_img_border':'carou_subbottom_img']">
                                    <img :src="[item.headImage != null?fileAddress+item.headImage:'/static/imgs/syBg.png']" />
                                    <div class="proImgNum">共{{item.imageCount}}张</div>
                                  </div>
                                                    
                                  {{item.productName}}<br/>
                                  <span class="carou_subbottom_span">{{item.productNumber}}</span>
                              </div>
                          </el-col>
                      </el-row>
                  </div>
                  <span slot="footer" class="dialog-footer">
                      <el-button @click="selectone_dialog = false" size="small">取 消</el-button>
                      <el-button type="primary" @click="changePro" size="small">确 定</el-button>
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
      promoModeList: [
        //选择推广方式
        {
          value: 0,
          label: "图片推广"
        },
        {
          value: 1,
          label: "动画推广"
        }
      ],

      setpromoUrl: [
        //设置推广路径
        {
          value: 2,
          label: "推广类别"
        },
        {
          value: 1,
          label: "单个产品"
        },
        {
          value: 0,
          label: "网址"
        }
      ],
      setTimeLong: [
        //倒计时时间
        {
          value: 2,
          label: "2秒"
        },
        {
          value: 3,
          label: "3秒"
        },
        {
          value: 4,
          label: "4秒"
        }
      ],
      setShow: [
        //显示
        {
          value: true,
          label: "显示"
        },
        {
          value: false,
          label: "不显示"
        }
      ],
      //产品分类
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      startAllData: [],
      selectpromo_dialog: false, //选择类别弹出框
      selectone_dialog: false, //选择单品弹出框
      promoAllData: [], // 全部推广类别
      catecheckedId: "", //选中推广类别的id
      catecheckedName: "", //选中推广类别的名称
      productData: [], //产品接口所有数据
      productAllData: [], //产品显示所有数据
      proSelectId: 0, //选择产品选中产品的id
      url_input: "", //跳转地址
      selecone_search: "", //选择单品搜索
      EventListenerTf: true, //产品分页已加监听，true为未加载监听，false为已加载监听
      loading: true, //页面加载中
      modalShow: true, //数据打散重新渲染
      checkList: [] //新增推广类别确认数组
    };
  },
  mounted() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      this.Axios.get("/promotion/generalizeAppstart")
        .then(data => {
          if (data.data.code == 0) {
            self.startAllData = data.data.data;
            if (self.startAllData.dataType == 1) {
              self.proSelectId = parseInt(self.startAllData.dataId);
              self.proData();
            }
            if (self.startAllData.dataType == 2) {
              self.startAllData.dataId = parseInt(self.startAllData.dataId);
              self.promoData();
            }
            self.loading = false;
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //所有产品列表数据
    proData() {
      var self = this;
      let params = {
        PRS: {
          page: 1,
          size: 15
        }
      };
      this.Axios.get("/product/product", params)
        .then(data => {
          if (data.data.code == 0) {
            self.productData = data.data.data.list;
            self.productAllData = data.data.data;
          }
        })
        .catch(err => {
          this.extCatch(err, this.proData);
        });

      self.proDisplayName();
    },

    //推广类别数组
    promoData() {
      var self = this;
      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.promoAllData = data.data.data;
            self.proDisplayName();
          }
        })
        .catch(err => {
          this.extCatch(err, this.promoData);
        });
    },

    //保存轮播图片中的产品和推广类别名字
    proDisplayName() {
      var self = this;
      if (self.startAllData.dataType == 1) {
        //产品名存保存
        let params = {
          PRS: {
            ids: self.startAllData.dataId
          }
        };
        this.Axios.get("/product/product/batch/base", params)
          .then(data => {
            if (data.data.code == 0) {
              self.startAllData.proName = data.data.data[0].productName;
              self.startAllData.proNumber = data.data.data[0].productNumber;
              self.startAllData.headImage = data.data.data[0].headImage;
              self.modalShow = false;
              self.modalShow = true;
            } else {
              this.$message({
                message: data.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.extCatch(err, this.proDisplayName);
          });
        // console.log(self.startAllData.proNumber);
      }
      if (self.startAllData.dataType == 2) {
        //推广类别名称保存
        var promoId = parseInt(self.startAllData.dataId);
        var promoName = "";
        for (var i = 0; i < self.promoAllData.length; i++) {
          if (promoId == self.promoAllData[i].id) {
            promoName = self.promoAllData[i].categoryName;
          }
          if (self.promoAllData[i].categoryList.length != 0) {
            for (var j = 0; j < self.promoAllData[i].categoryList.length; j++) {
              if (promoId == self.promoAllData[i].categoryList[j].id) {
                promoName = self.promoAllData[i].categoryList[j].categoryName;
              }
            }
          }
        }
        self.startAllData.promoName = promoName;
        self.modalShow = false;
        self.modalShow = true;
      }
      // console.log(self.startAllData);
    },
    //点击图片上传图片
    uploadImg() {
      this.$refs.imgUpload.click();
    },
    //点击图片上传图片
    uploadMoive() {
      this.$refs.uploadMoive.click();
    },
    //选择类别弹出框
    selectcarou_btn() {
      var self = this;
      //推广类别数据属性
      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.promoAllData = data.data.data;
            self.checkList = [self.startAllData.dataId]
            for (var i in self.promoAllData) {
              if (self.promoAllData[i].id == self.startAllData.dataId) {
                self.promoAllData[i].layer = 1; //如果是1级大类
                for (var j in self.promoAllData[i].categoryList) {
                  self.checkList.push(self.promoAllData[i].categoryList[j].id);
                }
              } else {
                self.promoAllData[i].layer = 2; //默认是2级小类
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.selectcarou_btn);
        });
      this.selectpromo_dialog = true;
    },
    //选择类别确认按钮
    selectedPromo() {
      var self = this;
      for (var i in self.promoAllData) {
        if (self.promoAllData[i].layer == 1) {
          for (var j in self.promoAllData[i].categoryList) {
            self.removeByValue(
              self.checkList,
              self.promoAllData[i].categoryList[j].id
            );
          }
        }
      }
      // console.log(self.checkList)
      self.startAllData.dataId = self.checkList[0];

      // self.startAllData.

      this.Axios.post("/promotion/generalizeAppstart", self.startAllData)
        .then(data => {
          if (data.data.code == 0) {
            self.startAllData = data.data.data;
            if (self.startAllData.dataType == 2) {
              self.startAllData.dataId = parseInt(self.startAllData.dataId);
            }
            self.proDisplayName();

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
          this.extCatch(err, this.selectedPromo);
        });

      this.selectpromo_dialog = false;
    },
    //选择单品弹出框
    selectonepro() {
      var self = this;
      self.proData();
      self.selectone_dialog = true;
      if (self.EventListenerTf) {
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
              }
            }
            self.EventListenerTf = false;
          });
        }, 100);
      }
    },
    //改变启动推广页的页面数据
    startDataChange() {
      var self = this;
      this.Axios.post("/promotion/generalizeAppstart", self.startAllData)
        .then(data => {
          if (data.data.code == 0) {
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
          this.extCatch(err, this.startDataChange);
        });
    },
    //改变推广方式
    changeTypem() {
      var self = this;
      // console.log(self.startAllData)
      //更换推广方式默认此图
      self.startAllData.imageUrl = "";
      self.startDataChange();
    },
    //图片文件上传
    imgUpload(e) {
      var self = this;
      self.loading = true;
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("type", 0);
      this.Axios.post(`${this.fileAddress}/image/upload`, formData).then(
        data => {
          if (data.data.code == 0) {
            self.startAllData.imageUrl = data.data.data[0].url;
            this.Axios.post("/promotion/generalizeAppstart", self.startAllData)
              .then(data => {
                if (data.data.code == 0) {
                  // console.log(data.data.data);
                  self.startAllData = data.data.data;
                  self.loading = false;
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
                this.extCatch(err, this.imgUpload);
              });
          }
        }
      );
    },
    //视频文件上传
    moiveUpload(e) {
      var self = this;
      self.loading = true;
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("id", self.startAllData.id);
      this.Axios.post("/promotion/generalizeAppstart/upload", formData).then(
        data => {
          if (data.data.code == 0) {
            this.created_fun();
          }
        }
      );
    },
    //选择更换点击产品
    selectedOnePro(elem) {
      var self = this;
      // console.log(elem);
      self.proSelectId = elem.id;
    },
    //选择产品确定按钮
    changePro() {
      var self = this;
      self.startAllData.dataId = self.proSelectId;
      this.Axios.post("/promotion/generalizeAppstart", self.startAllData)
        .then(data => {
          if (data.data.code == 0) {
            self.startAllData = data.data.data;
            if (self.startAllData.dataType == 1) {
              self.startAllData.dataId = parseInt(self.startAllData.dataId);
              self.proDisplayName();
              self.selectone_dialog = false;
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
          this.extCatch(err, this.changePro);
        });
    },
    //新增推广展示改变父类的多选框选择1级大类
    changeItem(elem) {
      var self = this;
      for (var p in elem.categoryList) {
        elem.categoryList[p].layer = 1;
      }
      elem.layer = 1;

      let idIndex = self.checkList.indexOf(elem.id);
      if (idIndex >= 0) {
        //选中数组已经有了数组
        self.checkList = [];
        self.checkList.push(elem.id);
        for (var i in elem.categoryList) {
          self.checkList.push(elem.categoryList[i].id);
        }
      } else {
        //选中数组已经没有了数组
        for (var i in elem.categoryList) {
          for (var j in self.checkList) {
            if (self.checkList[j] == elem.categoryList[i].id) {
              self.removeByValue(self.checkList, self.checkList[j]);
            }
          }
        }
      }
      self.checkList = self.removeListRepeat(self.checkList); //数组去重
    },
    //推广类别选择2级小类
    changeChild(elem, item) {
      var self = this;
      // console.log(elem)
      // console.log(item)
      self.checkList = [];
      if ((elem.layer = 1)) {
        for (var p in item.categoryList) {
          item.categoryList[p].layer = 2;
          self.removeByValue(self.checkList, item.categoryList[p].id);
        }
        self.checkList.push(elem.id);
      }
      item.layer = 2;

      let idIndex = self.checkList.indexOf(elem.id);
      if (idIndex >= 0) {
        //选中数组已经有了数组
        for (var i in self.promoAllData) {
          if (self.promoAllData[i].categoryList.length != 0) {
            for (var j in self.promoAllData[i].categoryList) {
              if (self.promoAllData[i].categoryList[j].id == elem.id) {
                for (
                  var k = 0;
                  k < self.promoAllData[i].categoryList.length;
                  k++
                ) {
                  self.removeByValue(
                    self.checkList,
                    self.promoAllData[i].categoryList[k].id
                  );
                }
                self.removeByValue(self.checkList, self.promoAllData[i].id);
                self.checkList.push(elem.id);
              }
            }
          }
        }
      } else {
        //当多选数组没有此数组编号
        // console.log(self.checkList);
      }
    },
    //删除子元素
    removeByValue(arr, val) {
      for (var i in arr) {
        if (arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    },
    //新增推广展示去重
    removeListRepeat(arr) {
      var res = [];
      var json = {};
      for (var i in arr) {
        if (!json[arr[i]]) {
          res.push(arr[i]);
          json[arr[i]] = 1;
        }
      }
      return res;
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
    .leftcol
      min-width 370px
    .startimg
      cursor pointer
      width 360px
      height 640px
      background-color $font-color
      img
        width 100%
        border-radius 5px
    .startimgText
      margin-top 24px
      text-align center
      width 360px
      color #a8a8a8
    .rightdiv
      line-height 50px
      color $font-color
      .rightSubdiv
        line-height 30px
        margin-bottom 30px
        font-size 14px
      .carou_sub_selectbtn
        float right
    .selectone_img_div
      margin 10px 0 10px 0
    .carou_subbottom_img_border
      width 100px
      height 75px
      float left
      margin-right 10px
      border 1px solid red
      border-radius 5px
      cursor pointer
      position relative
      border-radius 5px
      img
        height 75px
        border-radius 5px
    .carou_subbottom_img
      width 102px
      height 77px
      float left
      margin-right 10px
      border-radius 5px
      cursor pointer
      position relative
      border-radius 5px
      img
        height 78px
        border-radius 5px
    .proImgNum
      position absolute
      top 64px
      right -1px
      margin-top -11px
      background-color #999
      opacity 0.8
      color #ffffff
      font-size 14px
      padding 0 5px
      border-bottom-right-radius 5px
  .item
    width 100%
    margin-bottom 30px
    display flex
    align-items top
    color #000
    font-size 14px
    .child .el-radio
      color #999
    .text
      white-space nowrap
  .proImgDiv
    max-height 430px
    overflow-y auto
    overflow-x hidden
    .loading
      text-align center
      padding 20px
  .startImgClass
    width 360px
    height 640px
    object-fit fill
  .proSearch
    margin-bottom 5px
    width 315px
</style>