import Vue from 'vue';
import Axios from 'axios';
import router from '@/router/index'
import Batar from '@/commons/Batar/Batar';

//app配置
const appConfig = {
  sign: 'abc',
  appId: 1000
};

const fileAddress = 'http://192.168.16.20:9006' // 文件系统地址

// 服务器地址
// Axios.defaults.baseURL = 'http://192.168.16.103:8082'; // 测试服
Axios.defaults.baseURL = 'http://192.168.16.20:8082'; // 开发服
// Axios.defaults.baseURL = 'http://192.168.21.114:8082'; // 城阳开发服


// accessToken更新路由
const refTokenRouter = '/account/account/refreshToken'
// 超时时间
// Axios.defaults.timeout = 5000;
// 请求拦截器
Axios.interceptors.request.use(function (config) {
  let baseURL = Axios.defaults.baseURL;
  Batar.formartParams(config, baseURL, appConfig)
  return config;
})

// 异常捕获
function extCatch(err, func) {
  let res = err.response
  if (res) {
    if (res.status == 403) {
      let errCode = res.data.code;
      if (errCode == '2') { // refreshToken无效
        router.push('/login');
      } else if (errCode == '3') { // accessToken无效
        router.push('/login');
        // Batar.refToken(this, func, refTokenRouter);
      } else if (errCode == '5') { // 签名错误
        alert('签名错误');
      }
    } else if (res.status == 500) {
      alert('操作失败，服务器出错了');
    }
  }
}

Vue.prototype.Axios = Axios;
Vue.prototype.extCatch = extCatch;
Vue.prototype.appConfig = appConfig;
Vue.prototype.fileAddress = fileAddress;
