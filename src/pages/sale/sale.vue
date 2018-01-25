<template>
    <div class="saleBigDiv">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
          <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
          <el-breadcrumb-item>销售管理</el-breadcrumb-item>
          <el-breadcrumb-item>销售人员管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-container>
        <el-aside class="left_sale_menu" width="320px">
          <div class="topnav leftmenu">
             <span class="redfont">销售人员列表</span> 
          </div>
          <div class="left_menu_div">
            <div class="left_submenu_div">
              <el-input
                placeholder="请输入关键字搜索"
                v-model="search_name" size="small">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button icon="el-icon-circle-plus-outline" size="small" style="width:100%" @click="add_customer">添加新员工</el-button>
              <el-button class="add_cust_btn" size="small" :disabled="selectSaleTF" @click="add_toteam_fun">添加到团队</el-button>
              <el-dialog
                title="添加到团队"
                :visible.sync="add_toteam_dialog"
                center>
                <div class="addTeamDiv">
                  <el-row>
                    <el-radio-group v-model="add_toteam_data" @change="add_toteam_change">
                      <el-col :span="6" v-for="team in allteam_data" :key="team.id">
                        <el-radio :label="team.id">{{team.teamName}}</el-radio>
                      </el-col>
                    </el-radio-group>
                  </el-row>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="add_toteam_dialog = false" size="small">取 消</el-button>
                  <el-button type="primary" @click="toteam_save(add_toteam_data)" size="small">确 定</el-button>
                </span>
              </el-dialog>
              <el-button @click="delsaleman(multipleSelection)" :disabled="selectSaleTF" size="small" type="danger" class="del_cust_btn">删除员工</el-button>
            </div>
            <div class="salemans_class">
              <el-table
                ref="multipleTable"
                :data="salemans"
                tooltip-effect="dark"
                :show-header = 'false'
                @row-click = "rowclick"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                >
                <el-table-column
                  type="selection" class="salemans_table">
                </el-table-column>
                <el-table-column
                  label="姓名">
                  <template slot-scope="scope">
                    <div style="cursor: pointer;">{{scope.row.name}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-aside>
        
        <el-container>
          <div class="right_div topnav">
            <span class="redfont">销售人员信息</span><br/>
            <div class="right_subdiv">
              <div class="topmenuTxt">
                个人基本信息
              </div>
              <div class="hr"/>
              <div>
                <el-row>
                  <el-col :span="3" class="cust_lefttxt">
                    名 称
                  </el-col>
                  <el-col :span="8">
                    <el-input placeholder="请填写员工名称" v-model="salemans_data.saler.name" @blur="save_saleman_fun" size="small" class="inputDiv"></el-input> 
                    <span class="red_star">*</span>
                  </el-col>
                  <el-col :span="1"></el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    联系电话
                  </el-col>
                  <el-col :span="9">
                    <el-input placeholder="请输入联系电话" v-model="salemans_data.saler.phone" @blur="save_saleman_fun" size="small" class="inputDiv"></el-input> 
                    <span class="red_star">*</span>
                  </el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    昵 称
                  </el-col>
                  <el-col :span="8">
                    <el-input placeholder="请输入呢称" v-model="salemans_data.saler.nickName" @blur="save_saleman_fun" size="small" class="inputDiv"></el-input>
                    <span class="red_star">*</span>
                  </el-col>
                  <el-col :span="1"></el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    所属团队
                  </el-col>
                  <el-col :span="9">
                    <el-select placeholder="请选择所属团队" v-model="salemans_data.saler.teamId" @blur="save_saleman_fun" size="small" class="inputDiv">
                      <el-option
                        v-for="item in allteam_data"
                        :key="item.id"
                        :label="item.teamName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    工 号
                  </el-col>
                  <el-col :span="8">
                    <el-input placeholder="请输入工号" v-model="salemans_data.saler.jobNumber" @blur="save_saleman_fun" size="small" class="inputDiv"></el-input>
                    <span class="red_star">*</span>
                  </el-col>
                  <el-col :span="1"></el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    密码设置
                  </el-col>
                  <el-col :span="9">
                    <el-input placeholder="请输入密码" v-model="salemans_data.saler.password" @blur="save_saleman_fun" size="small" class="inputDiv"></el-input>
                    <span class="red_star">*</span>
                  </el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    性别选择
                  </el-col>
                  <el-col :span="8">
                    <el-select placeholder="男" v-model="salemans_data.saler.gender"  @blur="save_saleman_fun" size="small" class="inputDiv">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="1"></el-col>
                  <el-col :span="3" class="cust_lefttxt">
                    职位设置
                  </el-col>
                  <el-col :span="9">
                    <el-select v-model="value5"  multiple placeholder="请选择职位" @blur="save_saleman_fun" size="small" class="inputDiv">
                      <el-option
                        v-for="item in job_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
              <br/>
              <div class="cust_add_div">
                <div class="topmenuTxt">
                  跟进客户列表
                  <span class="cust_top_rightspan">
                    <el-input
                      placeholder="请输入关键字搜索"
                      prefix-icon="el-icon-search"
                    class="search_cust_input" size="small">
                    </el-input>
                    <el-button icon="el-icon-circle-plus" @click="add_newcust_fun" class="cust_add_btn" size="small">添加跟进客户</el-button>
                      <el-dialog
                      title="添加跟进客户"
                      :visible.sync="add_cust_dialog"
                      width="30%"
                      center>
                      <el-input
                        placeholder="请输入关键字搜索"
                        v-model="search_name" size="small">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                      </el-input>
                      <div>
                        <el-row>
                          <el-checkbox-group v-model="checked_newcust">
                            <el-col :span="6" v-for="newcust in add_newcust_data" :key="newcust.customerName">
                              <el-checkbox :label="newcust.id" :name="newcust.customerName">{{newcust.customerName}}</el-checkbox>
                            </el-col>
                          </el-checkbox-group>
                        </el-row>
                      </div>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="add_cust_dialog = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="add_newcust_save" size="small">确 定</el-button>
                      </span>
                    </el-dialog>
                    <el-button type="danger" @click="delCustFun" size="small" :disabled="delCustTF">删除客户</el-button>
                  </span>
                </div>
                
              </div>
              <div class="hr"/>
              <div>
                <div v-html="customersdata_display"></div>
                <el-row>
                  <el-checkbox-group v-model="checked_cust" @change="changeCust">
                    <el-col :span="6" v-for="cust in customers_data" :key="cust.id">
                      <el-checkbox :label="cust.id">{{cust.customerName}}</el-checkbox>
                    </el-col>
                  </el-checkbox-group>
                </el-row>
              </div>
              <div class="add_save_div" v-show="custsave_btn_div"><el-button type="primary" @click="add_save" size="small">保存</el-button></div>
            </div>
          </div>
        </el-container>
      </el-container>
    </div>
</template>


<script>
const salemans_list = {
  saler: {
    id: -1,
    name: "",
    nickName: "",
    jobNumber: "",
    password: "",
    gender: "",
    phone: "",
    departmentId: "",
    jobtitleId: "",
    status: "",
    teamId: "",
    accountId: "",
    companyId: "",
    createAccountId: "",
    createTime: ""
  },
  customers: ""
};
export default {
  data() {
    return {
      //员工列表
      salemans: [],
      //员工信息
      salemans_data: salemans_list,

      custsave_btn_div: false,
      //添加新员工弹出框
      add_customer_dialog: false,
      //选中员工信息
      checked_saleman_Id: -1,
      checked_saleman_data: [],
      //添加到团队弹出框
      add_toteam_dialog: false,
      //添加到团队动态数据
      add_toteam_data: [],
      //全部团队信息
      allteam_data: [],
      //跟进客户信息列表
      customers_data: [],
      customersdata_display: "",

      //添加客户信息弹窗
      add_cust_dialog: false,
      //获取客户(销售未添加的客户)
      add_newcust_data: [],
      //选中添加跟进客户
      checked_newcust: [],
      //性别
      options: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        }
      ],
      value5: [],
      //跟进客户列表开始
      checkAll: false,
      //选中的客户
      checked_cust: [],
      isIndeterminate: true,
      //跟进客户列表结束
      job_options: [
        {
          value: "1",
          label: "客服专员"
        },
        {
          value: "2",
          label: "区域经理"
        },
        {
          value: "3",
          label: "客服经理"
        },
        {
          value: "4",
          label: "大区域经理"
        }
      ],
      value: "",
      search_name: "", //销售人员输入框
      selectSaleTF: true,
      multipleSelection: [],
      selectCustData: [], //选中跟进客户数组
      delCustTF: true, //删除客户按钮禁用
      loading:true,//网页加载中
    };
  },
  created() {
    this.create_fun();
  },
  methods: {
    create_fun() {
      var self = this;
      this.Axios
        .get("/saler/saler")
        .then(data => {
          if (data.data.code == 0) {
            self.salemans = data.data.data;
            self.loading= false
            //读取第一个员工的信息
            if (self.salemans.length != 0) {
              this.customer_load(self.salemans[0].id);
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
      this.Axios
        .get("/saler/saleTeam")
        .then(data => {
          if (data.data.code == 0) {
            self.allteam_data = data.data.data;
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
    },
    handleSelectionChange(val) {
      var self = this;
      if (val.length != 0) {
        self.selectSaleTF = false;
        self.multipleSelection = val;
      } else {
        self.selectSaleTF = true;
      }
    },
    //删除员工
    delsaleman(data) {
      var delsaleman_list = [];
      for (var i = 0; i < data.length; i++) {
        delsaleman_list.push(data[i].id);
      }
      this.Axios
        .delete("/saler/saler/batch", { params: { ids: delsaleman_list } })
        .then(data => {
          if (data.data.code == 0) {
            this.$notify({
              title: "成功",
              message: data.data.msg,
              type: "success"
            });
            this.create_fun();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.msg
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.delsaleman);
        });
    },
    //点击跟进员工选择事件
    rowclick(row, event, column) {
      this.customer_load(row.id);
    },
    //用接口读取员工资料信息
    customer_load(elem) {
      var self = this;
      self.checked_saleman_Id = elem;
      self.custsave_btn_div = false;
      this.Axios
        .get("/saler/saler/" + elem)
        .then(data => {
          if (data.data.code == 0) {
            self.salemans_data = [];
            self.salemans_data = data.data.data;
            self.checked_cust = [];
            if (self.salemans_data.customers != null) {
              self.customers_data = self.salemans_data.customers;
              self.customersdata_display = "";
            } else {
              self.customers_data = [];
              self.customersdata_display = "此销售人员没有跟进客户！";
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.customer_load);
        });
    },
    //修改员工信息
    save_saleman_fun() {
      var self = this;
      self.salemans_data.customersids = self.checked_newcust;

      var modi_saleman_data = {};
      //id
      modi_saleman_data.id = this.salemans_data.saler.id;
      //姓名
      modi_saleman_data.name = this.salemans_data.saler.name;
      //昵称
      modi_saleman_data.nickName = this.salemans_data.saler.nickName;
      //电话
      modi_saleman_data.phone = this.salemans_data.saler.phone;
      //工号
      modi_saleman_data.jobNumber = this.salemans_data.saler.jobNumber;
      //性别
      modi_saleman_data.gender = this.salemans_data.saler.gender;
      //组织架构
      modi_saleman_data.departmentId = this.salemans_data.saler.departmentId;
      //职位
      modi_saleman_data.jobtitleId = this.salemans_data.saler.jobtitleId;
      //创建人id
      modi_saleman_data.create_account_id = this.salemans_data.saler.createAccountId;
      //密码
      modi_saleman_data.password = this.salemans_data.saler.password;
      //跟进客户id数组
      modi_saleman_data.customersids = self.salemans_data.customersids;
      // console.log(modi_saleman_data);
      let params = {
        modi_saleman_data
      };
      this.Axios
        .put("/saler/saler", modi_saleman_data)
        .then(data => {
          if (data.data.code == 0) {
            //修改后销售人员列表更新
            self.salemans = data.data.data;
          }
        })
        .catch(err => {
          this.extCatch(err, this.save_saleman_fun);
        });
    },
    //添加新员工按钮
    add_customer() {
      var self = this;
      self.salemans_data = salemans_list;
      self.custsave_btn_div = true;
      //跟进客户列表
      self.customers_data = [];
      self.customersdata_display = "此销售人员没有跟进客户！";
    },
    //添加到团队按钮
    add_toteam_fun() {
      var self = this;
      // console.log(self.multipleSelection);
      if (self.multipleSelection.length != 0) {
        self.add_toteam_dialog = true;
        this.Axios
          .get("/saler/saleTeam")
          .then(data => {
            if (data.data.code == 0) {
              self.allteam_data = data.data.data;
            }
          })
          .catch(err => {
            this.extCatch(err, this.add_toteam_fun);
          });
      } else {
        this.$notify({
          title: "警告",
          message: "没有选中的员工！",
          type: "warning"
        });
      }
    },
    //添加团队确认按钮
    toteam_save(value) {
      var self = this;
      self.add_toteam_dialog = false;
      self.checked_saleman_data = [];
      for (var i = 0; i < self.multipleSelection.length; i++) {
        self.checked_saleman_data.push(self.multipleSelection[i].id);
      }
      let params = {
        id: value,
        salers: self.checked_saleman_data
      };
      this.Axios
        .post("/saler/saleTeam/salers", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$notify({
              title: "成功",
              message: data.data.msg,
              type: "success"
            });
            this.create_fun();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.msg
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.toteam_save);
        });
    },
    //选择客户
    changeCust() {
      var self = this;
      if (self.checked_cust.length != 0) {
        self.delCustTF = false;
      } else {
        self.delCustTF = true;
      }
    },

    //删除客户
    delCustFun() {
      var self = this;
      let params = {
        PRS: {
          salerId: self.checked_saleman_Id,
          customersids: self.checked_cust
        }
      };
      this.Axios
        .delete("/saler/saler/customers", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: "删除跟进客户成功！",
              type: "success"
            });
            self.customers_data = data.data.data;
            self.checked_newcust = [];
            self.checked_cust = [];
            self.delCustTF = true;
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
    },
    //添加新客户弹窗事件
    add_newcust_fun() {
      var self = this;
      self.add_cust_dialog = true;
      this.Axios
        .get("/saler/saler/customers")
        .then(data => {
          if (data.data.code == 0) {
            self.add_newcust_data = data.data.data;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.add_newcust_fun);
        });
    },
    //保存跟进客户
    add_newcust_save() {
      var self = this;
      let params = {
        id: self.checked_saleman_Id,
        customersids: self.checked_newcust
      };
      this.Axios
        .post("/saler/saler/customers", params)
        .then(data => {
          if (data.data.code == 0) {
            self.customers_data = data.data.data;
            if (self.customers_data.length == 0) {
              self.customersdata_display = "此销售人员没有跟进客户！";
            } else {
              self.customersdata_display = "";
            }
            self.checked_newcust = [];
            self.checked_cust = [];
            self.delCustTF = true;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.msg
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.add_newcust_save);
        });
      this.add_cust_dialog = false;
    },
    //添加到团队数据
    add_toteam_change(value) {
      console.log(value);
    },

    //跟进客户js结束
    //添加新用户按钮
    add_save() {
      var add_saleman_data = {};
      //姓名
      add_saleman_data.name = this.salemans_data.saler.name;
      //昵称
      add_saleman_data.nickName = this.salemans_data.saler.nickName;
      //电话
      add_saleman_data.phone = this.salemans_data.saler.phone;
      //工号
      add_saleman_data.jobNumber = this.salemans_data.saler.jobNumber;
      //性别
      add_saleman_data.gender = this.salemans_data.saler.gender;
      //组织架构
      add_saleman_data.departmentId = this.salemans_data.saler.departmentId;
      //职位
      add_saleman_data.jobtitleId = this.salemans_data.saler.jobtitleId;
      //创建人id
      add_saleman_data.create_account_id = this.salemans_data.saler.createAccountId;
      //密码
      add_saleman_data.password = this.salemans_data.saler.password;

      var customersids = [];
      for (var i = 0; i < this.customers_data.length; i++) {
        customersids.push(this.customers_data[i].id);
      }
      add_saleman_data.customersids = customersids;
      this.Axios
        .post("/saler/saler", add_saleman_data)
        .then(data => {
          if (data.data.code == 0) {
            this.$notify({
              title: "成功",
              message: data.data.msg,
              type: "success"
            });
            this.create_fun();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.msg
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.add_cust_fun);
        });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.saleBigDiv
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
    width 100%
  .topmenuTxt
    font-size 1rem
    height 40px
  .leftmenu
    width 90%
  .left_menu_div
    padding 20px 20px 20px 0
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px
    .left_submenu_div
      padding 10px 16px 10px 16px
      border-top-left-radius 5px
      border-top-right-radius 5px
      line-height 3.5
      border 1px solid #d9d9d9
      height 135px
      .add_cust_btn
        margin-left 0
        float left
      .del_cust_btn
        margin-left 11px
        float right
    .salemans_class
      border-bottom-left-radius 5px
      border-bottom-right-radius 5px
      border 1px solid #d9d9d9
      border-top 0
      height 600px
  .right_subdiv
    border 1px solid #d9d9d9
    width 92%
    padding 24px 30px 24px 30px
    margin-top 20px
    line-height 60px
    border-radius 5px
    height 707px
    .cust_add_div
      width 100%
      height 50px
      .cust_top_rightspan
        float right
        width 575px
      .cust_add_btn
        margin-left 110px
    .search_cust_input
      width 210px
    .cust_leftdiv
      color #666
      .input_name
        float right
        width 75%
    .cust_lefttxt
      text-align right
      padding-right 10px
    .red_star
      font-size 16px
      color $base-color
      float left
    .add_save_div
      text-align center
  .inputDiv
    float left
    width 95%
  .addTeamDiv
    .el-col
      height 30px
</style>

