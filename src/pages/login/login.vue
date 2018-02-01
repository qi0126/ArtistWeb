<template>
  <div class="login">
    <div class="bgWrapper">
      <img class="bgImg" src="static/imgs/login_bg.jpg">
      <span class="desc">
        <i class="iconfont logoIcon"></i>
        <span class="textOne">Artist 后台管理系统</span>
        <span class="textTwo">Back-stage Management</span>
      </span>
    </div>
    <div class="loginWrapper">
      <div class="accountName">
        <i class="iconfont uaIcon"></i>
        <input v-model.trim="accountName" type="text" placeholder="请输入用户名" @keyup.enter="login">
      </div>
      <div class="password">
        <i class="iconfont pwdIcon"></i>
        <input v-model.trim="password" type="password" placeholder="请输入密码" @keyup.enter="login">
      </div>
      <button class="btn bt-hover" @click="login">登 录</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'

export default {
  data() {
    return {
      accountName: '',
      password: ''
    }
  },
  methods: {
    login() {
      let params = {
        accountName: this.accountName,
        password: this.password,
        appId: this.appConfig.appId,
        companyId: '1' // 测试数据
      }
      this.Axios.post('/account/account/login', params).then(res => {
        let result = res.data
        let code = result.code
        if (code == 0) {
          let tokenObj = result.data.token
          let accessToken = tokenObj.accessToken
          let accessTokenExpires = tokenObj.accessTokenExpires
          let accountId = tokenObj.accountId

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('accountId', accountId)
          // utils.setCookie('accessToken', accessToken, accessTokenExpires)
          // utils.setCookie('accountId', accountId, accessTokenExpires)

          this.$router.push({ path: '/index' })
        } else {
          this.$message.error(result.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.login
  .bgWrapper
    position relative
    .bgImg
      width 100%
    .desc
      position absolute
      top 0
      left 0
      color #ffffff
      display flex
      flex-direction column
      width 100%
      height 100%
      align-items center
      justify-content center
      .logoIcon:after
        content '\e61a'
        font-size 3rem
      .textOne
        font-size 1.2rem
        margin 1rem 0 0.5rem 0
      .textTwo
        font-size 0.9rem
  .loginWrapper
    text-align center
    color #cccccc
    font-size 1rem
    .accountName
      margin 5rem auto 1rem auto
    .password
      margin 0 auto
    .accountName, .password
      background #e6e6e6
      width 20%
      height 2.5rem
      border-radius 5px
      display flex
      align-items center
      input
        background #e6e6e6
        flex 1
        height 100%
        padding-left 10px
      i
        flex 0 50px
        width 50px
        border-right 1px solid #CBCBCB
      i.uaIcon:after
        content '\e619'
        color gray
      i.pwdIcon:after
        content '\e618'
        color gray
    .btn
      background rgb(230, 14, 50)
      border none
      color #ffffff
      width 20%
      height 2.8rem
      border-radius 5px
      margin-top 3rem
      font-size 1.1rem
</style>
