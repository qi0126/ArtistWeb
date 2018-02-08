<template>
    <div class="carouselBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
            <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
            <el-breadcrumb-item>推广栏目</el-breadcrumb-item>
            <el-breadcrumb-item>文字推广</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="addmenu">
            <el-button type="primary" size="small" @click="add_textpromo">新增文字推广</el-button>
            <span class="checkoutDisplay">
              <el-checkbox v-model="open_tf" @change="opentf">开启</el-checkbox>
            </span>
            <span class="textDisplay">
              提示：文字推广最少要设置6条，显示名称为2~6字！
            </span>
        </div>
        <div>
            <el-table
            :data="textData"
            border
            stripe
            class="el-table">
                <el-table-column
                align="center"
                header-align="center"
                type="index"
                label="序号">
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                prop="date"
                label="显示文字">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.showText" placeholder="请输入内容" size="small" @blur="savedata(scope)" :maxlength=6></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                prop="date"
                label="推广类别">
                  <template slot-scope="scope">
                    <el-button class="bai_btn" plain size="small" @click="selectcate(scope)">
                      已选择类别：
                      <span v-if='scope.row.categoryId' class="red_font">{{scope.row.categoryName}}</span>
                      <span v-else>未选择</span>
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                prop="name"
                label="是否显示">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.isShow" @change="savedata(scope)">
                    <el-radio label='1' :disabled="scope.row.showDisabled">是</el-radio>
                    <el-radio label='0'>否</el-radio>
                  </el-radio-group>
                </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" plain size="small" @click="deltext(scope)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="PageNum"
              background
              :page-sizes="[15, 30, 50, 100]"
              :page-size="15"
              layout="total, sizes, prev, pager, next, jumper"
              :total="textAllData.total"
              class="fengPage">
            </el-pagination>
            <el-dialog
                title="设置推广类别"
                :visible.sync="modify_promo_dialog"
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
                <el-button @click="modify_promo_dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="modicate" size="small">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: [], //新增推广类别确认数组
      open_tf: false, //开启变量
      textData: [], //文字推广数据显示
      textAllData: {}, //文字推广全部数据显示
      modify_promo_dialog: false, //设置推广类别弹出框
      promoAllData: [], // 全部推广类别
      selectcate_data: {}, //选中文字的数组数据
      categoryData: [],
      PageNum: 1, //分页默认第1页
      PageSize: 15 //分页每页显示几条记录
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      //推广类别数据属性
      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.categoryData = data.data.data;
            self.promoAllData = data.data.data;
            self.textDataDisplay(self.PageNum, self.PageSize);
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //文字推广数据显示
    textDataDisplay(pageNum, pageSize) {
      var self = this;
      //文字推广内容渲染
      let params = {
        PRS: {
          page: pageNum,
          size: pageSize
        }
      };
      this.Axios.get("/promotion/generalizeText", params)
        .then(data => {
          if (data.data.code == 0) {
            //开启属性
            if (data.data.data.length != 0) {
              self.textData = data.data.data.list;
              self.textAllData = data.data.data;
              self.open_tf = self.textData[0].isOpen;
              for (var i = 0; i < self.textData.length; i++) {
                if (
                  self.textData[i].categoryId == null ||
                  self.textData[i].showText.length == 0
                ) {
                  self.textData[i].showDisabled = true;
                  self.textData[i].isShow = "0";
                } else {
                  self.textData[i].showDisabled = false;
                }
                self.textData[i].isShow = self.textData[i].isShow.toString();
                //遍历推广类别
                for (var j = 0; j < self.categoryData.length; j++) {
                  //一级推广类别
                  if (self.textData[i].categoryId == self.categoryData[j].id) {
                    self.textData[i].categoryName =
                      self.categoryData[j].categoryName;
                    break;
                  }
                  //二级推广类别
                  if (self.categoryData[j].categoryList.length != 0) {
                    for (
                      var k = 0;
                      k < self.categoryData[j].categoryList.length;
                      k++
                    ) {
                      if (
                        self.textData[i].categoryId ==
                        self.categoryData[j].categoryList[k].id
                      ) {
                        self.textData[i].categoryName =
                          self.categoryData[j].categoryList[k].categoryName;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.textDataDisplay);
        });
    },
    //开启文字推广事件
    opentf() {
      var self = this;
      this.Axios.get("/promotion/generalizeText/num")
        .then(data => {
          if (data.data.code == 0) {
            if (data.data.data.length >= 6) {
              let params = {
                isOpen: self.open_tf
              };
              this.Axios.put("/promotion/generalizeText/setOpen", params)
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
                  this.extCatch(err, this.opentf);
                });
            } else {
              this.$message({
                message: "提示：文字推广最少要设置6条，显示名称为2~6字！",
                type: "warning"
              });
              self.open_tf = false;
              let params = {
                isOpen: false
              };
              this.Axios.put("/promotion/generalizeText/setOpen", params)
                .then(data => {
                  if (data.data.code == 0) {
                    self.created_fun()
                  } 
                })
                .catch(err => {
                  this.extCatch(err, this.opentf);
                });
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.opentf);
        });
    },
    //新增文字推广事件
    add_textpromo() {
      var self = this;
      var new_tableData = {
        showText: "",
        categoryId: null,
        isShow: "0",
        companyId: null,
        isOpen: true,
        createTime: ""
      };
      let params = new_tableData;
      this.Axios.post("/promotion/generalizeText", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: "添加成功",
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
          this.extCatch(err, this.add_textpromo);
        });
      self.textData.push(new_tableData);
    },
    //保存修改文字推广
    savedata(elem) {
      var self = this;
      var modifydata = self.textData[elem.$index];
      this.Axios.get("/promotion/generalizeText/num").then(data => {
        if (data.data.code == 0) {
          // console.log(data.data.data.length)
          if(data.data.data.length < 6){
            self.open_tf = false
            self.opentf()
          }
        }
      });
      if (elem.row.showText == "") {
        elem.row.isShow = "0";
        elem.row.showDisabled = true;
        return false;
      } else {
        if (elem.row.categoryId != null) {
          elem.row.showDisabled = false;
        }
      }
      let params = {
        id: modifydata.id,
        categoryId: modifydata.categoryId,
        showText: modifydata.showText,
        isShow: parseInt(modifydata.isShow)
      };
      this.Axios.put("/promotion/generalizeText/", params)
        .then(data => {
          if (data.data.code == 0) {
            self.created_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.savedata);
        });
    },
    //选择推广类别弹出框
    selectcate(elem) {
      var self = this;
      self.selectcate_data = elem.row;
      self.checkList = [elem.row.categoryId];
      for (var i in self.promoAllData) {
        if (elem.row.categoryId == self.promoAllData[i].id) {
          self.promoAllData[i].layer = 1; //如果是1级大类
          for (var j in self.promoAllData[i].categoryList) {
            self.checkList.push(self.promoAllData[i].categoryList[j].id);
          }
        } else {
          self.promoAllData[i].layer = 2; //默认是2级小类
        }
      }
      self.modify_promo_dialog = true;
    },
    //修改推广类别
    modicate() {
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
      self.selectcate_data.categoryId = self.checkList[0];
      let params = {
        id: self.selectcate_data.id,
        categoryId: self.selectcate_data.categoryId,
        showText: self.selectcate_data.showText,
        isShow: parseInt(self.selectcate_data.isShow)
      };
      this.Axios.put("/promotion/generalizeText", params)
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
          this.extCatch(err, this.modicate);
        });
      self.modify_promo_dialog = false;
    },
    //删除文字推广
    deltext(elem) {
      var self = this;
      this.$confirm(`确认删除‘${elem.row.showText}’此文字推广？`).then(_ => {
        let params = {
          PRS: {
            id: elem.row.id
          }
        };
        this.Axios.delete("/promotion/generalizeText/" + elem.row.id, params)
          .then(data => {
            if (data.data.code == 0) {
              this.$message({
                message: "删除成功！",
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
            this.extCatch(err, this.deltext);
          });
      });
    },
    //分页
    //每页多少条记录
    handleSizeChange(val) {
      var self = this;
      self.PageNum = 1;
      self.PageSize = val;
      self.textDataDisplay(self.PageNum, self.PageSize);
    },
    //改变当前页码
    handleCurrentChange(val) {
      var self = this;
      self.PageNum = val;
      self.textDataDisplay(self.PageNum, self.PageSize);
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
  .addmenu
    margin-bottom 10px
    .checkoutDisplay
      margin-left 30px
    .textDisplay
      margin-left 20px
      color $font-color
  .bai_btn
    width 100%
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
  .fengPage
    padding 20px
    padding-left 30%
</style>