<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>APP升级管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>

        <div class="redfont">
          添加新版本
          <!-- <el-button type="primary" class="newApp" size="small" @click="receiveNewVersion">接收新版本APP</el-button> -->
        </div>
        <div>
          <el-table
            :data="newAppTable"
            border
            style="width: 100%"
            size="small"
            >
            <el-table-column
              prop="appType"
              label="平台"
              align="center">
              <template slot-scope="scope">
                  <el-select v-model="scope.row.appType" placeholder="请选择" size="small" @change="appTypeChange">
                  <el-option
                    v-for="item in appVerData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="version"
              label="版本号"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.version" placeholder="请输入版本号" size="small" class="inputCenter">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="url"
              label="地址"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.url" placeholder="请输入版本地址" size="small"></el-input>
              </template>

            </el-table-column>
            <el-table-column
              prop="upgrade"
              label="是否强制升级"
              align="center">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.isForce" :label="true">是</el-radio>
                <el-radio v-model="scope.row.isForce" :label="false">否</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="引导页"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.appversionImages.length == 0" @click="editStarPage(scope.row)" class="StartPageText" >添加</span>
                <span  v-else @click="editStarPage(scope.row)" class="StartPageText">编辑/预览</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="business"
              label="发布说明"
              align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  size="small"
                  v-model="scope.row.updateContent">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="operate"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button size="small" @click="cancel(scope.row)">取 消</el-button>
                <el-button size="small" type="primary" @click="submit(scope.row)" :disabled="scope.row.url.length == 0 || scope.row.version.length == 0 || scope.row.updateContent.length == 0">发 布</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-dialog
            title="引导页编辑"
            :visible.sync="startPagedialog"
            width="1000px">
            <div>
              <el-row>
                <el-col :span="4" v-for="(item,index) in imgData" :key="index">
                  <div class="img_bigdiv" @mouseover="img_over(item)">
                    <div class="imgDisplay" v-bind:style="{'background-image':'url('+fileAddress+'/'+item+')'}">
                      <div class="delImgDiv" v-show="imgOverId == item" @click="delImgId(item)">
                        <img src="/static/imgs/del_icon.png" class="ImgPng"/>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="addImgDiv" @click="uploadImg" v-if="imgData.length < 6">
                    <i class="iconfont">&#xe67f;</i><br/>
                    点击上传图片<br/>
                    建议尺寸720*1280
                  </div>
                  <input type="file" ref="imgUploadInput" v-show="0" @change="uploadedImg" multiple accept="image/*"/>
                </el-col>
              </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveNewAppImg" size="small">关 闭</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="引导页查看"
            :visible.sync="lookPageImgdialog"
            width="1000px">
            <div>
              <el-row>
                <el-col :span="4" v-for="(item,index) in imgData" :key="index">
                  <div class="img_bigdiv">
                    <div class="imgDisplay" v-bind:style="{'background-image':'url('+fileAddress+'/'+item.image+')'}"/>
                  </div>
                </el-col>
              </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="lookPageImgdialog = false" size="small">关闭</el-button>
            </span>
          </el-dialog>

        </div>
        <div class="redfont top">历史版本</div>
        <div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            size="small"
            >
            <el-table-column
              type="index"
              label="序"
              align="center">
            </el-table-column>
            <el-table-column
              prop="appType"
              label="平台"
              align="center">
            </el-table-column>
            <el-table-column
              prop="version"
              label="版本号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="url"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              label="强制升级"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isForce">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="引导页"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.appversionImages.length == 0">无</span>
                <span  v-else @click="lookStarPage(scope.row)" class="StartPageText">预览</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="发布时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="updateContent"
              label="发布说明"
              align="center">
            </el-table-column>
            <el-table-column
              prop="operate"
              label="操作"
              align="center">
              <template slot-scope="scope">
                 <el-button  size="small" type="primary" @click="delAppVersion(scope.row)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="fenpage">
            <el-pagination
              @size-change="sizeChange"
              @current-change="numChange"
              :current-page="pageNum"
              :page-sizes="[10, 20 , 30 , 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageSum"
              background>
            </el-pagination>
          </div>

        </div>
	    </div>
    </div>
</template>
<script>
//取消创建一个空的数据
const cancelAppTable = {
  id: -1,
  appType: "iOS",
  version: "",
  updateContent: "",
  isForce: false,
  url: "",
  platformCustomerId: -1,
  isPublish: 0,
  publishAccountId: null,
  publishTime: null,
  createTime: "",
  appversionImages: []
};
export default {
  data() {
    return {
      //新增APP管理数据
      newAppTable: [
        {
          id: -1,
          appType: "iOS",
          version: "",
          updateContent: "",
          isForce: false,
          url: "",
          platformCustomerId: -1,
          isPublish: 0,
          publishAccountId: null,
          publishTime: null,
          createTime: "",
          appversionImages: []
        }
      ],
      startPagedialog: false, //新增引导页弹出框
      lookPageImgdialog: false, //已发布app版本引导页弹出框
      tableData: [], //已发布app历史版本
      imgData: [], //新增引导页图片数组
      imgOverId: "", //鼠标移上去图片ID
      appSelected: {},
      appVerData: [
        {
          value: "iOS",
          label: "iOS"
        },
        {
          value: "Android",
          label: "Android"
        }
      ],
      appValue: "iOS",
      pageNum: 1, //分页默认是第一页
      pageSize: 0, //分页默认为每页15条
      pageSum: 0 //分页的总记录数
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.APPSersion(1, 10);
    },
    //历史APP版本列表
    APPSersion(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          size: size
        }
      };
      this.Axios.get("/platform/appVersion/customer", params)
        .then(data => {
          if (data.data.code == 0) {
            // self.pageSum = data.data.data.total;
            self.tableData = data.data.data.list;
            self.pageSum = data.data.data.total;
            self.pageSize = size;
            self.pageNum = num;
          }
        })
        .catch(err => {
          this.extCatch(err, this.APPSersion);
        });
    },
    //接收新版本APP按钮
    receiveNewVersion() {
      var self = this;
      this.Axios.get("/platform/appVersion/receive")
        .then(data => {
          if (data.data.code == 0) {
            for (var i in data.data.data) {
              self.newAppTable = [];
              if (data.data.data[i].isPublish == 0) {
                self.newAppTable.push(data.data.data[i]);
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.receiveNewVersion);
        });
    },
    //引导页弹出框
    editStarPage(elem) {
      var self = this;
      self.imgData = elem.appversionImages;
      self.appSelected = elem;
      self.startPagedialog = true;
    },
    //已发布app引导页查看弹出框
    lookStarPage(elem) {
      var self = this;
      self.imgData = elem.appversionImages;
      self.appSelected = elem;
      self.lookPageImgdialog = true;
    },
    //引导图片上传触发input事件
    uploadImg() {
      var self = this;
      this.$refs.imgUploadInput.click();
    },
    //引导图片上传后
    uploadedImg(e) {
      var self = this;
      let formData = new FormData();
      formData.append("type", 0);
      for (var i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      this.Axios.post(`${this.fileAddress}/image/upload`, formData).then(
        data => {
          if (data.data.code == 0) {
            var tempLength = self.imgData.length + data.data.data.length;
            if (tempLength > 6) {
              this.$message({
                message: "引导图最多只能播放6张，多余将不会被显示！",
                type: "warning"
              });
            }
            for (var j in data.data.data) {
              if (self.imgData.length < 6) {
                var addTF = true;//可以添加引导图
                for (var k in self.imgData) {
                  if (self.imgData[k] == data.data.data[j].url) {
                    addTF = false;//如果有重复的图将不能被添加
                  }
                }
                if (addTF) {
                  self.imgData.push(data.data.data[j].url);
                } else {
                  this.$message({
                    message: '引导图不能重复，重复的图将不能被添加！',
                    type: "warning"
                  });
                }
              }
            }
            if (self.appSelected.id == -1) {
              //发布新的app版本
              self.appSelected.appversionImages = self.imgData;
            }
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        }
      );
      //初始化文件输入框
      self.$refs.imgUploadInput.value = "";
    },
    //图片保存
    saveNewAppImg() {
      var self = this;
      self.startPagedialog = false;
    },
    //取消发布，数据初始化为空
    cancel(elem) {
      var self = this;
      self.newAppTable = [];
      //清空数据初始数据化
      var tempObj = {
        id: -1,
        appType: "iOS",
        version: "",
        updateContent: "",
        isForce: false,
        url: "",
        platformCustomerId: -1,
        isPublish: 0,
        publishAccountId: null,
        publishTime: null,
        createTime: "",
        appversionImages: []
      };
      self.newAppTable.push(tempObj);
    },
    //发布确认按钮
    submit(elem) {
      var self = this;
      // console.log(elem);
      var versionTxt = elem.version.replace(/\s+/g, "");
      var urlTxt = elem.url.replace(/\s+/g, "");
      if (versionTxt == "" || urlTxt == "") {
        this.$message({
          message: "版本号和地址不能空,请重新输入！",
          type: "warning"
        });
        return false;
      }
      if (elem.id == -1) {
        let params = {
          appType: elem.appType, //app平台
          version: elem.version, //app版本
          url: elem.url, //app地址
          isForce: elem.isForce, //app是否强制更新
          images: elem.appversionImages, //app引导页图片
          updateContent: elem.updateContent //app
        };

        this.Axios.post("/platform/appVersion", params)
          .then(data => {
            if (data.data.code == 0) {
              // console.log(data.data.data);
              self.newAppTable.length = 0;
              self.newAppTable = [];
              //清空数据初始数据化
              var tempObj = {
                id: -1,
                appType: "iOS",
                version: "",
                updateContent: "",
                isForce: false,
                url: "",
                platformCustomerId: -1,
                isPublish: 0,
                publishAccountId: null,
                publishTime: null,
                createTime: "",
                appversionImages: []
              };
              self.newAppTable.push(tempObj);
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
            this.extCatch(err, this.submit);
          });
      }
    },
    //删除历史发布版本
    delAppVersion(elem) {
      var self = this;
      this.$confirm(
        `确认删除‘${elem.appType}  V${elem.version}’版本吗？`
      ).then(_ => {
        this.Axios.delete("/platform/appVersion/" + elem.id)
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
            this.extCatch(err, this.delAppVersion);
          });
      });
    },
    //分页每页显示几条记录修改
    sizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.APPSersion(1, val);
    },
    //分页切换到第几页
    numChange(val) {
      this.APPSersion(val, this.pageSize);
    },
    //鼠标移上去的事件
    img_over(elem) {
      this.imgOverId = elem;
    },
    //删除已上传的图片
    delImgId(elem) {
      var self = this;
      if (self.appSelected.id == -1) {
        //新建版本图片
        for (var i in self.imgData) {
          if (self.imgData[i] == elem) {
            self.imgData.splice(i, 1);
          }
        }
        self.appSelected.appversionImages = self.imgData;
      }
    },
    //修改App类型
    appTypeChange() {
      this.newAppTable[0].isForce = false;
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
    .newApp
      float right
      margin-bottom 15px
      margin-top -7px
  .red_font
    color $base-color
  .top
    margin-top 15px
  .StartPageText
    color $base-color
    cursor pointer
  .img_bigdiv
    width 150px
    height 265px
    cursor pointer
    .imgDisplay
      width 148px
      height 263px
      border-radius 3px
      border 1px solid #ddd
      background-size 148px 263px
      position absolute
    .delImgDiv
      width 20px
      height 20px
      right 0
      position absolute
      .ImgPng
        float right
  .addImgDiv
    width 148px
    height 173px
    border 1px dashed $base-color
    border-radius 3px
    cursor pointer
    text-align center
    font-size 14px
    color $base-color
    padding-top 90px
    .iconfont
      font-size 30px
  .fenpage
    text-align center
    padding 20px
  .inputCenter
    text-align center
    input
      text-align center
</style>