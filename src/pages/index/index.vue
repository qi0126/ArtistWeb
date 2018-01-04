<template>
  <div class="index">
    <div class="headerWrapper">
      <div class="headerLeft">
        <i class="iconfont logoIcon"></i>
        <span class="title">Artist 后台管理系统</span>
      </div>
      <div class="headerRight">
        <img src="static/imgs/test2.png" class="noLoginIcon" alt="暂无图片">
        <span class="accoutName">许文祥</span>
        <i class="iconfont outLoginIcon bt-hover"></i>
      </div>
    </div>
    <div class="buttomWrapper">
      <div class="leftWrapper">
        <el-row class="menu">
          <el-col>
            <el-menu
              :router="true"
              :unique-opened="true"
              :default-active="activeIndex">
              <div v-for="(item,index) in menus" :key="index">
                <template v-if="item.childrens.length > 0">
                  <el-submenu :index="index+''">
                    <template slot="title">
                      <i class="iconfont" :class="item.icon"></i>
                      <span>{{item.title}}</span>
                    </template>
                    <el-menu-item v-for="child in item.childrens" :index="child.route" :key="child.route">
                      {{child.title}}
                    </el-menu-item>
                  </el-submenu>
                </template>
                <template v-else>
                  <el-menu-item :index="item.route"> 
                    <i class="iconfont" :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                  </el-menu-item>
                </template>
              </div>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="rightWrapper">
        <router-view></router-view>
      </div>
    </div>
    
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      activeIndex: '/index/production',
      menus: [
        {
          title: '产品管理',
          icon: 'bt-proManagerIcon',
          route: '',
          childrens: [
            { title: '产品库', route: '/index/production' },
            { title: '新增产品', route: '/index/addProduction' },
            { title: '类别属性', route: '/index/kindProperty' }
          ]
        },
        {
          title: '推广管理',
          icon: 'bt-genManagerIcon',
          route: '/index/promotion',
          childrens: []
        },
        {
          title: '推广栏目',
          route: '',
          icon: 'bt-genColumnIcon',
          childrens: [
            { title: '快捷推广', route: '/index/speedPromo' },
            { title: '推广展示', route: '/index/promoDisplay' },
            { title: '轮播设置', route: '/index/carouselSetting' },
            { title: '文字推广', route: '/index/textPromo' },
            { title: '启动页推广', route: '/index/startPromoS' },
            { title: '发现内容', route: '/index/findContent' }
          ]
        },
        {
          title: '首页定制',
          icon: 'bt-homePageCmIcon',
          route: '',
          childrens: [
            { title: '自定义首页模板', route: '/index/customHomepage' },
            { title: '首页模板选择', route: '/index/homepageTemplet' }
          ]
        },
        {
          title: '销售管理',
          icon: 'bt-sellManagerIcon',
          route: '',
          childrens: [
            { title: '销售人员管理', route: '/index/sale' },
            { title: '销售团队管理', route: '/index/saleteam' }
          ]
        },
        {
          title: '客户管理',
          icon: 'bt-custManagerIcon',
          route: '/index/customerManager',
          childrens: []
        },
        {
          title: '订单管理',
          icon: 'bt-orderManagerIcon',
          route: '',
          childrens: [
            { title: '销售订单', route: '/index/sellOrder' },
            { title: '协助订单', route: '/index/assistOrder' },
            { title: '历史订单', route: '/index/historyOrder' }
          ]
        },
        {
          title: '系统管理',
          icon: 'bt-systemManagerIcon',
          route: '',
          childrens: [
            { title: 'APP升级管理', route: '/index/appManage' },
            { title: '日志查看', route: '/index/logView' },
            { title: '用户注册', route: '/index/userReg' },
            { title: '敏感词管理', route: '/index/sensWordManage' }
          ]
        },
        {
          title: '数据统计',
          icon: 'bt-dataStatisticsIcon',
          route: '',
          childrens: [
            { title: '产品维度', route: '/index/productDiemn' },
            { title: '客户维度', route: '/index/customerDiemn' },
            { title: '汇总报表', route: '/index/gatherCount' }
          ]
        },
        {
          title: '用户反馈',
          icon: 'bt-userFeedBackIcon',
          route: '/index/userFeedback',
          childrens: []
        },
        {
          title: '用户管理',
          icon: 'bt-userManagerIcon',
          route: '',
          childrens: [
            { title: '用户管理', route: '/index/userManage' },
            { title: '访客审核', route: '/index/visitorVerify' },
            { title: '角色管理', route: '/index/roleManage' }
          ]
        },
        {
          title: '公司管理',
          icon: 'bt-companyManagerIcon',
          route: '',
          childrens: [
            { title: '联系我们', route: '/index/contactWe' },
            { title: '关于我们', route: '/index/aboutWe' },
            { title: '职位设置', route: '/index/positionSetting' },
            { title: '公司设置', route: '/index/companySetting' }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.index
  overflow hidden
  .headerWrapper
    background #ffffff
    margin-bottom 15px
    box-shadow 0 1px 5px #EBEBEB
    height 2.8rem
    display flex
    justify-content space-between
    align-items center
    .headerLeft
      color $base-color
      margin-left 15px
      display flex
      align-items center
      i.logoIcon:after
        content '\e61a'
        font-size 1.5rem
        margin-right 5px
    .headerRight
      color #2D2F33
      margin-right 25px
      display flex
      align-items center
      font-size 0.6rem
      .noLoginIcon
        width 25px
        height 25px
        border-radius 50%
      i.outLoginIcon:after
        content '\e654'
        transition color .5s
      i.outLoginIcon
        &:hover
          color $base-color
      .accoutName
        margin 0 50px 0 5px
  .buttomWrapper
    display flex
    .leftWrapper
      width 200px
      box-shadow 1px 0 5px #EBEBEB
      background #ffffff
      overflow auto
      overflow-x hidden
      position absolute
      top 50px
      left 0 
      right 0
      bottom 0
      border-top-right-radius 8px
      .iconfont
        margin-right 0.5rem
    .rightWrapper
      border-top-left-radius 8px
      padding 15px 15px 0 15px
      flex 1
      box-shadow -1px 0 5px #EBEBEB
      background #ffffff
      overflow auto
      overflow-x hidden
      box-sizing border-box
      position absolute
      top 50px
      left 210px
      right 0
      bottom 0
i.bt-proManagerIcon:after
  content '\e601'
i.bt-genManagerIcon:after
  content '\e605'
i.bt-genColumnIcon:after
  content '\e61c'
i.bt-homePageCmIcon:after
  content '\e608'
i.bt-sellManagerIcon:after
  content '\e604'
i.bt-custManagerIcon:after
  content '\e607'
i.bt-orderManagerIcon:after
  content '\e602'
i.bt-systemManagerIcon:after
  content '\e61b'
i.bt-dataStatisticsIcon:after
  content '\e603'
i.bt-userFeedBackIcon:after
  content '\e60d'
i.bt-userManagerIcon:after
  content '\e61d'
i.bt-companyManagerIcon:after
  content '\e606'
</style>
