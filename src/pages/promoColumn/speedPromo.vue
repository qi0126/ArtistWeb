<template>
    <div class="carouselBigDiv">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
        <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
        <el-breadcrumb-item>推广栏目</el-breadcrumb-item>
        <el-breadcrumb-item>快捷推广</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <div class="topMenu">
          <div class="topLeftMenu">
            <span class="redfont">快捷推广</span>
          </div>
          <div class="top_righttxt">
            <el-checkbox v-model="open_tf" size="small" @change="openTF">开启</el-checkbox>
            快速推广数量：
            <el-select v-model="value" placeholder="请选择" size="small" @change="numberChange" style="width:100px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-dialog
            title="设置推广类别"
            :visible.sync="speedPromo_dialog"
            width="950px" align="left">
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
            <br/><br/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="speedPromo_dialog = false" size="small">取 消</el-button>
              <el-button type="primary" @click="setPromo" size="small">确 定</el-button>
            </span>
            </el-dialog>
          </div>
        </div>
        <div class="imgDisplay">
          <el-row>
            <div v-for="item in speedpromoData" :key="item.id" class="speedpromo_elcol">
              <div class="speedpromo_bigdiv">
                  <div class="speed_div">
                    <span>
                      推广名称
                    </span>
                    <el-input v-model="item.name" placeholder="请输入内容" class="speedpromo_txt" size="small" @change="nameChange(item)" :maxlength="6" algin="center"></el-input>
                    <p @click="imgsetDialog(item)">
                      <img v-bind:src="fileAddress+item.imageUrl" class="image">
                    </p>
                    <p>{{item.categoryName}}</p>
                    <p><el-button size="small" @click="speedPromoOpen(item)" style="width:100%">设置推广类别</el-button></p>
                  </div>
              </div>
            </div>
          </el-row>
          <el-dialog
            title="设置图标"
            :visible.sync="imgset_dialog"
            width="950px">
            <div class="displayDiv" v-loading.fullscreen.lock="imgLoading">
              <el-row>
                <el-col :span="6" style="padding:10px">
                  <input type="file" ref="uploadimg_file" style="display:none" @change="upload_file" accept="image/*"/>
                  <div class="upload_bigdiv" @click="upload">
                    <div class="add_text"><i class="iconfont">&#xe67f;</i></div>
                    <p>上传图片</p>
                    <p>尺寸比例为1：1</p>
                  </div>
                </el-col>
                <el-col :span="6" v-for="item in existData" :key="item.imageUrl" style="padding:10px">
                  <div class="img_bigdiv" @click="imgclick(item)" @mouseover="img_over(item)">
                    <div :class="item.imgTF == 1?'img_div redBorder':'img_div'" v-bind:style="{'background-image':'url('+fileAddress+item.img.imageUrl+')'}">
                      <div class="delImgDiv" v-show="imgOverId == item.img && item.isSave != 1" @click="delImgId(item)">
                        <img src="/static/imgs/del_icon.png" class="ImgPng"/>
                      </div>
                      <div class="selectImgDiv" v-show="item.isSave == 1">
                        <img src="/static/imgs/selected_icon.png" class="ImgPng"/>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="imgset_dialog = false" size="small">取 消</el-button>
              <el-button type="primary" @click="imgsetDialogChange" size="small">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
</template>

<script>
import utils from "@/commons/Batar/utils";
export default {
  data() {
    return {
      checkList: [], //新增推广类别确认数组
      speedpromoData: [], //快捷推广数据列表
      speedpromoImgData: [], //快捷推广数据图片数据
      open_tf: true, //快捷推广的开启
      options: [
        //推广类别数量
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
        {
          value: "6",
          label: "6"
        },
        {
          value: "7",
          label: "7"
        },
        {
          value: "8",
          label: "8"
        }
      ],
      value: "",
      speedPromoImgList: [], //快捷推广图片库数据
      speedPromo_dialog: false, //“设置推广类别”弹出框
      speedPromoSelectData: "", //“设置推广类别”弹出框的ID
      promoAllData: [], //系统推广类别属性
      imgset_dialog: false, //设置图标弹出框
      imgsetSelectData: [], //设置图标弹出框选中数据
      img_checked: "", //现在默认图标
      existData: [], //设置图标弹出框新的数组
      imgOverId: "", //鼠标移动到的img的id
      imgLoading: false //图片上传加载中
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      //快捷推广数据对接
      this.Axios.get("/promotion/promotion/list")
        .then(data => {
          if (data.data.code == 0) {
            self.value = data.data.data.length;
            self.speedpromoData = data.data.data;
            // console.log(self.speedpromoData)
            self.open_tf = data.data.data[0].isOpen;
            self.speedpromoImgData = [];
            for (var i = 0; i < data.data.data.length; i++) {
              self.speedpromoImgData.push(data.data.data[i].imageUrl);
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //快捷推广开启和关闭
    openTF() {
      var self = this;
      let params = {
        isOpen: self.open_tf
      };
      this.Axios.put("/promotion/promotion/setOpen", params)
        .then(data => {
          if (data.data.code == 0) {
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.openTF);
        });
    },
    //改变快捷推广类别的数量
    numberChange() {
      var self = this;
      let params = {
        PRS: {
          index: self.value
        }
      };
      this.Axios.get("/promotion/promotion", params)
        .then(data => {
          if (data.data.code == 0) {
            self.speedpromoData = data.data.data;
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
          this.extCatch(err, this.numberChange);
        });
    },
    //更换名称
    nameChange(elem) {
      var self = this;
      if (elem.name.length > 6) {
        this.$message({
          message: "推广名称字数不能大于6！",
          type: "warning"
        });
        elem.name = elem.name.substring(0, 6);
        return false;
      }
      let params = {
        id: elem.id,
        name: elem.name
      };
      this.Axios.put("/promotion/promotion", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: "推广名称修改成功！",
              type: "success"
            });
            self.created_fun();
            self.speedPromo_dialog = false;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.nameChange);
        });
    },
    //更换图片弹出框
    imgsetDialog(elem) {
      var self = this;
      this.Axios.get("/promotion/promotion/imagelist")
        .then(data => {
          if (data.data.code == 0) {
            self.speedPromoImgList = data.data.data;
            self.existData = [];
            for (var j = 0; j < self.speedPromoImgList.length; j++) {
              // console.log(self.speedPromoImgList[j])
              var subData = {};
              subData.imgTF = 0; //0为不是当前推广图片
              subData.img = self.speedPromoImgList[j];
              for (var i = 0; i < self.speedpromoImgData.length; i++) {
                // console.log(self.speedpromoImgData[i])
                // console.log(self.speedPromoImgList[j])
                if (
                  self.speedPromoImgList[j].imageUrl !=
                  self.speedpromoImgData[i]
                ) {
                  subData.isSave = 0; //没有设置推广的图片为0
                } else {
                  subData.isSave = 1; //已经设置推广的图片为1
                  if (elem.imageUrl == self.speedPromoImgList[j].imageUrl) {
                    subData.imgTF = 1; //当前推广图片为1加红色框框
                    break;
                  }
                  break;
                }
              }
              self.existData.push(subData);
            }
            console.log(self.existData);
          }
          self.imgsetSelectData = elem;
          self.imgset_dialog = true;
        })
        .catch(err => {
          this.extCatch(err, this.imgsetDialog);
        });
    },
    //推广图片鼠标点击图片更换（备：还没保存）
    imgclick(elem) {
      var self = this;
      for (var i = 0; i < self.existData.length; i++) {
        if (self.existData[i].img == elem.img) {
          self.existData[i].imgTF = 1;
        } else {
          self.existData[i].imgTF = 0;
        }
      }
    },
    //更换图片弹出框确认
    imgsetDialogChange() {
      var self = this;
      for (var i = 0; i < self.existData.length; i++) {
        if (self.existData[i].imgTF == 1) {
          let params = {
            id: self.imgsetSelectData.id,
            imageUrl: self.existData[i].img.imageUrl
          };
          this.Axios.put("/promotion/promotion/image", params)
            .then(data => {
              if (data.data.code == 0) {
                this.$message({
                  message: data.data.msg,
                  type: "success"
                });
                self.created_fun();
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(err => {
              this.extCatch(err, this.imgsetDialogChange);
            });
        }
      }
      self.imgset_dialog = false;
    },
    //设置推广类别弹框
    speedPromoOpen(elem) {
      var self = this;
      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.promoAllData = data.data.data;

            self.checkList = [elem.categoryId];
            for (var i in self.promoAllData) {
              if(elem.categoryId == self.promoAllData[i].id){
                self.promoAllData[i].layer = 1; //如果是1级大类
                for(var j in self.promoAllData[i].categoryList){
                  self.checkList.push(self.promoAllData[i].categoryList[j].id)
                }
              }else{
                self.promoAllData[i].layer = 2; //默认是2级小类
              }
            }

          }
        })
        .catch(err => {
          this.extCatch(err, this.speedPromoOpen);
        });
      this.speedPromo_dialog = true;
      self.speedPromoSelectData = elem;
    },
    //设置推广类别
    setPromo() {
      var self = this;

      //选择一级的情况下，过滤掉二级分类的id
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
      let params = {
        id: self.speedPromoSelectData.id,
        name: self.speedPromoSelectData.name,
        categoryId: self.checkList[0]
      };
      this.Axios.put("/promotion/promotion", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            self.created_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
          self.speedPromo_dialog = false;
        })
        .catch(err => {
          this.extCatch(err, this.setPromo);
        });
    },
    //产品图片编辑与鼠标移进
    img_over(elem) {
      var self = this;
      self.imgOverId = elem.img;
    },
    //点击图片上传
    upload() {
      this.$refs.uploadimg_file.click();
    },
    //图片上传改变
    upload_file(e) {
      var self = this;
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("type", 0);

      this.Axios.post(`${this.fileAddress}/image/upload`, formData)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data[0].url);
            let params = {
              id: self.imgsetSelectData.id,
              imageUrl: data.data.data[0].url
            };
            this.Axios.put("/promotion/promotion/image", params)
              .then(data => {
                if (data.data.code == 0) {
                  this.$message({
                    message: data.data.msg,
                    type: "success"
                  });
                  this.created_fun();
                  self.imgLoading = false;
                  self.imgset_dialog = false;
                } else {
                  this.$message({
                    message: data.data.msg,
                    type: "warning"
                  });
                }
              })
              .catch(err => {
                this.extCatch(err, this.upload_file);
              });
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.upload_file);
        });
    },
    //删除图片
    delImgId(elem) {
      var self = this;
      let params = {
        PRS: {
          imageUrl: elem.img.id
        }
      };
      this.Axios.delete("/promotion/promotion/image/" + elem.img.id, params)
        .then(data => {
          if (data.data.code == 0) {
            for (var i = 0; i < self.existData.length; i++) {
              //图片数据直接删除图片，不跟接口返回值
              if (self.existData[i].img == elem.img) {
                self.existData.splice(i, 1);
                break;
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
          this.extCatch(err, this.delImgId);
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
  .topMenu
    height 45px
    .topLeftMenu
      width 35%
      float left
    .top_righttxt
      width 40%
      float right
      text-align right
  .imgDisplay
    border 1px solid #eee
    margin-top 0px
    border-radius 3px
    min-height 720px
  .displayDiv
    max-height 600px
    overflow-x hidden
    .upload_bigdiv
      width 160px
      height 157px
      border 1px dashed $base-color
      text-align center
      border-radius 3px
      line-height 40px
      font-size 20px
      padding 20px
      color $base-color
      cursor pointer
      .add_text
        margin-top 20px
        .iconfont
          font-size 30px
  .speedpromo_elcol
    padding 12px
    float left
    width 300px
    height 350px
    .speedpromo_bigdiv
      width 100%
      line-height 30px
      text-align center
      box-shadow 2px 2px 8px #d8d8d8
      border 1px solid #f2f2f2
      border-radius 5px
      font-size 16px
      color #333
      .speedpromo_checkbox
        float left
        margin-left 8px
      .speed_div
        padding 16px 30px
        font-size 14px
        span
          color $font-color
        .speedpromo_txt
          width 169px
          padding-bottom 10px
          text-align center
          margin-left 10px
        .image
          width 240px
          height 240px
          cursor pointer
    .sub_text
      color #999
  .img_bigdiv
    width 200px
    height 200px
    border-radius 3px
    .ImgPng
      width 18px
      height 18px
    img
      width 200px
      height 200px
      border-radius 3px
      cursor pointer
    .img_div
      border 3px solid #eeeeee
      border-radius 3px
      position absolute
      width 200px
      height 200px
      cursor pointer
      position absolute
      background-size 200px 200px
    .redBorder
      border 2px solid $base-color
    .delImgDiv
      width 20px
      height 20px
      background-color #ffffff
      color $base-color
      text-align center
      float right
      border-bottom-left-radius 5px
      i
        font-size 10px
    .selectImgDiv
      width 20px
      height 20px
      background-color #ffffff
      color $base-color
      text-align center
      float left
      border-bottom-right-radius 5px
      i
        font-size 10px
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
</style>