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
             <span class="redfont">销售人员列表</span>
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
                      <div :index="category.id" v-if="category.children == undefined" class="dargDiv"  @mouseover="menuover(category.id)" @click="selectmenu(category)" style="padding-left:20px">
                        {{category.categoryName}}
                        <span class="menutool" v-show="submenuId == category.id"><i class="iconfont" @click="append(category)">&#xe66d;</i><i class="iconfont" @click="remove(category)">&#xe66e;</i></span>
                      </div>
                      <el-collapse-item :name="category.id" v-else  class="dargDiv">
                        <template  slot="title">
                          <div @mouseover="menuover(category.id)" @click="selectmenu(category)" style="padding-left:20px;">
                            {{category.categoryName}}
                            <span class="menutool" v-show="submenuId == category.id"><i class="iconfont" @click="append(category)">&#xe66d;</i><i class="iconfont"  @click="remove(category)">&#xe66e;</i></span>
                          </div>
                        </template>
                        <div class="submenu" @mouseover="menuover(cate.id)" v-for="cate in category.children" :key="cate.id" @click="selectmenu(cate)">
                          <span>{{cate.categoryName}}</span>
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
                  <el-button @click="add_twopromo_dialog = false">取 消</el-button>
                  <el-button type="primary" @click="add_twopromo_fun">添加子推广类别</el-button>
                </span>
              </el-dialog>
              <el-dialog
                title="删除推广类别"
                :visible.sync="del_promo_dialog"
                width="30%">
                <span>确认删除此(<span class="red_font" v-html="del_promo_name"></span>)推广类别?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="del_promo_dialog = false">取 消</el-button>
                  <el-button type="primary" @click="del_promo(del_promo_id)">删除推广类别</el-button>
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
            <span class="redfont">销售人员信息</span>
            <div class="span_right">

              <el-button size="small" @click="add_pro_dialog = true">添加产品</el-button>
              <el-dialog
                title="添加产品到推广类别"
                :visible.sync="add_pro_dialog"
                width="950px">
                <span>产品类别：
                  <el-select v-model="value" placeholder="全部类别">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input
                    placeholder="请输入内容"
                    v-model="pro_search">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </span>
                <div>
                  <el-row>
                    <el-col :span="8" v-for="(ind) in 6 " :key="ind" >
                      <img src="/static/imgs/test.png" style="width:100px;" />
                      平面实心-手镯
                    </el-col>
                  </el-row>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="add_pro_dialog = false">取 消</el-button>
                  <el-button type="primary" @click="add_pro_dialog = false">确 定</el-button>
                </span>
              </el-dialog>

              <el-button size="small" @click="modify_promo_dialog = true">调整产品类别</el-button>
              <el-dialog
                title="调整产品类别"
                :visible.sync="modify_promo_dialog"
                width="30%">
                <div class="content">
                  <div class="item" v-for="kind in allKinds" :key="kind.parent">
                    <div class="parent">
                      <el-checkbox v-model="kind.parent" :label="kind.parent">{{kind.parent}}</el-checkbox>
                    </div>
                    <div class="child" v-show="kind.childs.length > 0">
                      【 <el-checkbox :v-model="child" class="childText" :label="child" v-for="child in kind.childs" :key="child">{{ child }}</el-checkbox> 】
                    </div>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="modify_promo_dialog = false">取 消</el-button>
                  <el-button type="primary" @click="modify_promo_dialog = false">确 定</el-button>
                </span>
              </el-dialog>

              <el-button size="small" type="primary" @click="batch_del_dialog = true">批量移除</el-button>
              <el-dialog
                title="提示"
                :visible.sync="batch_del_dialog"
                width="30%">
                <span>确认要批量移除所选中产品？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="batch_del_dialog = false">取 消</el-button>
                  <el-button type="primary" @click="batch_del_dialog = false">确 定</el-button>
                </span>
              </el-dialog>
            </div>
            <br/>
            <div class="right_subdiv">
              <el-table
                :data="tableData"
                border
                class="el-table" style="width:98%;">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="匹配图">
                  <template slot-scope="scope">
                    <img src="/static/imgs/test.png" width="120px" @click="img_dialog = true"/><br/>
                    共3张
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="产品名称">
                </el-table-column>
                <el-table-column
                  prop="province"
                  label="产品分类">
                </el-table-column>
                <el-table-column
                  prop="city"
                  label="产品编号">
                </el-table-column>

                <el-table-column
                  prop="zip"
                  label="所属类别">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="editrow(scope.row)" size="small">编辑</el-button>
                    <el-button size="small" type="primary">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
                          <el-checkbox v-model="img_checked">备选项</el-checkbox>
                          <el-button size="small" type="primary" icon="el-icon-close" class="img_del_but"></el-button>
                        </div>
                        <img src="/static/imgs/test.png" class="image" @mouseover="img_over" @mouseout="img_out">
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-dialog>
              <div>
                  <div class="block">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage2"
                      :page-sizes="[100, 200, 300, 400]"
                      :page-size="100"
                      layout="sizes, prev, pager, next"
                      :total="1000">
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
      tableData: [
        {
          date: "2016-05-03",
          name: "平口实心手镯",
          province: "手镯—实心—平面密口",
          city: "65465468548-125",
          address: "新品",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "平口实心手镯",
          province: "手镯—实心—平面密口",
          city: "65465468548-125",
          address: "新品",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "平口实心手镯",
          province: "手镯—实心—平面密口",
          city: "65465468548-125",
          address: "新品",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "平口实心手镯",
          province: "手镯—实心—平面密口",
          city: "65465468548-125",
          address: "新品",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "平口实心手镯",
          province: "手镯—实心—平面密口",
          city: "65465468548-125",
          address: "新品",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "平口实心手镯",
          province: "手镯—实心—平面密口",
          city: "65465468548-125",
          address: "新品",
          zip: 200333
        }
      ],
      //图片弹出框
      img_dialog: false,
      //第几页默认5
      currentPage2: 5,
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
      // 全部推广类别
      allKinds: [
        { parent: "推荐产品", childs: [] },
        { parent: "人气产品", childs: [] },
        {
          parent: "丝丝心印系列",
          childs: [
            "子类1",
            "子类2",
            "子类3",
            "子类4",
            "子类5",
            "子类6",
            "子类7",
            "子类8",
            "子类9",
            "子类10",
            "子类11",
            "子类12",
            "子类13"
          ]
        }
      ],
      //添加产品到推广类别全部类别
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
      //添加产品到推广类别输入搜索框
      pro_search: "",

      //鼠标拖动
      list3: [
        { id: "id1", it: { name: "bbbb" } },
        { id: "id2", it: { name: "2222" } },
        { id: "id3", it: { name: "3333" } },
        { id: "id4", it: { name: "4444" } }
      ],
      out_menu_data: [] //鼠标拖动后输出结果
    };
  },
  created() {
    this.create_fun();
  },
  methods: {
    create_fun() {
      var self = this;
      this.Axios
        .get("/promotion/category")
        .then(data => {
          // console.log(data.data.data);
          self.category_odata = data.data.data;
          // console.log(self.category_odata);
          if (data.data.code == 0) {
            self.promo_alldata = data.data.data;
            var promo_alldata_new = [];
            var promo_alldata_subdata = [];
            var data = self.promo_alldata,
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
            //无限级菜单拼接数据组tree
            // console.log(tree);
            self.category_allsubdata = tree;
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
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
    //
    selectmenu(data) {
      console.log(data);
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
      this.Axios
        .post("/promotion/category", params)
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
      this.Axios
        .post("/promotion/category", params)
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
          this.create_fun();
        } else {
          this.$message({
            message: data.data.msg,
            type: "warning"
          });
        }
      });
    },
    //产品图片编辑与鼠标移进
    img_over() {
      console.log("aaaa");
    },
    //产品图片鼠标移出
    img_out() {
      console.log("aaaa");
    },

    //编辑分类产品
    editrow(row) {
      console.log(row);
    },

    //分页属性
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
      console.log(self.category_allsubdata);
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
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
  .span_right
    float right
    text-algin right
    width 350px
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

