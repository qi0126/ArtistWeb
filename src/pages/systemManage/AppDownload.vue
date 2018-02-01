<template>
    <div class="conBigDiv">
      <div>
        <div>{{appVersion}}</div>
        <br/>
        <br/>

        <div>{{myDiv}}</div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      tempList: [],
      tempUrlObj: {},
      myDiv: "",
      appVersion: ""
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      this.Axios.get("/platform/appVersion/newVersion")
        .then(data => {
          if (data.data.code == 0) {
            self.tempList = data.data.data;
            self.myDiv = JSON.stringify(data.data.data);
            self.tempUrlObj = {};
            for (var i in self.tempList) {
              if (self.tempList[i].appType == "Android") {
                self.tempUrlObj.Android = self.tempList[i].url;
              }
              if (self.tempList[i].appType == "iOS") {
                self.tempUrlObj.iOS = self.tempList[i].url;
              }
            }
            // console.log(self.tempUrlObj);
            self.appVersion = navigator.userAgent;
            if (self.appVersion.indexOf("Android") > -1 || self.appVersion.indexOf("Linux") > -1) {
              window.location.href = self.tempUrlObj.Android;
            }
            //ios终端
            if (!!self.appVersion.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
              window.location.href = self.tempUrlObj.iOS;
            }
            if (self.appVersion.indexOf("MicroMessenger") > -1) {
              //在微信中打开

            } else {
              if (self.appVersion.indexOf("Windows") > -1) {
                //电脑浏览器打开
              } else {
                //手机浏览器打开
                
              }
            }
          }
        })
        .catch(err => {
          this.extCatch(err, this.create_fun);
        });
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
  .red_font
    color $base-color
</style>