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
        <i class="iconfont outLoginIcon bt-hover" @click="loginOut"></i>
      </div>
    </div>
    <div class="buttomWrapper">
      <div class="leftWrapper">
        <el-row class="menu">
          <el-col>
            <el-menu
              :router="true"
              :unique-opened="true"
              @select="handleSelect"
              :default-active="activeIndex">
              <div v-for="(item,index) in menus.menu" :key="index">
                <template v-if="item.childs.length > 0">
                  <el-submenu :index="index+''">
                    <template slot="title">
                      <i class="iconfont" :class="item.icon"></i>
                      <span>{{item.menuName}}</span>
                    </template>
                    <el-menu-item v-for="child in item.childs" :index="child.menuUrl" :key="child.menuUrl">
                      {{child.menuName}}
                    </el-menu-item>
                  </el-submenu>
                </template>
                <template v-else>
                  <el-menu-item :index="item.menuUrl"> 
                    <i class="iconfont" :class="item.icon"></i>
                    <span slot="title">{{item.menuName}}</span>
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
import utils from '@/commons/Batar/utils'
export default {
  data() {
    return {
      activeIndex: null,
      menus: {}
    }
  },
  methods: {
    loginOut() {
      this.$confirm('确认退出登录？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.Axios.get('/account/account/logout')
            .then(res => {
              let result = res.data
              if(result.code == 0){
                utils.goLogin()
              }else{
                this.$message.error(result.msg)
              }
            })
            .catch(err => {
              this.extCatch(err, this.loginOut)
            })
        })
        .catch(() => {})
    },
    handleSelect(key, keyPath) {
      sessionStorage.setItem('currentPath', key)
    },
    initPath() {
      let currentPath = sessionStorage.getItem('currentPath')
      if (currentPath && currentPath != '') {
        this.activeIndex = currentPath
      } else {
        this.activeIndex = this.menus.default.menuUrl
      }
    },
    getMenus(){
      this.Axios.get('/account/menu').then(res=>{
        let result = res.data
        if(result.code == 0){
          this.menus = result.data
          this.$nextTick(()=>{
            this.initPath()
          })
        }else{
          this.$message.error(result.msg)
        }
      }).catch(err=>{
        this.extCatch(err,this.getMenus)
      })
    }
  },
  created() {
    this.getMenus()
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
        transition color 0.5s
      i.outLoginIcon
        &:hover
          color $base-color
      .accoutName
        margin 0 50px 0 5px
        font-size 12px
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
