import Vue from 'vue';
import Axios from 'axios';
import router from '@/router/index'
import Batar from '@/commons/Batar/Batar';

const appConfig = {
  sign: 'abc',
  appId: 1000
};

const fileAddress = 'http://192.168.16.20:9006'
const voiceAddress = process.env.NODE_ENV + '/order'
Axios.defaults.baseURL = process.env.NODE_ENV;

Axios.interceptors.request.use(function (config) {
  let baseURL = Axios.defaults.baseURL;
  Batar.formartParams(config, baseURL, appConfig)
  return config;
})

function extCatch(err, func) {
  let res = err.response
  if (res) {
    if (res.status == 403) {
      let errCode = res.data.code;
      if (errCode == '2') {
        router.push('/login');
      } else if (errCode == '3') {
        router.push('/login');
      } else if (errCode == '5') {
        alert('签名错误');
      } else if (errCode == '6') {
        router.push('/login');
      } else {
        router.push('/login');
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
Vue.prototype.voiceAddress = voiceAddress;
