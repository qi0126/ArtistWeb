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
          <el-button type="primary" class="newApp" size="small">接收新版本APP</el-button>
        </div>
        <div>
          <el-table
            :data="newAppTable"
            border
            style="width: 100%"
            size="small"
            >
            <el-table-column
              prop="name"
              label="平台"
              align="center">
              <template slot-scope="scope">
                  <el-select v-model="scope.row.name" placeholder="请选择" size="small">
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
              prop="appVer"
              label="版本号"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.appVer" placeholder="请输入版本号" size="small"></el-input>
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
                <el-radio v-model="scope.row.upgrade" label="1">是</el-radio>
                <el-radio v-model="scope.row.upgrade" label="0">否</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="引导页"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.content == '0'" @click="editStarPage" class="StartPageText">添加</span>
                <span  v-else @click="editStarPage" class="StartPageText">编辑/预览</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="business"
              label="业务类型"
              align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  size="small"
                  v-model="scope.row.business">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="operate"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button size="small">取 消</el-button>
                <el-button  size="small" type="primary">发 布</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-dialog
            title="引导页编辑"
            :visible.sync="startPagedialog"
            width="1000px">
            <div>
              <el-row>
                <el-col :span="4" v-for="(item,index) in 5" :key="index"><img src="\static\imgs\startPromoImg.png" class="imgDisplay" /></el-col>
                <el-col :span="4">
                  <div class="addImgDiv" @click="uploadImg">
                    <i class="iconfont">&#xe67f;</i><br/>
                    点击上传图片<br/>
                    建议尺寸720*1280
                  </div>
                  <input type="file" ref="imgUploadInput" v-show="0" @change="uploadedImg"/>
                </el-col>
              </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="startPagedialog = false">取 消</el-button>
              <el-button type="primary" @click="startPagedialog = false">保 存</el-button>
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
              prop="number"
              label="序"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="平台"
              align="center">
            </el-table-column>
            <el-table-column
              prop="appVer"
              label="版本号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="url"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop="upgrade"
              label="强制升级"
              align="center">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.upgrade" label="1">是</el-radio>
                <el-radio v-model="scope.row.upgrade" label="0">否</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="引导页"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.content == '0'" @click="editStarPage" class="StartPageText">添加</span>
                <span  v-else @click="editStarPage" class="StartPageText">编辑/预览</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="发布时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="business"
              label="发布说明"
              align="center">
            </el-table-column>
            <el-table-column
              prop="operate"
              label="操作"
              align="center">
              <template slot-scope="scope">
                 <el-button  size="small" type="primary">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //新增APP管理数据
      newAppTable: [
        {
          name: "1",
          appVer: "",
          url: "",
          upgrade: "1",
          content: "0",
          business: "1、强制升级\n2、修复bug",
          time: "2018-01-01 10:00",
          operate: ""
        }
      ],
      startPagedialog: false, //新增引导页弹出框
      tableData: [
        {
          number: "1",
          name: "Android",
          appVer: "1.4.3",
          url: "URL地址",
          upgrade: "1",
          content: "0",
          business: "1、强制升级\n\r2、修复bug",
          time: "2018-01-01 10:00",
          operate: ""
        },
        {
          number: "2",
          name: "IOS",
          appVer: "1.4.3",
          url: "URL地址",
          upgrade: "0",
          content: "1",
          business: "1、强制升级\n\r2、修复bug",
          time: "2018-01-01 10:00",
          operate: ""
        }
      ],
      appVerData: [
        {
          value: "1",
          label: "IOS"
        },
        {
          value: "2",
          label: "Android"
        }
      ],
      appValue: "1"
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {},
    //引导页弹出框
    editStarPage() {
      var self = this;
      self.startPagedialog = true;
    },
    //引导图片上传触发input事件
    uploadImg(){
      var self = this;
      this.$refs.imgUploadInput.click()
    },
    //引导图片上传后
    uploadedImg(e){
      console.log(e)
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
  .imgDisplay
    width 150px
    height 265px
    border-radius 3px
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
      font-size:30px
</style>