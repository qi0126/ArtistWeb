<template>
    <div class="carouselBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
            <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
            <el-breadcrumb-item>推广栏目</el-breadcrumb-item>
            <el-breadcrumb-item>文字推广</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="addmenu">
            <el-button type="primary" size="small" @click="add_textpromo">新增文字推广</el-button>
            <el-checkbox v-model="open_tf" @change="opentf">开启</el-checkbox>
        </div>
        <div>
            <el-table
            :data="textData"
            border
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
                    <el-input v-model="scope.row.showText" placeholder="请输入内容" size="small" @blur="savedata(scope)" ></el-input>
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
                    <el-radio label='1'>是</el-radio>
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
            <el-dialog
                title="设置推广类别"
                :visible.sync="modify_promo_dialog"
                width="950px">
                <div class="content">
                      <div class="item" v-for="cate in allCategory" :key="cate.id">
                          <div class="parent">
                            <el-radio v-model="cate_checked" :label="cate.id">{{cate.categoryName}}</el-radio>
                          </div>
                          <div class="child" v-show="cate.children != undefined">
                            【 <el-radio v-model="cate_checked" class="childText" :label="catesub.id" v-for="catesub in cate.children" :key="catesub.id">{{ catesub.categoryName }}</el-radio> 】
                          </div>
                      </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="modify_promo_dialog = false">取 消</el-button>
                  <el-button type="primary" @click="modicate">确 定</el-button>
                </span>
              </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      open_tf: false, //开启变量
      textData: [], //文字推广数据显示
      modify_promo_dialog: false, //设置推广类别弹出框
      allCategory: [], // 全部推广类别
      cate_checked: "", //选中推广类别的id
      selectcate_data: {}, //选中文字的数组数据
      categoryData: []
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
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
      //文字推广内容渲染
      this.Axios
        .get("/promotion/generalizeText")
        .then(data => {
          if (data.data.code == 0) {
            //开启属性
            if (data.data.data.length != 0) {
              self.textData = data.data.data;
              self.open_tf = self.textData[0].isOpen;
              for (var i = 0; i < self.textData.length; i++) {
                self.textData[i].isShow = self.textData[i].isShow.toString();
                for (var j = 0; j < self.categoryData.length; j++) {
                  if (self.textData[i].categoryId == self.categoryData[j].id) {
                    self.textData[i].categoryName =
                      self.categoryData[j].categoryName;
                  }
                }
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.created_fun);
        });
    },
    //开启文字推广事件
    opentf() {
      var self = this;
      let params = {
        isOpen: self.open_tf
      };
      this.Axios
        .put("/promotion/generalizeText/setOpen", params)
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
      this.Axios
        .post("/promotion/generalizeText", params)
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
      // console.log(modifydata);
      let params = {
        id: modifydata.id,
        categoryId: modifydata.categoryId,
        showText: modifydata.showText,
        isShow: parseInt(modifydata.isShow)
      };
      this.Axios
        .put("/promotion/generalizeText/", params)
        .then(data => {
          if (data.data.code == 0) {
            // this.$message({
            //   message: data.data.msg,
            //   type: "success"
            // });
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
    //选择推广类别
    selectcate(elem) {
      var self = this;
      self.cate_checked = elem.row.categoryId;
      self.selectcate_data = elem.row;
      self.modify_promo_dialog = true;
    },
    //修改推广类别
    modicate() {
      var self = this;
      self.selectcate_data.categoryId = self.cate_checked;
      let params = {
        id: self.selectcate_data.id,
        categoryId: self.selectcate_data.categoryId,
        showText: self.selectcate_data.showText,
        isShow: parseInt(self.selectcate_data.isShow)
      };
      this.Axios
        .put("/promotion/generalizeText", params)
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
      let params = {
        PRS: {
          id: elem.row.id
        }
      };
      this.Axios
        .delete("/promotion/generalizeText/" + elem.row.id, params)
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
  .bai_btn
    width 100%
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