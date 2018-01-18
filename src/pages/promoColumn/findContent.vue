<template>
    <div class="carouselBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
          <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
            <el-breadcrumb-item>推广项目</el-breadcrumb-item>
            <el-breadcrumb-item>发现内容</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" plain @click="addfind_btn" size="small">新增内容</el-button>
        <div class="text">提示：ppt文档支持 pptl、pptx格式，word文档支持 docl、docx格式，视频支持 mkv、ogg、wmv、mp4、mpg格式！</div>
        <br/><br/>
        <div>
            <el-table
            :data="tableData"
            height="750"
            border
            v-loading="loading"
            style="width: 100%">
              <el-table-column
                prop="createTime"
                align="center"
                header-align="center"
                label="发布时间">
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                label="发布标题">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.title" :maxlength='16' placeholder="请输入内容" size="small" @blur="changeContent(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                prop="address"
                label="上传类型">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.upType" placeholder="请选择" size="small" @change="changeUpload(scope.row)">
                          <el-option
                          v-for="item in uploaddataSelectData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          </el-option>
                      </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                label="发布内容">
                <template slot-scope="scope">
                    <el-button size="small" v-if="scope.row.upType != '0' && scope.row.content != ''" @click="uploadFileBtn(scope.row)">{{scope.row.content}}</el-button>
                    <el-button size="small" v-if="scope.row.upType != '0' && scope.row.content == ''" @click="uploadFileBtn(scope.row)" type="primary" plain>内容未选择</el-button>
                    <el-input v-model="scope.row.content" v-if="scope.row.upType == '0'" placeholder="请输入内容地址" size="small" @blur="changeContent(scope.row)"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                label="封面">
                <template slot-scope="scope">
                  <div v-if="scope.row.imageUrl == ''" class="title_text" @click="uploadimg(scope.row)">
                      点击上传<br/>
                      图片比例16：9
                  </div>
                  <div v-else>
                    <img :src="fileAddress+scope.row.imageUrl" class="title_img" @click="uploadimg(scope.row)"/>
                  </div>
                </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                label="是否显示">
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.isShow" @change="changeContent(scope.row)">
                            <el-radio :label='true'>是</el-radio>
                            <el-radio :label='false'>否</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                header-align="center"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <span v-if="scope.row.upType == '0' || scope.row.upType == '1'">
                    <el-button type="primary" plain @click="contentClick(scope.row)" size="small" v-if="scope.row.content != ''">预览</el-button>
                    <el-button type="primary" plain size="small" v-else disabled>预览</el-button>
                  </span>
                  <span v-if="scope.row.upType == '2' || scope.row.upType == '3'">
                    <a type="button" :href="scope.row.contentUrl" v-if="scope.row.content != ''">
                      <el-button type="primary" plain size="small">下载</el-button>
                    </a>
                    <el-button type="primary" plain size="small" v-else disabled>下载</el-button>
                  </span>
                  <el-button type="primary" size="small"  @click="delContent(scope.row)">删除</el-button>
                </template>
                </el-table-column>
                
            </el-table>
            <!-- 预览弹出框开始 -->
            <el-dialog
              title="预览"
              :visible.sync="previewDialog"
              width="960px">
              <!-- {{selectIdData.upType}}<br/> -->
              <!-- 链接网址 -->
              <iframe :src="selectIdData.contentUrl" style="width: 900px; height: 600px;text-align:center" v-if="selectIdData.upType == 0"/>
              <!-- 视频文件 -->
              <video :src="selectIdData.contentUrl" controls="controls" v-if="selectIdData.upType == 1" style="max-width:600px;object-fit: fill;margin:0 auto">
                您的浏览器不支持 video 标签。
              </video>
              <!-- word文档 -->
              <iframe :src="selectIdData.contentUrl" style="width: 900px; height: 600px;text-align:center" v-if="selectIdData.upType == 2"/>
              <!-- ppt文件 -->
              <iframe :src="selectIdData.contentUrl" style="width: 900px; height: 600px;text-align:center" v-if="selectIdData.upType == 3"/>
              <br/>
              <!-- <span>{{selectIdData.contentUrl}}</span> -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="previewDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="previewDialog = false" size="small">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 文件上传input -->
            <input type="file" ref="uploadFileInput" @change="uploadFileFun" v-show="0" accept="video/*,.mkv,.doc,.docx,.ppt,.pptx"/>
            <!-- 封面图片上传input -->
            <input type="file" ref="uploadImgInput" @change="uploadimg_fun" v-show="0" accept="image/*"/>
        </div>
    </div>
        
</template>

<script>
export default {
  data() {
    return {
      tableData: [], //发现内容数据
      pageNum: 1, //页码，默认为1
      pageSize: 15, //每页显示多少条内容
      pageSum: 0, //内容总多少条
      tempElem: {},
      //上传内容方式
      uploaddataSelectData: [
        {
          id: 0,
          name: "转载链接"
        },
        {
          id: 1,
          name: "视频文件"
        },
        {
          id: 2,
          name: "word文档"
        },
        {
          id: 3,
          name: "PPT文档"
        }
      ],
      previewDialog: false, //预览弹出框
      selectIdData: {}, //选中id数据
      loading: true //网页加载中
    };
  },
  created() {
    this.create_fun();
  },
  methods: {
    create_fun() {
      var self = this;
      self.tableData = [];
      self.findDataList(self.pageNum, self.pageSize);

      setTimeout(function() {
        var Imgdiv = document.getElementsByClassName("is-scroll-left")[0];
        Imgdiv.addEventListener("scroll", function() {
          if (this.scrollHeight - this.scrollTop === this.clientHeight) {
            if (self.pageNum * self.pageSize < self.pageSum) {
              self.pageNum++;
              self.findDataList(self.pageNum, self.pageSize);
            }
          }
        });
      }, 50);
    },
    //发现内容分页读取事件
    findDataList(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          size: size
        }
      };
      this.Axios
        .get("/content/content", params)
        .then(data => {
          if (data.data.code == 0) {
            self.tableData = self.tableData.concat(data.data.data.list);
            self.pageSum = data.data.data.total;
            self.loading = false;
          }
        })
        .catch(err => {
          this.extCatch(err, this.findDataList);
        });
    },
    //预览弹出框内容显示
    contentClick(elem) {
      // console.log(elem);
      var self = this;
      self.selectIdData = elem;
      // self.previewUrl = elem.contentUrl;
      self.previewDialog = true;
    },
    //新建内容
    addfind_btn() {
      var self = this;
      this.Axios
        .post("/content/content")
        .then(data => {
          if (data.data.code == 0) {
            // self.tableData.push(data.data.data);
            this.create_fun();
          }
        })
        .catch(err => {
          this.extCatch(err, this.addfind_btn);
        });
    },
    //上传封面打开文件输入框事件
    uploadimg(elem) {
      var self = this;
      self.tempElem = elem;
      self.$refs.uploadImgInput.click();
    },
    //上传封面文件后事件
    uploadimg_fun(e) {
      var self = this;
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("type", 0);

      this.Axios
        .post(`${this.fileAddress}/image/upload`, formData)
        .then(data => {
          if (data.data.code == 0) {
            self.tempElem.imageUrl = data.data.data[0].url;
            self.changeContent(self.tempElem);
            this.$message({
              message: "封面上传成功！",
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
          this.extCatch(err, this.uploadimg_fun);
        });
    },
    //删除发现内容
    delContent(elem) {
      // console.log(elem.id);
      this.$confirm("确认要删除‘" + elem.title + "’的内容？")
        .then(_ => {
          this.Axios
            .delete("/content/content/" + elem.id)
            .then(data => {
              if (data.data.code == 0) {
                this.create_fun();
              }
            })
            .catch(err => {
              this.extCatch(err, this.delContent);
            });
        })
        .catch(_ => {});
    },
    //修改发现内容
    changeContent(elem) {
      var self = this;
      var str = elem.content;
      var URLRexExp = new RegExp(
        /^[A-Za-z]+:\/\/[A-Za-z0-9-_]+.[A-Za-z0-9-_%&\?\/.:=]+$/
      );
      if (URLRexExp.test(str) != true) {
        this.$message({
          message: "网址不合法，请重新输入！",
          type: "warning"
        });
        // elem.contentUrl = ""
        // self.changeUpload(elem)
        return false;
      }

      this.Axios
        .put("/content/content", elem)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            this.create_fun();
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.changeContent);
        });
    },
    //改变上传方类
    changeUpload(elem) {
      var self = this;
      // console.log(elem)
      elem.content = "";
      elem.contentUrl = "";
      self.changeContent(elem);
    },
    //文件上传打开输入框
    uploadFileBtn(elem) {
      var self = this;
      self.tempElem = elem;
      self.$refs.uploadFileInput.click();
    },
    //文件上传
    uploadFileFun(e) {
      var self = this;
      self.loading = true;
      // console.log(e);
      // console.log(self.tempElem);
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("type", self.tempElem.id);
      this.Axios
        .post("zuul/content/content/" + self.tempElem.id, formData)
        .then(data => {
          if (data.data.code == 0) {
            // self.loading = false;
            // console.log(data.data.data);
            this.$message({
              message: "文件上传成功！",
              type: "success"
            });
            self.create_fun();
          }

          if (data.data.code) {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
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
  .text
    float right
    width 900px
    font-size 14px
    color $font-color
    text-align right
  input
    text-align center
  .title_text
    background-color #f2f2f2
    color #a6a6a6
    font-size 14px
    text-align center
    border-radius 3px
    cursor pointer
    height 60px
    width 120px
    margin 0 auto
    padding-top 5px
  .title_img
    background-color #f2f2f2
    color #a6a6a6
    font-size 14px
    text-align center
    border-radius 3px
    cursor pointer
    height 60px
    width 120px
    margin 0 auto
</style>


        