<template>
    <div class="carouselBigDiv" v-loading="loading">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
            <el-breadcrumb-item :to="{ path: '/' }">Artist</el-breadcrumb-item>
            <el-breadcrumb-item>推广项目</el-breadcrumb-item>
            <el-breadcrumb-item>轮播设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="text">
            提示：建议使用JPG格式，2M以下图片，尺寸像素1440×604。点击顺序拖动图片可变换轮播图片顺序
        </div>
        <div v-loading.fullscreen.lock="fullscreenLoading"></div>
        <el-button type="primary" plain size="small" :disabled="addCarouBtnTF" @click="addCarouBtn">增加轮播</el-button>
        
        <div>
            <el-row>
                <el-col :span="24">
                    <div class="add_carousel_div" v-show="addCarouselTF">
                        <el-col :span="2">
                            <div class="title_name">
                                标 题：
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <el-input v-model="newCarouselName" placeholder="请输入内容" class="input_350" size="small"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <div class="title_name">
                                轮播时间：
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <div class="block">
                                <el-date-picker
                                v-model="newTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions2"
                                size="small">
                                </el-date-picker>
                            </div>
                        </el-col>
                        <el-col :span="2"></el-col>
                        <el-col :span="22">
                            <div class="hr"/>
                        </el-col>
                        <el-col :span="2">
                            <div class="title_name">
                                轮播图片：
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <div class="img_upload_btn" @click="fileupload">+选择从电脑上传</div>
                            <div class="img_upload_btn" @click="uploaded_file" >+选择已上传图片</div>
                        </el-col>
                        <!-- 新轮播从电脑上传文件 -->
                        <input type="file" ref="newImgInput" v-show="0" @change="newImgUpload" multiple accept="image/*"/>
                    </div>
                    <div class="edit_carousel_div" v-for="item in carouselData.list" :key="item.id">
                        <el-col :span="2">
                            <div class="title_name">
                                标 题：
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <el-input v-model="item.title" placeholder="请输入内容" class="input_350" size="small" @blur="changeItem(item)"></el-input>
                            <span class="carou_delbtn" @click="delcarou(item)"><i class="iconfont">&#xe656;</i></span>
                        </el-col>
                        <el-col :span="2">
                            <div class="title_name">
                                轮播时间：
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <div class="block">
                                <el-date-picker
                                v-model="item.dates"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions2"
                                size="small"
                                @change="changeItem(item)">
                                </el-date-picker>
                            </div>
                        </el-col>
                        <el-col :span="2"></el-col>
                        <el-col :span="22">
                            <div class="hr"/>
                        </el-col>
                        <el-col :span="2">
                            <div class="title_name">
                                轮播图片：
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <div class="carousel_img_div">
                                <el-row>
                                    <el-col  v-for='(subimg,index) in item.carouselImages' :key="index" class="carouselImageDiv">
                                        <div class="carousel_subdiv">
                                            <div class="carou_sub_top">
                                                <div class="carou_sub_num">{{index+1}}</div>
                                                <span class="carou_sub_delbtn" @click="delImgDa(subimg)"><i class="iconfont">&#xe656;</i></span>
                                            </div>
                                            <div class="carou_sub_center">
                                                <img :src="fileAddress+'/'+subimg.imageUrl" class="carou_subcenter_img"/>
                                            </div>
                                            <div class="carou_sub_bottom">
                                                <div>
                                                    <el-select v-model="subimg.type" placeholder="请选择" size="small" @change="changeType(subimg)" style="width:170px">
                                                        <el-option
                                                        v-for="item in options"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <span v-if="subimg.type == 2">
                                                        <el-button type="primary" plain class="carou_sub_selectbtn" @click="selectcarou_btn(subimg)" size="small">选择类别</el-button>
                                                        <div class="carou_subbottom_txt" v-if="modalShow">
                                                            <span v-if="subimg.typeContent != ''"><span class="carou_subbottom_span">已选择类别 : </span>{{subimg.categoryName}}</span>
                                                            <span v-else class="red_font">未选择类别</span>
                                                        </div>
                                                    </span>
                                                    <span v-if="subimg.type == 1">
                                                        <el-button type="primary" plain class="carou_sub_selectbtn" @click="selectonepro(subimg)" size="small">选择单品</el-button>
                                                        <div class="carou_subbottom_txt" v-if="modalShow">
                                                          <div v-if="subimg.typeContent != ''">
                                                              <img :src="[subimg.headImage == null?'/static/imgs/syBg.png':fileAddress+'/'+subimg.headImage]" class="carou_subbottom_img"/>
                                                            <!-- <img src="/static/imgs/syBg.png" class="carou_subbottom_img"/> -->
                                                            <p  v-if="modalShow">{{subimg.productName}}</p>
                                                            <span class="carou_subbottom_span">{{subimg.productNumber}}</span>
                                                          </div>
                                                          <div v-else>
                                                            <img src="/static/imgs/syBg.png" class="carou_subbottom_img"/>
                                                            <p class="red_font">未选择产品</p>
                                                          </div>
                                                        </div>
                                                    </span>
                                                    <div  v-if="subimg.type == 0" class="carou_subbottom_txt">
                                                        <el-input v-model="subimg.typeContent" placeholder="请输入要跳转的网址" size="small" @change="changeUrl(subimg)"></el-input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="img_upload_class">
                                <div class="img_upload_btn" @click="imageUpload(item)">+选择从电脑上传</div>
                                <div class="img_upload_btn" @click="uploadedImage(item)">+选择已上传图片</div>
                            </div>
                        </el-col>
                    </div>
                </el-col>
            </el-row>
            <div class="pagination_div">
                <el-pagination
                background
                :current-page.sync="currentPage"
                :page-sizes="[3, 6, 9]"
                :page-size="pageSize"
                layout="total,sizes, prev, pager, next,jumper"
                :total="promoNumber"
                @current-change="currentChange"
                @size-change="sizeChange"
                >
                </el-pagination>
                
            </div>
            
        </div>
        <!-- 从电脑上传文件 -->
        <input type="file" ref="imgupload_input" v-show="0" @change="imgloadFile" multiple accept="image/*"/>
        <!-- 选择已上传图片 -->
        <el-dialog
        title="选择已上传的图片"
        :visible.sync="uploaded_file_dislog"
        width="1040px">
            <el-row :gutter="20">
              <el-checkbox-group v-model="selectedImgList">
                <el-col :span="8" v-for="item in uploadedImageList" :key="item.id">
                  <div class="img_bigdiv">
                    <div class="img_div">
                      <el-checkbox :label="item.imageUrl">&nbsp;</el-checkbox>
                      <div class="delimgBtn" @click="delimgBtn(item)"><i class="iconfont">&#xe656;</i></div>
                    </div>
                    <img :src="fileAddress+item.imageUrl" class="image">
                  </div>
                </el-col>
              </el-checkbox-group>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploaded_file_dislog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="uploadedSelectImg" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 选择类别弹出框 -->
        <el-dialog
        title="选择推广类别"
        :visible.sync="selectpromo_dialog"
        width="950px">
            <div class="item" v-for="kind in allPromoData" :key="kind.categoryName">
                <div class="parent">
                <el-radio v-model="kind_checked" :label="kind.id">{{kind.categoryName}}</el-radio>
                </div>
                <div class="child" v-show="kind.categoryList.length != 0">
                【 <el-radio v-model="kind_checked" class="childText" :label="child.id" v-for="child in kind.categoryList" :key="child.id">{{ child.categoryName }}</el-radio> 】
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectpromo_dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="selectPromoId()" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 选择单品弹出框 -->
        <el-dialog
        title="选择单品"
        :visible.sync="selectone_dialog"
        width="950px">
            <div>
                <el-input
                    placeholder="请输入内容"
                    v-model="selecone_search" size="small">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div class="proImgDiv">
                  <el-row :gutter="20" v-loading="productLoading">
                      <el-col :span="8" v-for="(item,index) in productData" :key="index">
                          <div class="selectone_img_div" @click="proClickId(item)">
                              <div :class="[item.id==proClickedId  ? 'carouSubbottomImg_border' : 'carouSubbottomImg']">
                                <img :src="[item.headImage != null?fileAddress+item.headImage:'/static/imgs/syBg.png']" />
                                <div class="proImgNum">共{{item.imageCount}}张</div>
                              </div>
                              {{item.productName}}<br/>
                              <span class="carou_subbottom_span">{{item.productNumber}}</span>
                          </div>
                      </el-col>
                  </el-row>
                  <div class="loading">{{proimgText?"正在加载中...":"产品已经加载完成！"}}</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="proCancelFun" size="small">取 消</el-button>
                <el-button type="primary" @click="proClickFun" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除轮播div -->
        <el-dialog
        title="提示"
        :visible.sync="delcarousel_dialog"
        width="30%">
            <span>确认要删除"<span class="red_font">{{delCarouselData.title}}</span>"轮播？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delcarousel_dialog = false">取 消</el-button>
                <el-button type="primary" @click="delThisCarousel">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除轮播中图片 -->
        <el-dialog
        title="提示"
        :visible.sync="delCarouImg"
        width="30%">
            <span>确认要删除轮播选中的图片？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delCarouImg = false">取 消</el-button>
                <el-button type="primary" @click="delCarouImgFun">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import utils from "@/commons/Batar/utils";
export default {
  data() {
    return {
      addCarouBtnTF: false, //增加轮播按钮禁用或有效
      addCarouselTF: false, //打开新增轮播
      carouselData: [], //轮播列表数据

      modalShow:true,//数据打散重新渲染

      newCarouselName: "",
      fullscreenLoading: false, //图片上传加载中
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      newTime: "",
      uploaded_file_dislog: false, //选择已上传图片
      img_checked: false, //选择已上传图片打勾
      currentPage: 1, //分页中当前第几页
      options: [
        //选择轮播属性
        {
          value: 2,
          label: "推广类别"
        },
        {
          value: 1,
          label: "单个产品"
        },
        {
          value: 0,
          label: "网址"
        }
      ],
      value1: "1",
      value2: "2",
      value3: "3",

      promoSourseData: [], //推广类别原始数据
      allPromoData: [], // 推广类别处理后数据
      promoNumber: 0, //分页中推广类别共有多少轮播
      pageSize: 3, //分页中每一页有多少个轮播
      pageNo: 1, //分页中默认为第一页
      kind_checked: "", //推广类别选中项
      selectpromo_dialog: false, //选择类别的弹出框
      selectImgData: [], //选择图片轮片的数据（单品和推广类别要用）
      selectone_dialog: false, //选择单品的弹出框
      selecone_search: "", //选择单品的文字搜索框
      delCarouselData: {}, //选择要删除轮播的数据
      delcarousel_dialog: false, //删除轮播确认弹出框
      selectCarouselData: {}, //选择轮播属性
      delCarouImg: false, //删除轮播中的图片弹出框
      delSelectImgData: {}, //删除轮播中的图片选中数据
      url_input: "", //url跳转网址
      uploadedImageList: [], //已上传图片列表
      selectedImgList: [], //选择已上传图片的数组
      selectedCarouselData: [], //选择单品原轮播ID
      productData: [], //选择单品数据列表
      productAllData: [], //产品接口的整个数据
      productLoading: false, //选择单品加载数据
      proClickedId: "", //已选择单品的ID
      // urlSaveData: [] //轮播图片地址数据保存
      scroll: "", //滚动条高度
      proimgText: true, //产品分页加载显示提示true显示“正在加载中...”，false显示“产品已经加载完成！”
      EventListenerTf: true, //产品分页已加监听，true为未加载监听，false为已加载监听
      loading: true //页面加载中
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      let self = this;
      self.addCarouBtnTF = false; //增加轮播按钮禁用或有效
      self.addCarouselTF = false; //打开新增轮播
      self.newCarouselName = ""; //新轮播名字
      self.newTime = ""; //新轮播播放时间
      self.currentPage = 1; //分页中默认为第一页
      self.carouselLoad(self.pageSize, 1);
    },
    //轮播所有数据
    carouselLoad(size, num) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          size: size
        }
      };
      this.Axios.get("/promotion/carousel", params)
        .then(data => {
          if (data.data.code == 0) {
            self.carouselData = data.data.data;
            self.proDisplayName();
            self.promoNumber = self.carouselData.total;
            self.loading = false;
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
      self.proData();
      self.promoData();
    },
    //所有产品列表数据
    proData() {
      var self = this;
      let params = {
        PRS: {
          page: 1,
          size: 15
        }
      };
      this.Axios.get("/product/product", params)
        .then(data => {
          if (data.data.code == 0) {
            self.productData = data.data.data.list;
            self.productAllData = data.data.data;
            self.productLoading = false;
          }
        })
        .catch(err => {
          this.extCatch(err, this.proData);
        });
    },

    //推广类别数组
    promoData() {
      var self = this;
      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.promoSourseData = data.data.data;
            self.proDisplayName(); //保存推广类别名称
            self.productLoading = false;
          }
        })
        .catch(err => {
          this.extCatch(err, this.promoData);
        });
    },

    //保存轮播图片中的产品和推广类别名字
    proDisplayName() {
      var self = this;

      var contentData = self.carouselData.list;
      for (var i = 0; i < contentData.length; i++) {
        // console.log(contentData[i])
        if (contentData[i].carouselImages.length != 0) {
          for (var j = 0; j < contentData[i].carouselImages.length; j++) {
            //如果轮轓图为单个产品类型为1
            if (contentData[i].carouselImages[j].type == 1) {
              if (contentData[i].carouselImages[j].typeContent != "") {
                var proId = parseInt(
                  contentData[i].carouselImages[j].typeContent
                );
                //读取proBase接口方法
                self.proBase(i, j, proId);
              }
            }
            //如果轮轓图为推广类别类型为2
            if (contentData[i].carouselImages[j].type == 2) {
              var proId = parseInt(
                contentData[i].carouselImages[j].typeContent
              );
              //遍历推广类别
              for (var k = 0; k < self.promoSourseData.length; k++) {
                //一级推广
                if (proId == self.promoSourseData[k].id) {
                  //推广类别的名称
                  contentData[i].carouselImages[j].categoryName =
                    self.promoSourseData[k].categoryName;
                  break;
                }
                if (self.promoSourseData[k].categoryList.length != 0) {
                  for (
                    var p = 0;
                    p < self.promoSourseData[k].categoryList.length;
                    p++
                  ) {
                    if (proId == self.promoSourseData[k].categoryList[p].id) {
                      contentData[i].carouselImages[j].categoryName =
                        self.promoSourseData[k].categoryList[p].categoryName;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    //读取proBase接口方法
    proBase(x, y, elem) {
      var self = this;
      var contentData = self.carouselData.list;
      let params = {
        PRS: {
          ids: [elem]
        }
      };
      this.Axios.get("/product/product/batch/base", params)
        .then(data => {
          if (data.data.code == 0) {
            contentData[x].carouselImages[y].productName =
              data.data.data[0].productName;
            contentData[x].carouselImages[y].productNumber =
              data.data.data[0].productNumber;
            contentData[x].carouselImages[y].headImage =
              data.data.data[0].headImage;
            self.modalShow = false;
            self.modalShow = true;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.proBase);
        });
    },
    //点击增加轮播按钮
    addCarouBtn() {
      var self = this;
      self.addCarouselTF = true;
      self.addCarouBtnTF = true;
    },
    //上传新图片轮播
    fileupload() {
      var self = this;
      if (self.newCarouselName == "" || self.newTime == "") {
        this.$message({
          message: "新增轮播名称或轮播时间不能为空！",
          type: "warning"
        });
        return false;
      }
      self.$refs.newImgInput.click();
    },
    //上传新图片后
    newImgUpload(e) {
      var self = this;
      self.fullscreenLoading = true;
      let formData = new FormData();
      for (var i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }

      formData.append("type", 0);
      this.Axios.post(`${this.fileAddress}/image/upload`, formData).then(
        data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
            var imgList = [];
            for (var j = 0; j < data.data.data.length; j++) {
              imgList.push(data.data.data[j].url);
            }
            let params = {
              title: self.newCarouselName,
              images: imgList,
              dates: self.newTime
            };
            // console.log(params);
            this.Axios.post("/promotion/carousel", params).then(data => {
              self.fullscreenLoading = false;
              if (data.data.code == 0) {
                this.$message({
                  message: "创建轮播成功！",
                  type: "success"
                });
                this.created_fun();
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "warning"
                });
              }
            });
            self.fullscreenLoading = false;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        }
      );
    },
    //删除轮播确认弹出框
    delcarou(elem) {
      var self = this;
      self.delCarouselData = elem;
      self.delcarousel_dialog = true;
    },
    //删除此轮播事件
    delThisCarousel() {
      var self = this;
      var delId = self.delCarouselData.id;
      let params = {
        PRS: {
          indexCarouselId: delId
        }
      };
      this.Axios.delete("/promotion/carousel/" + delId, params).then(data => {
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
        self.created_fun();
        self.delcarousel_dialog = false;
      });
    },
    //轮播中图片上传
    imageUpload(elem) {
      var self = this;
      self.selectCarouselData = elem;
      self.$refs.imgupload_input.click();
    },
    //轮播中已上传图片选择
    uploadedImage(elem) {
      var self = this;
      self.selectCarouselData = elem;
      this.Axios.get("/promotion/carousel/carouselImage")
        .then(data => {
          if (data.data.code == 0) {
            self.uploadedImageList = data.data.data;
            self.uploaded_file_dislog = true;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.uploadedImage);
        });
    },
    //轮播中图片上传后文件
    imgloadFile(e) {
      var self = this;
      self.fullscreenLoading = true;
      let formData = new FormData();
      for (var i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      formData.append("type", 0);
      this.Axios.post(`${this.fileAddress}/image/upload`, formData).then(
        data => {
          if (data.data.code == 0) {
            var imgList = [];
            for (var j = 0; j < data.data.data.length; j++) {
              imgList.push(data.data.data[j].url);
            }
            let params = {
              id: self.selectCarouselData.id,
              images: imgList
            };
            this.Axios.post("/promotion/carousel/carouselImage", params)
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
                self.fullscreenLoading = false;
              })
              .catch(err => {
                this.extCatch(err, this.imgloadFile);
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
    //轮播中删除图片弹出框
    delImgDa(elem) {
      var self = this;
      self.delSelectImgData = elem;
      self.delCarouImg = true;
    },
    //轮播中删除图片事件
    delCarouImgFun() {
      var self = this;
      self.fullscreenLoading = true;
      var delImgId = self.delSelectImgData.id;
      let params = {
        PRS: {
          carouselImageId: delImgId
        }
      };
      this.Axios.delete(
        "/promotion/carousel/carouselImage/" + delImgId,
        params
      ).then(data => {
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
      });

      self.fullscreenLoading = false;
      self.delCarouImg = false;
    },
    //选择已上传图片文件弹出框
    uploaded_file() {
      var self = this;
      self.selectCarouselData = [];
      if (self.newCarouselName == "" || self.newTime == "") {
        this.$message({
          message: "新增轮播名称或轮播时间不能为空！",
          type: "warning"
        });
        return false;
      }

      this.Axios.get("/promotion/carousel/carouselImage")
        .then(data => {
          if (data.data.code == 0) {
            self.uploadedImageList = data.data.data;
            self.uploaded_file_dislog = true;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.uploaded_file);
        });
    },
    //选择类别弹出框
    selectcarou_btn(elem) {
      var self = this;
      self.selectImgData = elem;
      self.kind_checked = parseInt(elem.typeContent);
      this.Axios.get("/promotion/category")
        .then(data => {
          if (data.data.code == 0) {
            self.allPromoData = data.data.data;
            // console.log(self.allPromoData);
          }
        })
        .catch(err => {
          this.extCatch(err, this.selectcarou_btn);
        });
      self.selectpromo_dialog = true;
    },
    //选择推广类别的ID
    selectPromoId(elem) {
      var self = this;
      let params = {
        id: self.selectImgData.id,
        type: 2,
        typeContent: self.kind_checked
      };
      this.Axios.put("/promotion/carousel/carouselImage", params)
        .then(data => {
          if (data.data.code == 0) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
            self.created_fun();
            self.selectpromo_dialog = false;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.selectPromoId);
        });
      // self.selectpromo_dialog = false;
    },
    //选择单品弹出框
    selectonepro(elem) {
      var self = this;
      self.selectedCarouselData = elem;
      self.proClickedId = elem.typeContent;
      self.selectone_dialog = true;

      if (self.EventListenerTf) {
        //监听产品
        setTimeout(function() {
          var Imgdiv = document.getElementsByClassName("proImgDiv")[0];
          Imgdiv.addEventListener("scroll", function() {
            if (this.scrollHeight - this.scrollTop === this.clientHeight) {
              self.proimgText = true;
              var nextPage = self.productAllData.page + 1;
              var pageSize = self.productAllData.size;
              if ((nextPage - 1) * pageSize < self.productAllData.total) {
                let params = {
                  PRS: {
                    page: nextPage,
                    size: pageSize
                  }
                };
                self.Axios.get("/product/product", params).then(data => {
                  if (data.data.code == 0) {
                    var tempData = self.productData.concat(data.data.data.list);
                    self.productData = tempData;
                    self.productAllData = data.data.data;
                  } else {
                    self.$message({
                      message: data.data.msg,
                      type: "warning"
                    });
                  }
                });
              } else {
                self.nextPage = 0;
                self.proimgText = false;
                return false;
              }
            }
            self.EventListenerTf = false;
          });
        }, 50);
      }
    },
    //选择已上传图片数组
    uploadedSelectImg() {
      var self = this;
      if (self.selectCarouselData.id) {
        //轮播中选择已上传的图片
        let params = {
          id: self.selectCarouselData.id,
          images: self.selectedImgList
        };
        this.Axios.post("/promotion/carousel/carouselImage", params)
          .then(data => {
            if (data.data.code == 0) {
              // console.log(data.data.data);
              this.$message({
                message: data.data.msg,
                type: "success"
              });
              self.selectedImgList = [];
              self.uploaded_file_dislog = false;
              self.created_fun();
            } else {
              this.$message({
                message: data.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.extCatch(err, this.uploadedSelectImg);
          });
      } else {
        //新增轮播选择已上传的图片
        let params = {
          title: self.newCarouselName,
          dates: self.newTime,
          images: self.selectedImgList
        };
        this.Axios.post("/promotion/carousel", params)
          .then(data => {
            if (data.data.code == 0) {
              // console.log(data.data.data);
              this.$message({
                message: data.data.msg,
                type: "success"
              });
              self.selectedImgList = [];
              self.uploaded_file_dislog = false;
              self.created_fun();
            } else {
              this.$message({
                message: data.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.extCatch(err, this.uploadedSelectImg);
          });
      }
    },
    //删除已上传的图片
    delimgBtn(elem) {
      var self = this;
      //只余下一张图片，不能被删除
      if (self.uploadedImageList.length == 1) {
        this.$message({
          message: "轮播已上传图片不能为空，此图片不能被删除！",
          type: "warning"
        });
        return false;
      }
      var delIds = [];
      delIds.push(elem.id);
      let params = {
        PRS: {
          ids: delIds
        }
      };
      this.Axios.delete("/promotion/carousel/image", params)
        .then(data => {
          if (data.data.code == 0) {
            self.uploadedImageList = data.data.data;
            this.$message({
              message: "删除已上传图片成功！",
              type: "success"
            });
            self.selectedImgList = [];
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.delimgBtn);
        });
    },
    //修改图片属性的服务类型
    changeType(elem) {
      var self = this;
      let params = {
        id: elem.id,
        type: elem.type,
        typeContent: ""
      };
      this.Axios.put("/promotion/carousel/carouselImage", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data);
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
          this.extCatch(err, this.changeType);
        });
    },
    //修改url地址
    changeUrl(elem) {
      var self = this;
      let params = {
        id: elem.id,
        type: 0,
        typeContent: elem.typeContent
      };
      this.Axios.put("/promotion/carousel/carouselImage", params)
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
          this.extCatch(err, this.changeUrl);
        });
    },
    //选择单品产品id事件
    proClickId(elem) {
      var self = this;
      self.proClickedId = elem.id;
      // console.log(elem);
    },
    //更换单品产品id事件确认事件
    proClickFun() {
      var self = this;
      self.fullscreenLoading = true;
      let params = {
        id: self.selectedCarouselData.id,
        type: 1,
        typeContent: self.proClickedId
      };

      this.Axios.put("/promotion/carousel/carouselImage", params)
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
          self.fullscreenLoading = false;
        })
        .catch(err => {
          this.extCatch(err, this.proClickFun);
        });
      self.productData = [];
      self.productAllData = [];

      self.selectone_dialog = false;
    },
    //选择产品取消按钮
    proCancelFun() {
      var self = this;
      self.selectone_dialog = false;
    },
    //修改名字和修改时间的事件
    changeItem(elem) {
      // console.log(elem);
      let params = {
        id: elem.id,
        title: elem.title,
        dates: elem.dates
      };
      this.Axios.put("/promotion/carousel", params)
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
          this.extCatch(err, this.changeItem);
        });
    },
    //改变分页每页个数
    sizeChange(e) {
      var self = this;
      self.pageSize = e;
      self.carouselLoad(self.pageSize, self.pageNo);
    },
    //改变分页页码
    currentChange(e) {
      var self = this;
      self.pageNo = e;
      self.carouselLoad(self.pageSize, self.pageNo);
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
    margin 8px 0 8px 0
  .topnav
    font-size 1rem
    height 30px
    line-height 2
    padding-left 0
    width 100%
  .input_350
    width 350px
  .iconfont
    font-size 10px
  .carou_delbtn
    float right
    color $font-color
    font-size 20px
    margin-right 8px
    cursor pointer
  .selectone_img_div
    font-size 16px
    margin-top 15px
    cursor pointer
    .carou_subbottom_span
      color $font-color
      font-size 12px
    .carouSubbottomImg_border
      width 98px
      height 74px
      float left
      margin-right 10px
      cursor pointer
      position relative
      border 1px solid red
      border-radius 5px
      img
        width 98px
        height 74px
        border-radius 5px
    .carouSubbottomImg
      width 100px
      height 76px
      float left
      margin-right 10px
      cursor pointer
      position relative
      border-radius 5px
      img
        width 98px
        height 74px
        border-radius 5px
    .proImgNum
      position absolute
      top 61px
      right 0
      margin-top -11px
      background-color #999
      opacity 0.8
      color #ffffff
      font-size 12px
      padding 0 5px
      border-bottom-right-radius 5px
  .add_carousel_div
    margin-top 10px
    width 100%
    border 1px solid #eee
    box-shadow 2px 2px 8px #f2f2f2
    border-radius 5px
    height 240px
    .title_name
      color $font-color
      text-align right
      padding-top 14px
    .el-col
      margin-top 15px
    .carousel_img_div
      margin 8px 0 8px 0
  .edit_carousel_div
    margin-top 10px
    width 100%
    border 1px solid #eee
    box-shadow 2px 2px 8px #f2f2f2
    border-radius 5px
    float left
    .el-col
      margin-top 15px
    .carousel_subdiv
      width 96%
      height 300px
      border 1px solid #eee
      box-shadow 2px 2px 8px #f2f2f2
      border-radius 3px
      .carou_sub_top
        height 30px
        .carou_sub_num
          width 11px
          height 11px
          background-color #b6b6b6
          border-bottom-right-radius 10px
          border-top-left-radius 3px
          padding 7px
          color #ffffff
          float left
        .carou_sub_delbtn
          float right
          color $font-color
          padding 5px
          font-size 16px
          margin-right 6px
          cursor pointer
      .carou_sub_center
        padding 10px
        height 120px
        .carou_subcenter_img
          width 100%
          height 130px
      .carou_sub_bottom
        padding 10px
        height 110px
        font-size 16px
        .carou_sub_selectbtn
          float right
        .carou_subbottom_txt
          padding-top 10px
          line-height 22px
          font-size 14px
          .carou_subbottom_span
            color $font-color
        .carou_subbottom_img
          width 78px
          height 60px
          float left
          margin-right 5px
          border-radius 3px
  .title_name
    color $font-color
    text-align right
    padding-top 14px
  .carousel_img_div
    margin 8px 0 8px 0
    .carouselImageDiv
      width 340px
      height 300px
      float left
      margin-right 40px
  .img_upload_class
    text-align center
    width 400px
    margin 20px auto
    height 60px
  .img_upload_btn
    margin-right 16px
    width 170px
    border 1px dashed $base-color
    color $base-color
    font-size 12px
    text-align center
    height 22px
    float left
    border-radius 3px
    padding-top 8px
    cursor pointer
  .img_bigdiv
    width 320px
    height 160px
    margin 8px 0 8px 0
    border-radius 5px
    .image
      width 320px
      height 160px
      border 1px solid #ddd
      border-radius 5px
    .img_div
      position absolute
      width 320px
      height 160px
      label
        margin-left 7px
      .delimgBtn
        width 20px
        height 20px
        background-color #fff
        color $base-color
        text-align center
        float right
        cursor pointer
        margin 1px -1px 0px 0px
        border-top-right-radius 4px
        border-bottom-left-radius 5px
      .img_del_but
        float right
  .pagination_div
    text-align center
    margin 8px 0 8px 0
  .item
    width 100%
    margin-bottom 30px
    display flex
    align-items top
    .child .el-radio
      color #999
    .text
      white-space nowrap
  .proImgDiv
    max-height 430px
    overflow-y auto
    overflow-x hidden
    .loading
      text-align center
      padding 20px
</style>


