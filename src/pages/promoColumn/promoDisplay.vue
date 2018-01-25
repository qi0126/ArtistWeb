<template>
  <div class="carouselBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
    <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
            <el-breadcrumb-item>推广项目</el-breadcrumb-item>
            <el-breadcrumb-item>推广展示</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-row>
            <el-container>
                <el-aside width="320px">
                    <div>
                        <span class="redfont">推广展示顺序</span>
                    </div>
                    <div class="leftMenu">
                        <div class="leftBtn">
                            <el-button plain class="baibtn" @click="addpromo" size="small"><i class="iconfont">&#xe67f;</i>  新增推广展示</el-button>
                        </div>
                        <el-menu
                        class="el-menu-vertical-demo" size="small">
                            <el-menu-item v-for="menu in menu_data" :key="menu.id" :index="menu.categoryName">
                                <div @mouseover="menu_over(menu)" @click="menuClick(menu)">
                                    <span slot="title">{{menu.categoryName}}</span>
                                    <i v-show="overId == menu.id" class="el-icon-delete delIcon" @click="del_promomenu(menu)"/>
                                </div>
                            </el-menu-item>
                        </el-menu>
                    </div>
                </el-aside>
                <el-main v-loading="loading">
                    <div>
                        <span class="redfont">展示设置</span>
                    </div>
                    <div class="right_bigdiv">
                        <div>
                            <el-row>
                                <el-col :span="8">
                                    展示方式:
                                    <el-select v-model="dispmode_value" placeholder="请选择" size="small" @change="changeMode">
                                        <el-option
                                        v-for="item in dispmode_data"
                                        :key="item.label"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="12" v-if="dispmode_value == 1">
                                    展示数量
                                    <el-select v-model="dispmode_num" ref="modenum_select" placeholder="请选择" @change="num_select" size="small">
                                        <el-option
                                        v-for="item in dispmode_num_data"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value" size="small">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row><br/>
                            <div ref="title_disp" v-show="dispmode_value == 0">
                                <img :src="[dispmode_imgUrl == null?'/static/imgs/promo_img.png':fileAddress+dispmode_imgUrl]" @click="title_upload" class="upload_f"/>
                                <input type="file" ref="title_upload" @change="title_uploaded"  accept="image/*" v-show="0"/>
                                <br/>
                                <div align="center" class="upload_f">点击上传封面图片，图片比例为2:1</div>
                            </div>
                            <div ref="pro_disp" v-show="dispmode_value == 1">
                                <el-row :gutter="20">
                                    <el-col :span="6" v-for="item in promoSelectedData" :key="item.id">
                                        <div class="pro_display">
                                            {{item.productId}}
                                            <img :src="[item.headImage == null?'/static/imgs/syBg.png' : fileAddress+item.headImage]" class="proimg"/><br/>
                                            <p>{{item.productName}}</p>
                                            <p class="huifont">{{item.productNumber}}</p>
                                            <p><el-button size="small" class="baibtn" @click="proChange(item)">更换产品</el-button></p>
                                        </div>
                                    </el-col>
                               
                                </el-row>
                                <el-dialog
                                title="更换产品"
                                :visible.sync="proChangeVisible"
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
                                    <el-input placeholder="请输入产品名字、编码、产品类别名称" v-model="proSearch" class="proSearch" size="small">
                                      <el-button slot="append" icon="el-icon-search"></el-button>
                                    </el-input>
                                  </div>
                                    <div ref="proDiv" class="proDiv">
                                        <el-row>
                                            <el-col :span="8" v-for="item in productData" :key="item.id">
                                                <div class="pro_img_div" @click="proSelect(item)">
                                                    <!-- <img :src="fileAddress+item.headImage" :class="[selectedImgId === item.id?'pro_img_list_Border':'pro_img_list']"/> -->
                                                    <div  :class="[selectedImgId === item.id?'pro_img_list_Border':'pro_img_list']">
                                                      <img :src="[item.headImage != null?fileAddress+item.headImage:'/static/imgs/syBg.png']" />
                                                      <div class="proImgNum">共{{item.imageCount}}张</div>
                                                    </div>
                                                    <div class="pro_img_txt">
                                                        {{item.productName}}<br/>
                                                        {{item.productNumber}}
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="proChangeVisible = false" size="small">取 消</el-button>
                                        <el-button type="primary" @click="proChange_fun" size="small">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </div>
                        </div>
                    </div>


                </el-main>
                <el-dialog
                title="新增推广展示"
                :visible.sync="addpromo_dialog"
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
                    <br/><br/>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addpromo_dialog = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="addPromoListFun" size="small">确 定</el-button>
                    </span>
                </el-dialog>
            </el-container>
            
            <el-col :span="18">
            </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: [], //新增推广类别确认数组
      checkListDisp: [], //显示"禁用"数组
      menu_data: [], //推广类主菜单
      overId: "",
      addpromo_dialog: false, //新增推广类别弹出框
      promoAllData: [], // 全部推广类别
      promoSelectId: [], //选择推广类别ID
      promoId: "",
      promoSelectedData: [], //选择推广类别的数据
      dispmode_data: [
        {
          //推广类别接口数据
          value: 0,
          label: "封面展示"
        },
        {
          value: 1,
          label: "产品展示"
        }
      ],
      dispmode_value: 1, //推广类别选中方式
      dispmode_imgUrl: "", //推广类别选中封面展示
      dispmode_num_data: [
        {
          //推广类别接口数据
          value: "2",
          label: "2"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "6",
          label: "6"
        },
        {
          value: "8",
          label: "8"
        }
      ],
      dispmode_num: "4", //推广类别选中方式

      proChangeVisible: false, //更换产品弹出框
      uploadTF: false, //显示推广产品数据下拉框显示
      productData: [], //产品显示产品数据
      productAllData: [], //产品显示所有数据
      productNum: 1, //产品显示分页第几页，默认为1
      productSize: 15, //产品显示一页显示几条，默认为15
      proSearch: "", //更换产品搜索数据
      selectedProId: 0, //产品选中的产品id
      selectedImgId: 0, //产品选中产品图片id
      selectedProImgId: 0, //产品选中图片的id
      selectedMenuElem: {}, //推广展示选中菜单数据
      loading: false //网页加载中
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.checkListDisp = [];
      self.checkList = [];
      this.Axios.get("/promotion/promotionShow")
        .then(data => {
          if (data.data.code == 0) {
            this.menu_data = data.data.data;
            // console.log(self.menu_data);
            //已加推广展示在新增推广展示默认打勾勾

            // for (var i in self.menu_data) {
            // self.checkListDisp.push(self.menu_data[i].categoryId);
            // self.checkList.push(self.menu_data[i].categoryId);
            // }
            // console.log(self.checkList)

            //如果有数据则显示第一个推广显示第一条数据
            if (data.data.data.length != 0) {
              this.menuClick(data.data.data[0]);
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //推广展示类别鼠标移入
    menu_over(elem) {
      var self = this;
      self.overId = elem.id;
    },
    //更改展示方式
    changeMode() {
      var self = this;
      // console.log(self.dispmode_value);
      // console.log(self.promoSelectId);
      let params = {
        id: self.promoSelectId,
        type: self.dispmode_value
      };
      this.Axios.put("/promotion/promotionShow/type", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);

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
          this.extCatch(err, this.changeMode);
        });
    },
    //展示选择展示内容
    menuClick(elem) {
      var self = this;
      self.selectedMenuElem = elem;
      self.dispmode_value = elem.type;
      self.promoId = elem.id;
      self.dispmode_num = elem.showNum;
      self.dispmode_imgUrl = elem.coverImageUrl;
      //推广方式为封面显示则显示封面
      if (elem.type == 1) {
        self.loading = false;
      }
      let params = {
        PRS: {
          id: elem.id
        }
      };
      this.Axios.get("/promotion/promotionShow/" + elem.id, params)
        .then(data => {
          if (data.data.code == 0) {
            self.promoSelectId = elem.id;

            var templist = [];
            if (data.data.data.showProductNumList.length != 0) {
              for (
                var i = 0;
                i < data.data.data.showProductNumList.length;
                i++
              ) {
                var proImgTemp = {};
                proImgTemp.proId = data.data.data.showProductNumList[i].id;
                proImgTemp.productId =
                  data.data.data.showProductNumList[i].productId;
                templist.push(proImgTemp);
              }
              self.proIdList_fun(templist);
            } else {
              self.promoSelectedData = [];
            }
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.menuClick);
        });
    },
    //产品id数组查询产品资料数组
    proIdList_fun(elem) {
      var self = this;
      var tempElem = [];
      var tempObj = {};

      for (var i in elem) {
        tempElem.push(elem[i].productId);
        tempObj[elem[i].productId] = elem[i].proId;
      }
      if (tempElem.length == 0) {
        return false;
      }
      let params = {
        PRS: {
          ids: tempElem
        }
      };
      this.Axios.get("/product/product/batch/base", params)
        .then(data => {
          if (data.data.code == 0) {
            self.loading = false;
            self.promoSelectedData = data.data.data;
            for (var j in self.promoSelectedData) {
              self.promoSelectedData[j].proImgId =
                tempObj[self.promoSelectedData[j].id];
            }
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.proIdList_fun);
        });
    },
    //点击推广类虽菜单删除
    del_promomenu(elem) {
      // console.log(id);
      var self = this;
      this.$confirm(`确认删除“` + elem.categoryName + `”？`).then(_ => {
        let params = {
          PRS: {
            id: elem.id
          }
        };
        this.Axios.delete("/promotion/promotionShow/" + elem.id, params)
          .then(data => {
            if (data.data.code == 0) {
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
          })
          .catch(err => {
            this.extCatch(err, this.del_promomenu);
          });
      });
    },
    //添加新的推广展示弹出框
    addpromo() {
      var self = this;

      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.promoAllData = data.data.data;
            //推广类别数组添加一个字段是否一级选择
            for (var i in self.promoAllData) {
              self.promoAllData[i].layer = 2; //默认是2级小类
              // console.log(self.promoAllData[i]);
              
              // for (var k in self.checkListDisp) {
              //   // console.log(self.checkList[k]);
              //   if (self.checkListDisp[k] == self.promoAllData[i].id) {
              //     self.promoAllData[i].disabledT = true;
              //   }
              // }
              // if (self.promoAllData[i].categoryList.length != 0) {
              //   for (var u in self.promoAllData[i].categoryList) {
              //     for (var k in self.checkListDisp) {
              //       if (
              //         self.checkListDisp[k] ==
              //         self.promoAllData[i].categoryList[u].id
              //       ) {
              //         self.promoAllData[i].categoryList[u].disabledT = true;
              //       }
              //     }
              //   }
              // }
            }
            // console.log(self.checkList);
            // console.log(self.promoAllData);
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
      self.addpromo_dialog = true;
    },
    //添加新推广确认事件
    addPromoListFun() {
      var self = this;
      // console.log(self.promoAllData);
      //选择一级的情况下，过滤掉二级分类的id
      for(var i in self.promoAllData){
        if(self.promoAllData[i].layer == 1){
          for(var j in self.promoAllData[i].categoryList){
            self.removeByValue(self.checkList,self.promoAllData[i].categoryList[j].id)
          }
        }
      }
      // console.log(self.checkList)

      let params = {
        categoryIds: self.checkList
      };

      this.Axios.post("/promotion/promotionShow", params)
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
          self.addpromo_dialog = false;
        })
        .catch(err => {
          this.extCatch(err, this.addPromoListFun);
        });
      self.checkList = [];
      self.promoSelectId = "";
    },
    
    //新增推广展示改变父类的多选框选择1级大类
    changeItem(elem) {
      var self = this;
      for (var p in elem.categoryList) {
        elem.categoryList[p].layer = 1;
      }
      elem.layer = 1;
      // console.log(elem)
      let idIndex = self.checkList.indexOf(elem.id);
      if (idIndex >= 0) {
        //选中数组已经有了数组
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
      if (elem.layer = 1) {
        for (var p in item.categoryList) {
          item.categoryList[p].layer = 2;
          self.removeByValue(self.checkList,item.categoryList[p].id)
        }
        self.checkList.push(elem.id)
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
    },
    //封面展示点击图片文件上传
    title_upload() {
      var self = this;
      self.$refs.title_upload.click();
    },
    //封面展示点击文件上传后
    title_uploaded(e) {
      var self = this;
      self.loading = true;
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("type", 0);
      this.Axios.post(`${this.fileAddress}/image/upload`, formData).then(
        data => {
          if (data.data.code == 0) {
            let params_two = {
              id: self.promoSelectId,
              coverImageUrl: data.data.data[0].url
            };

            this.Axios.put("/promotion/promotionShow/image", params_two)
              .then(data => {
                if (data.data.code == 0) {
                  // console.log(data.data.data);
                  self.loading = false;
                  this.$message({
                    message: data.data.msg,
                    type: "success"
                  });
                  self.created_fun();
                  self.menuClick(data.data.data);
                } else {
                  this.$message({
                    message: data.data.msg,
                    type: "warning"
                  });
                }
              })
              .catch(err => {
                this.extCatch(err, this.title_uploaded);
              });
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        }
      );
    },
    //修改产品推广数量
    num_select() {
      var self = this;
      var proNum = parseInt(self.dispmode_num);
      let params = {
        id: self.selectedMenuElem.id,
        showNum: proNum
      };

      this.Axios.put("/promotion/promotionShow/num", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            self.created_fun();
            self.menuClick(data.data.data);
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.num_select);
        });
    },
    //推广展示更换产品弹出框
    proChange(elem) {
      var self = this;
      self.selectedProId = elem.id;
      self.selectedImgId = elem.proImgId;
      self.selectedProImgId = elem.proImgId;

      self.proDisplay();
      self.proChangeVisible = true;
    },
    //推广展示更换产品事件
    proChange_fun() {
      var self = this;
      let params = {
        id: self.selectedProImgId,
        productId: self.selectedImgId
      };

      this.Axios.put("/promotion/promotionShow/product", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            //更换产品显示新产品图片
            self.menuClick(self.selectedMenuElem);
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.proChange_fun);
        });

      self.proChangeVisible = false;
    },
    //产品分页显示
    proDisplay(num, size) {
      var self = this;
      let params = {
        PRS: {
          id: self.promoId
        }
      };
      this.Axios.get("/promotion/promotionShow/product/" + self.promoId, params)
        .then(data => {
          if (data.data.code == 0) {
            if (data.data.data.length == 0) {
              alert("此产品没有可更换的产品！");
            }
            var tempElem = [];
            for (var i = 0; i < data.data.data.length; i++) {
              tempElem.push(data.data.data[i].productId);
            }
            if (tempElem.length == 0) {
              return false;
            }
            let params = {
              PRS: {
                ids: tempElem
              }
            };

            this.Axios.get("/product/product/batch/base", params)
              .then(data => {
                if (data.data.code == 0) {
                  self.productData = data.data.data;
                  self.loading = false;
                } else {
                  this.$message({
                    message: data.data.msg,
                    type: "warning"
                  });
                }
              })
              .catch(err => {
                this.extCatch(err, this.proIdList_fun);
              });
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.proDisplay);
        });
    },
    //产品选择
    proSelect(elem) {
      var self = this;
      self.selectedImgId = elem.id;
      // console.log(self.selectedImgId);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
$border-color = #d9d9d9
.carouselBigDiv
  .title
    border-bottom 1px solid $border-color
    padding-bottom 10px
    margin-bottom 15px
  .hr
    border-top 1px solid $border-color
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
  .huifont
    color #999
  .baibtn
    width 94%
    margin 10px 10px auto
  .el-collapse-item__content
    padding-bottom 0
  .upload_f
    width 900px
    height 478px
    cursor pointer
    font-size 14px
  .leftMenu
    border 1px solid $border-color
    margin-top 15px
    height 769px
    border-radius 5px
    .delIcon
      float right
      color $base-color
      line-height 56px
    .leftBtn
      padding 15px
      border-bottom 1px solid $border-color
    li
      border-bottom 1px solid $border-color
  .left_bigdiv
    margin 10px
    border 1px solid $border-color
    text-align center
    font-size 12px
    .el-menu-vertical-demo
      text-align left
  main
    padding 0px 0px 0px 20px
    .right_bigdiv
      padding 20px
      margin-top 15px
      border 1px solid $border-color
      height 832px
      line-height 26px
      border-radius 5px
      .proDiv
        height 400px
        overflow-x hidden
      .el-menu
        border-right 0
      img
        border 0
        max-width 960px
        width 100%
        border-radius 5px
      .pro_display
        border 1px solid $border-color
        box-shadow 2px 2px 8px $border-color
        text-align center
        border-radius 5px
        padding 10px
        margin-top 20px
        p
          text-align left
        .proimg
          width 100%
      .pro_img_div
        width 100%
        line-height 26px
        margin-top 16px
        .pro_img_list
          width 100px
          height 80px
          float left
          cursor pointer
          position relative
          border-radius 5px
          img
            height 78px
            border-radius 5px
        .pro_img_list_Border
          width 98px
          height 78px
          float left
          cursor pointer
          position relative
          border 1px solid $base-color
          border-radius 5px
          img
            height 78px
            border-radius 5px
        .proImgNum
          position absolute
          top 63px
          right 0
          margin-top -11px
          background-color #999
          opacity 0.8
          color #ffffff
          font-size 12px
          padding 0 5px
          border-bottom-right-radius 5px
        .pro_img_txt
          width 190px
          float left
          margin-left 10px
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
  .proSearch
    margin-bottom 5px
    width 315px
</style>
      