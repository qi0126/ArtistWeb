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
                            <el-button type="primary" plain class="baibtn" @click="addpromo_dialog = true" size="small">新增推广展示</el-button>
                        </div>
                        <el-menu
                        class="el-menu-vertical-demo" size="small">
                            <el-menu-item :index="menu.id" v-for="menu in menu_data" :key="menu.id">
                                <div @mouseover="menu_over(menu)">
                                    <span slot="title">{{menu.value}}</span>
                                    <i v-show="overId == menu.id" class="el-icon-delete delIcon" @click="del_promomenu(menu.id)"/>
                                </div>
                            </el-menu-item>
                        </el-menu>
                    </div>
                </el-aside>
                <el-main>
                    <div>
                        <span class="redfont">展示设置</span>
                    </div>
                    <div class="right_bigdiv">
                        <div>
                            展示方式:
                            <el-select v-model="dispmode_value" placeholder="请选择" size="small">
                                <el-option
                                v-for="item in dispmode_data"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <br/><br/>
                            <span class="upload_f" >
                                展示数量
                                <el-select v-model="dispmode_num" v-show="dispmode_value == '1'" ref="modenum_select" placeholder="请选择" @change="num_select">
                                    <el-option
                                    v-for="item in dispmode_num_data"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value" size="small">
                                    </el-option>
                                </el-select>
                            </span>
                            <div ref="title_disp" v-show="dispmode_value == '1'">
                                <img src="/static/imgs/promo_img.png" @click="title_upload"/>
                                <input type="file" ref="title_upload" @change="title_uploaded" class="upload_f"/>
                                <br/>
                                <div align="center">点击上传封面图片，图片比例为2:1</div>
                            </div>
                            <div ref="pro_disp" v-show="dispmode_value == '2'">
                                <el-row :gutter="20">
                                    <el-col :span="6">
                                        <div class="pro_display">
                                            <img src="/static/imgs/test.png" class="proimg"/><br/>
                                            <p>平口密蕊手镯</p>
                                            <p class="huifont">2525054546-1</p>
                                            <p><el-button size="small" class="baibtn" @click="pro_change_dialog = true">更换产品</el-button></p>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="pro_display">
                                            <img src="/static/imgs/test.png" class="proimg"/><br/>
                                            <p>平口密蕊手镯</p>
                                            <p class="huifont">2525054546-1</p>
                                            <p><el-button size="small" class="baibtn" @click="pro_change_dialog = true">更换产品</el-button></p>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="pro_display">
                                            <img src="/static/imgs/test.png" class="proimg"/><br/>
                                            <p>平口密蕊手镯</p>
                                            <p class="huifont">2525054546-1</p>
                                            <p><el-button size="small" class="baibtn" @click="pro_change_dialog = true">更换产品</el-button></p>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div class="pro_display">
                                            <img src="/static/imgs/test.png" class="proimg"/><br/>
                                            <p>平口密蕊手镯</p>
                                            <p class="huifont">2525054546-1</p>
                                            <p><el-button size="small" class="baibtn" @click="pro_change_dialog = true">更换产品</el-button></p>
                                        </div>
                                    </el-col>
                                
                                </el-row>
                                <el-dialog
                                title="更换产品"
                                :visible.sync="pro_change_dialog"
                                width="950px">
                                    <el-row>
                                        <el-col :span="8">
                                            <div class="pro_img_div">
                                                <img src="/static/imgs/test.png" class="pro_img_list"></img>
                                                <div class="pro_img_txt">
                                                    平面密口手镯<br/>
                                                    2456465789-1
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="pro_img_div">
                                                <img src="/static/imgs/test.png" class="pro_img_list"></img>
                                                <div class="pro_img_txt">
                                                    平面密口手镯<br/>
                                                    2456465789-1
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="pro_img_div">
                                                <img src="/static/imgs/test.png" class="pro_img_list"></img>
                                                <div class="pro_img_txt">
                                                    平面密口手镯<br/>
                                                    2456465789-1
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="pro_img_div">
                                                <img src="/static/imgs/test.png" class="pro_img_list"></img>
                                                <div class="pro_img_txt">
                                                    平面密口手镯<br/>
                                                    2456465789-1
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="pro_img_div">
                                                <img src="/static/imgs/test.png" class="pro_img_list"></img>
                                                <div class="pro_img_txt">
                                                    平面密口手镯<br/>
                                                    2456465789-1
                                                </div>
                                            </div>
                                        </el-col>
                                        
                                    </el-row>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="pro_change_dialog = false" size="small">取 消</el-button>
                                        <el-button type="primary" @click="pro_change_dialog = false" size="small">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </div>
                        </div>
                    </div>


                </el-main>

                
                <el-dialog
                title="提示"
                :visible.sync="addpromo_dialog"
                width="950px">
                    <div class="item" v-for="kind in allKinds" :key="kind.parent">
                        <div class="parent">
                            <el-checkbox v-model="kind_checked" :label="kind.parent">{{kind.parent}}</el-checkbox>
                        </div>
                        <div class="child" v-show="kind.childs.length > 0">
                            【 <el-checkbox v-model="kind_checked" class="childText" :label="child" v-for="child in kind.childs" :key="child">{{ child }}</el-checkbox> 】
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addpromo_dialog = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="addpromo_dialog = false" size="small">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog
                title="提示"
                :visible.sync="delpromomenu_dialog"
                width="30%">
                    <span>确定要删除此类别?</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="delpromomenu_dialog = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="delpromomenu_dialog = false" size="small">确 定</el-button>
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
      //推广类虽菜单
      menu_data: [
        {
          id: "1",
          value: "人气产品"
        },
        {
          id: "2",
          value: "新款产品"
        },
        {
          id: "3",
          value: "推荐产品"
        },
        {
          id: "4",
          value: "丝丝心动系列"
        }
      ],
      overId: "",
      addpromo_dialog: false, //新增推广类别弹出框
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
      kind_checked: "子类7",

      delpromomenu_dialog: false, //推广类别弹出框
      dispmode_data: [
        {
          //推广类别接口数据
          value: "1",
          label: "封面展示"
        },
        {
          value: "2",
          label: "产品展示"
        }
      ],
      dispmode_value: "1", //推广类别选中方式
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
      pro_change_dialog: false //更换产品弹出框
    };
  },
  methods: {
    //推广展示类别鼠标移入
    menu_over(elem) {
      var self = this;
      self.overId = elem.id;
    },
    //点击推广类虽菜单删除
    del_promomenu(id) {
      // console.log(id);
      var self = this;
      self.delpromomenu_dialog = true;
    },
    //封面展示点击图片文件上传
    title_upload() {
      var self = this;
      self.$refs.title_upload.click();
    },
    //封面展示点击文件上传后
    title_uploaded() {
      var self = this;
      console.log(self.$refs.title_upload.value);
    },
    //修改产品推广数据
    num_select() {}
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
        display none
        width 350px
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
            height 729px
            line-height 26px
            border-radius 5px
            .el-menu
                border-right 0
            img
                border 0
                max-width 960px
                width 96%
            .pro_display
                border 1px solid $border-color
                box-shadow 2px 2px 8px $border-color
                text-align center
                border-radius 5px
                padding 10px
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
                    float left
                .pro_img_txt
                    width 190px
                    float left
                    margin-left 10px
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
      