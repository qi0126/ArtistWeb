<template>
    <div class="promotionBigDiv">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
          <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
          <el-breadcrumb-item>推广管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_text">
        <div class="topnav leftmenu">
          <span class="redfont">推广类别</span>
        </div>
        提示：类别编辑可对选中类别进行新建子类别、重命名、删除操作。类别名称，双击类别名称即可。<br/>
        点击链接设定可自定义设置点击该图片所指向的链接。
      </div>
      <el-container>
        <el-aside class="left_sale_menu" style="width:300px;">
          <div class="topnav leftmenu">
             <span class="redfont">类别编辑</span>
          </div>
          <div class="left_menu_div">
            <div class="left_submenu_div">
              <el-input
                placeholder="请输入关键字搜索"
                v-model="search_name"
                size="small">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button icon="el-icon-circle-plus-outline" style="width:100%" @click="add_salepromo" size="small">新增推广类别</el-button>
              <el-dialog
                title="新建推广类别"
                :visible.sync="add_promo_dialog"
                width="30%">
                <div>
                  <el-input v-model="add_promo_name" placeholder="请输入推广类别名称" size="small"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button size="small" @click="add_promo_dialog = false">取 消</el-button>
                  <el-button size="small" type="primary" @click="save_addpromo">确 定</el-button>
                </span>
              </el-dialog>
            </div>
            <div class="salemans_class">
              <el-collapse v-model="category_list">
                <draggable :list="category_allsubdata" @update="datadragEnd" :options="{animation: 300,handle:'.dargDiv'}">
                  <transition-group name="list-complete" >
                    <div v-for="category in category_allsubdata" :key="category.id">
                      <div :index="category.id" v-if="category.categoryList.length == 0" class="dargDiv"  @mouseover="menuover(category.id)" @click="selectmenu(category)" style="padding-left:20px">
                        {{category.categoryName}}({{category.count}})
                        <span class="menutool" v-show="submenuId == category.id"><i class="iconfont" @click="append(category)">&#xe66d;</i><i class="iconfont" @click="remove(category)">&#xe66e;</i></span>
                      </div>
                      <el-collapse-item :name="category.id" v-else  class="dargDiv">
                        <template  slot="title">
                          <div @mouseover="menuover(category.id)" @click="selectmenu(category)" style="padding-left:20px;">
                            {{category.categoryName}}({{category.count}})
                            <span class="menutool" v-show="submenuId == category.id"><i class="iconfont" @click="append(category)">&#xe66d;</i><i class="iconfont"  @click="remove(category)">&#xe66e;</i></span>
                          </div>
                        </template>
                        <div class="submenu" @mouseover="menuover(cate.id)" v-for="cate in category.categoryList" :key="cate.id" @click="selectmenu(cate)">
                          <span>{{cate.categoryName}}({{cate.count}})</span>
                          <span class="menutool" v-show="submenuId == cate.id"><i class="iconfont" @click="remove(cate)">&#xe66e;</i></span>
                        </div>
                      </el-collapse-item>
                    </div>
                  </transition-group>
                </draggable>
              </el-collapse>
              <el-dialog
                title="添加子推广类别"
                :visible.sync="add_twopromo_dialog"
                width="30%">
              <div>
                <div>在(<span class="red_font" v-html="select_name"></span>)添加子推广类别名称</div>
                <el-input v-model="add_twopromo_name" placeholder="请输入子推广类别名称"></el-input>
              </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="add_twopromo_dialog = false" size="small">取 消</el-button>
                  <el-button type="primary" @click="add_twopromo_fun" size="small">添加子推广类别</el-button>
                </span>
              </el-dialog>
              <el-dialog
                title="删除推广类别"
                :visible.sync="del_promo_dialog"
                width="30%">
                <span>确认删除此(<span class="red_font" v-html="del_promo_name"></span>)推广类别?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="del_promo_dialog = false" size="small">取 消</el-button>
                  <el-button type="primary" @click="del_promo(del_promo_id)" size="small">删除推广类别</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
          <div>
          <br/><br/><br/>
          <el-button @click="outdata" v-show="false">导出结果</el-button>
        </div>
        </el-aside>
        
        <el-container>
          <div class="right_div topnav">
            <span class="redfont">类别产品编辑</span>
            <div class="span_right">

              <el-button size="small" @click="addPro"><i class="iconfont">&#xe67f;</i> 添加产品</el-button>
              <el-dialog
                title="添加产品到推广类别"
                :visible.sync="add_pro_dialog"
                width="950px">
                <div class="proSearchDiv">产品类别：
                  <el-select v-model="value" placeholder="全部类别" size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input placeholder="请输入产品名字、编码、产品类别名称" v-model="pro_search" class="proSearch" size="small">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </div>
                <div ref="proDiv" class="proDiv">
                  <el-row>
                    <el-checkbox-group v-model="checkProList">
                      <el-col :span="8" v-for="item in productData" :key="item.id" style="padding:10px">
                        <div class="imgBigDiv" @click="proSelect(item)" >
                          <div class="img_div">
                            <el-checkbox :label="item.id">{{item.id}}</el-checkbox>
                          </div>
                          <div class="pro_img_list">
                            <img :src="[item.headImage == null?'/static/imgs/syBg.png' : fileAddress+'/'+item.headImage]" />
                            <div class="proImgNum">共{{item.imageCount}}张</div>
                          </div>
                          <div class="imgNameDiv">
                            {{item.productName}}<br/>
                            {{item.productNumber}}
                          </div>
                        </div>
                      </el-col>
                    </el-checkbox-group>
                  </el-row>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="add_pro_dialog = false" size="small">取 消</el-button>
                  <el-button type="primary" @click="addPro_fun" size="small">确 定</el-button>
                </span>
              </el-dialog>

              <el-button size="small" @click="modify_promo_dialog = true" :disabled="checkedProTF">调整产品类别</el-button>
              <el-dialog
                title="调整产品类别"
                :visible.sync="modify_promo_dialog"
                width="30%">
                <div class="content">
                  <div class="item" v-for="kind in category_odata" :key="kind.id">
                    <div class="parent">
                      <el-radio v-model="checkedCarId" :label="kind.id">{{kind.categoryName}}</el-radio>
                    </div>
                    <div class="child" v-show="kind.categoryList.length > 0">
                      【 <el-radio :v-model="checkedCarId" class="childText" :label="child.id" v-for="child in kind.categoryList" :key="child.id">{{ child.categoryName }}</el-radio> 】
                    </div>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="modify_promo_dialog = false" size="small">取 消</el-button>
                  <el-button type="primary" @click="modifyProToPromo" size="small">确 定</el-button>
                </span>
              </el-dialog>

              <el-button size="small" type="primary" @click="batchDelPro" :disabled="checkedProTF">批量移除</el-button>
            </div>
            <br/>
            <div class="right_subdiv">
              <el-table
                :data="tableData"
                border
                stripe
                class="el-table" style="width:98%;"
                v-if="tableData.length != 0"
                @selection-change="proSelectionChange"
                >
                <el-table-column
                  type="selection"
                  align="center"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="匹配图">
                  <template slot-scope="scope">
                    <!-- <img :src="[scope.row.headImage == null?'/static/imgs/syBg.png' : fileAddress+'/'+scope.row.headImage]" width="120px" @click="img_dialog = true"/><br/> -->
                    <img :src="[scope.row.headImage == null?'/static/imgs/syBg.png' : fileAddress+'/'+scope.row.headImage]" width="120px"/><br/>
                    共{{scope.row.imageCount}}张
                  </template>
                </el-table-column>
                <el-table-column
                  prop="productName"
                  align="center"
                  label="产品名称">
                </el-table-column>
                <el-table-column
                  prop="productClassName"
                  align="center"
                  label="产品分类">
                </el-table-column>
                <el-table-column
                  prop="productNumber"
                  align="center"
                  label="产品编号">
                </el-table-column>
                <el-table-column
                  prop="categoryName"
                  align="center"
                  label="所属类别">
                </el-table-column>
                <el-table-column
                  align="center"
                  width="160px"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="editrow(scope.row)" size="small" disabled>编辑</el-button>
                    <el-button size="small" type="primary" @click="delRowPro(scope.row)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>此类别还没有添加产品,请添加产品！</div>
              <!-- 点击图片弹出框 -->
              <el-dialog
                title="产品图片"
                :visible.sync="img_dialog"
                width="950px">
                <div>
                  <el-button size="small">上传图片</el-button>
                  <el-button size="small" type="primary">批量删除</el-button>
                </div>
                <div>
                  <el-row>
                    <el-col :span="6" v-for="index in 16" :key="index" style="padding:10px">
                      <div class="img_bigdiv">
                        <div class="img_div">
                          <el-checkbox v-model="img_checked"></el-checkbox>
                          <el-button size="small" type="primary" icon="el-icon-close" class="img_del_but"></el-button>
                        </div>
                        <img src="/static/imgs/test.png" class="image">
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-dialog>
              <div v-if="tableData.length != 0">
                  <div class="block">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="pageNum"
                      :page-sizes="[10, 20, 30]"
                      background
                      :page-size="pageSize"
                      layout="sizes, prev, pager, next"
                      :total="pageTotal">
                    </el-pagination>
                  </div>
              </div>
            </div>
          </div>
        </el-container>
      </el-container>

    </div>
</template>


<script>
import draggable from "vuedraggable";
let id = 1000;

let promoman_alldata = [];
export default {
  components: {
    draggable
  },
  data() {
    return {
      category_odata: [], //推广类别接口原始数据
      categoryLoadTF: true, //推广类别删除数据后重新输入
      //推广类别名搜索
      search_name: "",
      //推广类别备注名称
      promo_backupname: "",
      //推广类别成员搜索
      salemans_search: "",
      //全部推广类别信息
      category_alldata: [],
      //子推广类别信息
      category_allsubdata: [],
      //选中推广类别的ID
      select_index: 0,
      //选中推广类别的name
      select_name: "",
      //鼠标团队添加删除显示
      submenuId: "",
      //鼠标团队添加删除隐藏
      category_list: "",
      //选中推广类别的菜单
      clickmenu: [],

      //创建新推广类别弹出框
      add_promo_dialog: false,
      //创建新推广类别名称
      add_promo_name: "",
      //添加二级推广类别弹出框
      add_twopromo_dialog: false,
      //创建新子推广类别名称
      add_twopromo_name: "",
      //删除推广类别弹出框
      del_promo_dialog: false,
      //删除推广类别弹出框显示推广类别名称
      del_promo_name: "",
      //删除推广类别的推广类别ID
      del_promo_id: -1,
      //推广产品table
      tableData: [],
      //图片弹出框
      img_dialog: false,
      //产品里多张图片显示
      currentDate: new Date(),
      //选择图片
      img_checked: false,
      //添加产品弹出层
      add_pro_dialog: false,
      //调整推广类别弹出层
      modify_promo_dialog: false,
      //确认推广类别弹出层
      confirm_promo_dialog: false,
      //批量移除
      batch_del_dialog: false,
      //添加产品到推广类别全部类别
      options: [], //产品类别
      value: "",
      //添加产品到推广类别输入搜索框
      pro_search: "",
      productData: [], //产品显示产品数据
      productAllData: [], //产品显示所有数据
      productNum: 1, //产品显示分页第几页，默认为1
      productSize: 15, //产品显示一页显示几条，默认为15
      selectedProNum: 0, //产品选中的产品id
      categorySelectData: [], //推广类别选中数据
      pageNum: 1, //分页第几页，默认为1
      pageSize: 10, //每页显示几条，默认为10
      pageTotal: 0, //此类产品总几条的数据
      checkedProId: [], //选中产品组合数组
      checkedProTF: true, //true为没有选择产品，false为有选择产品
      checkedCarId: "", //调整推广类别选中的推广类别ID
      checkProList: [], //添加产品弹出框选择产品id
      prAddListenTf: true, //产品分页监听TF
      classifyTreeData: [], //产品分类tree数据
      classifySelectId: 0, //产品分类选中的ID
      categoryNameData: {}, //所属类别字段
      categoryIdData: {}, //所属类别ID字段
      proClassData: [] //产品分类数组
    };
  },
  created() {
    this.create_fun();
  },
  methods: {
    create_fun() {
      var self = this;
      self.pageNum = 1;
      this.clasTree_fun();
      this.Axios.get("/promotion/category")
        .then(data => {
          // console.log(data.data.data);
          self.category_odata = data.data.data;
          // console.log(self.category_odata);
          if (data.data.code == 0) {
            self.promo_alldata = data.data.data;
            var promo_alldata_new = [];
            var promo_alldata_subdata = [];
            self.category_allsubdata = data.data.data;
            //如果推广类别有数据刚显示第一条推广类别数据
            if (self.categoryLoadTF) {
              self.selectmenu(self.category_allsubdata[0]);
              self.categoryLoadTF = false;
            }
          }
          let params = {
            PRS: {
              size: 999
            }
          };
          this.Axios.get("/product/productClass", params).then(res => {
            if (res.data.code == 0) {
              // console.log(data.data.data);
              self.proClassData = res.data.data.list;
            }
          });
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    //产品分类tree数据
    clasTree_fun() {
      this.Axios.get("/product/productClass/tree")
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            this.classifyTreeData = data.data.data;
          }
        })
        .catch(err => {
          this.extCatch(err, this.clasTree_fun);
        });
    },
    //鼠标移开
    menuover(elem) {
      this.submenuId = elem;
    },
    //树状图渲染
    //添加子团队
    append(data) {
      var self = this;
      self.select_name = data.categoryName;
      self.select_index = data.id;
      self.add_twopromo_dialog = true;
    },
    //删除子菜单
    remove(data) {
      var self = this;
      self.del_promo_name = data.categoryName;
      self.del_promo_id = data.id;
      self.del_promo_dialog = true;
    },
    //推广类别选择事件
    selectmenu(data) {
      var self = this;
      self.pageNum = 1;
      self.categorySelectData = data;
      self.categoryFind(self.pageNum, self.pageSize);
    },
    //推广分类产品分页子查询事件
    categoryFind(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          size: size
        }
      };
      // console.log(self.categorySelectData);

      this.Axios.get(
        "/promotion/category/" + self.categorySelectData.id,
        params
      )
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data.total)
            // console.log(data.data.data.list);
            self.pageTotal = data.data.data.total;
            var tempDataList = [];
            self.categoryNameData = {};
            self.categoryIdData = {};
            if (data.data.data.list.length != 0) {
              for (var i = 0; i < data.data.data.list.length; i++) {
                tempDataList.push(data.data.data.list[i].productId);
                var tempProId = data.data.data.list[i].productId;
                self.categoryNameData[tempProId] =
                  data.data.data.list[i].categoryName;
                self.categoryIdData[tempProId] =
                  data.data.data.list[i].categoryId;
              }
              self.proIdList_fun(tempDataList);
            } else {
              self.tableData = [];
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.selectmenu);
        });
    },
    //产品id数组查询产品资料数组
    proIdList_fun(elem) {
      var self = this;
      let params = {
        PRS: {
          ids: elem
        }
      };
      this.Axios.get("/product/product/batch/base", params)
        .then(data => {
          if (data.data.code == 0) {
            self.tableData = data.data.data;
            for (var i = 0; i < self.tableData.length; i++) {
              var tempId = self.tableData[i].id;
              self.tableData[i].categoryName = self.categoryNameData[tempId];
              self.tableData[i].categoryId = self.categoryIdData[tempId];
              for(var j in self.proClassData){
                if(self.proClassData[j].id == self.tableData[i].productClassId){
                  self.tableData[i].productClassName = self.proClassData[j].className;
                }
              }
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

    //鼠标滑动菜单显示添加删除事件
    menuMouseover(data) {
      this.submenuId = data.id;
    },

    //创建新推广类别弹出框
    add_salepromo() {
      var self = this;
      self.add_promo_dialog = true;
    },
    //创建新推广类别保存
    save_addpromo() {
      var self = this;
      let params = {
        categoryName: self.add_promo_name,
        parentId: 0
      };
      this.Axios.post("/promotion/category", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data);
            self.add_promo_name = "";
            self.addpromo_search = "";
            this.$message({
              message: "推广类别创建成功！",
              type: "success"
            });
            self.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
          self.add_promo_dialog = false;
        })
        .catch(err => {
          this.extCatch(err, this.select_onepromo);
        });
    },
    //创建子推广类别事件
    add_twopromo_fun() {
      var self = this;
      let params = {
        categoryName: self.add_twopromo_name,
        parentId: self.select_index
      };
      this.Axios.post("/promotion/category", params)
        .then(data => {
          if (data.data.code == 0) {
            self.add_twopromo_name = "";
            self.add_twopromo_backup = "";
            self.add_twopromo_dialog = false;
            this.$message({
              message: "创建子推广类别成功！",
              type: "success"
            });
            self.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.select_onepromo);
        });
    },
    //删除推广类别事件
    del_promo(elem) {
      var self = this;
      self.del_promo_dialog = false;
      this.Axios.delete("/promotion/category/" + elem).then(data => {
        if (data.data.code == 0) {
          this.$message({
            message: "删除类别成功！",
            type: "success"
          });
          this.categoryLoadTF = true;
          this.create_fun();
        } else {
          this.$message({
            message: data.data.msg,
            type: "warning"
          });
        }
      });
    },
    //添加产品弹出框
    addPro() {
      var self = this;
      self.add_pro_dialog = true;
      if (self.prAddListenTf) {
        self.proDisplay(self.productNum, self.productSize);
        setTimeout(function() {
          var imgDiv = self.$refs.proDiv;
          imgDiv.addEventListener("scroll", function() {
            if (this.scrollHeight - this.scrollTop === this.clientHeight) {
              if (
                self.productNum * self.productSize <
                self.productAllData.total
              ) {
                self.productNum++;
                self.proDisplay(self.productNum, self.productSize);
              }
            }
          });
          self.prAddListenTf = false;
        }, 50);
      }
    },
    //编辑分类产品
    editrow(row) {
      console.log(row);
    },

    //分页属性
    //每页显
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      var self = this;
      self.pageNum = 1;
      self.pageSize = val;
      self.categoryFind(self.pageNum, self.pageSize);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      var self = this;
      self.pageNum = val;
      self.categoryFind(self.pageNum, self.pageSize);
    },

    //推广类别拖动JS
    datadragEnd: function(evt) {
      // console.log(evt)
      // console.log("拖动前的索引：" + evt.oldIndex);
      // console.log("拖动后的索引：" + evt.newIndex);
    },
    //推广类别结果输出
    outdata: function() {
      var self = this;
      // console.log(self.category_allsubdata);
    },

    //产品分页显示
    proDisplay(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          size: size
        }
      };
      this.Axios.get("/product/product", params)
        .then(data => {
          if (data.data.code == 0) {
            self.productData = self.productData.concat(data.data.data.list);
            self.productAllData = data.data.data;
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
      // console.log(elem);
      self.selectedProNum = elem.id;
    },
    //从推广类别移除产品
    delRowPro(elem) {
      var self = this;
      let params = {
        PRS: {
          categoryId: elem.categoryId,
          productIds: [elem.id]
        }
      };
      this.Axios.delete("/promotion/category/product", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            // console.log(self.categorySelectData.id)
            self.selectmenu(self.categorySelectData);
            self.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.delRowPro);
        });
    },
    //批量移除产品
    batchDelPro() {
      var self = this;
      var tempProList = [];
      for (var i = 0; i < self.checkedProId.length; i++) {
        tempProList.push(self.checkedProId[i].id);
      }
      let params = {
        PRS: {
          categoryId: self.categorySelectData.id,
          productIds: tempProList
        }
      };
      this.Axios.delete("/promotion/category/product", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            self.checkedProId = [];
            self.pageNum = 1;
            self.categoryFind(self.pageNum, self.pageSize);
            self.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.batchDelPro);
        });
    },
    //改变选中产品ID数组
    proSelectionChange(val) {
      var self = this;
      self.checkedProId = val;
      if (val.length != 0) {
        self.checkedProTF = false;
      } else {
        self.checkedProTF = true;
      }
    },
    //调整推广类别
    modifyProToPromo() {
      var self = this;
      // console.log(self.categorySelectData.id);
      // console.log(self.checkedProId)
      // console.log(self.checkedCarId)
      var tempProList = [];
      for (var i = 0; i < self.checkedProId.length; i++) {
        tempProList.push(self.checkedProId[i].id);
      }
      let params = {
        oldCategoryId: self.categorySelectData.id,
        productIds: tempProList,
        id: self.checkedCarId
      };
      this.Axios.put("/promotion/category/adjustCategory", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            self.self.checkedCarId = "";
            self.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.modifyProToPromo);
        });
      self.modify_promo_dialog = false;
    },
    //添加产品确认事件
    addPro_fun() {
      var self = this;
      let params = {
        categoryIds: [self.categorySelectData.id],
        productIds: self.checkProList
      };

      this.Axios.post("/promotion/category/product", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            self.checkProList = [];
            self.pageNum = 1;
            self.categoryFind(self.pageNum, self.pageSize);
            self.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.addPro_fun);
        });
      self.add_pro_dialog = false;
    }
  }
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.promotionBigDiv
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
  .topnav
    font-size 1rem
    height 30px
    line-height 2
    padding-left 0px
    width 100%
    padding-bottom 10px
  .red_font
    color red
  .top_text
    color #ababab
    line-height 25px
  .leftmenu
    width 90%
  .left_menu_div
    padding-left 0
    .left_sale_menu
      width 360px
        .menu_modify
          float right
          margin-right 20px
    .salemans_class
      border 1px solid #d9d9d9
      border-top 0
      height 560px
      border-bottom-left-radius 5px
      border-bottom-right-radius 5px
    .left_submenu_div
      padding 10px 16px 10px 16px
      line-height 3.5
      border 1px solid #d9d9d9
      border-bottom 0
      border-top-left-radius 5px
      border-top-right-radius 5px
  .span_right
    float right
    text-algin right
    width 350px
    .proDiv
      height 400px
      overflow-x hidden
      .imgBigDiv
        width 220px
        height 60px
        margin-bottom 15px
        .img_div
          position absolute
          padding-left 5px
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
          top 65px
          right -3px
          margin-top -11px
          background-color #999
          opacity 0.8
          color #ffffff
          font-size 12px
          padding 0 5px 0 5px
          border-bottom-right-radius 5px
        .imgNameDiv
          padding-left 110px
          width 85%
          font-size 14px
          .img_del_but
            float right
        .proSelect
          cursor pointer
        .pro_img_txt
          width 190px
          float left
          margin-left 10px
          margin-top 15px
    .proSearchDiv
      width 100%
      margin-bottom 15px
    .proSearch
      margin-bottom 5px
      width 315px
  .right_div
    margin-left 20px
  .right_subdiv
    border 1px solid #d9d9d9
    width 92%
    padding 24px 30px 24px 30px
    margin-top 10px
    height 622px
    border-radius 5px
    overflow auto
    .cust_leftdiv
      color #666
  // 产品编辑拖动
  .img_bigdiv
    width 220px
    height 166px
    .img_div
      border 1px solid red
      position absolute
      width 220px
      height 166px
      .img_del_but
        float right
  // 添加产品到推广类别
  .pro_bigdiv
    width 220px
    height 166px
    .pro_div
      border 1px solid red
      position absolute
      width 220px
      height 166px
      .pro_del_but
        float right
  .block
    text-algin center
    width 550px
    margin 0 auto
  .item
    width 100%
    margin-bottom 30px
    display flex
    align-items top
    .text
      white-space nowrap
  // 图片卡片样式
  .time
    font-size 13px
    color #999
  .bottom
    margin-top 13px
    line-height 12px
  .button
    padding 0
    float right
  .image
    width 100%
    display block
  .clearfix:before, .clearfix:after
    display table
    content ''
  .clearfix:after
    clear both
  .menutool
    float right
    text-align right
    color $base-color
    .iconfont
      margin-right 16px
      z-index 11111
  // 鼠标拖动js
  [v-cloak]
    display none
  #example
    width 1000px
    margin 0 auto
  .list-complete-item
    transition all 1s
    height 50px
    line-height 50px
    background #000
    color #fff
    text-align center
    font-size 24px
    margin-top 10px
  .list-complete-item-heng
    transition all 1s
    height 50px
    line-height 50px
    background #000
    color #fff
    text-align center
    font-size 24px
    margin-top 10px
    float left
    width 240px
    margin-right 10px
  .styleclass
    width 100px
    float left
  .list-complete-enter, .list-complete-leave-active
    opacity 0
    height 0px
    margin-top 0px
    padding 0px
    border solid 0px
  .list-complete-sortable-chosen, .list-complete-sortable-ghost
    opacity 0
    height 0px
    margin-top 0px
    padding 0px
    border solid 0px
  .dargDiv
    cursor pointer
    line-height 48px
    background-color #fff
    color #2d2f33
    border-bottom 1px solid #e6ebf5
    font-size 13px
    font-weight 500
    padding-bottom 0
    .el-collapse-item__content
      padding-bottom 0
  .submenu
    height 48px
    line-height 48px
    cursor pointer
    border-top 1px solid #e6ebf5
    padding-left 40px
    .el-collapse-item__content
      border-top 1px solid #e6ebf5
      padding-left 20px
      padding-bottom 0
  .wrods
    margin-top 50px
  p
    line-height 24px
    text-align center
</style>

