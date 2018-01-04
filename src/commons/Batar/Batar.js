/**
 * ============================ @前端开发小组-Batar =============================
 */
import Base64 from '@/commons/libs/Base64';
import MD5 from "@/commons/libs/MD5";
import router from '@/router/index';
import utils from '@/commons/Batar/utils';

export default {
  /**
   * 【更新accessToken】
   */
  refToken($this, func, refTokenRouter) {
    let refreshToken = utils.getCookie('refreshToken');
    if (refreshToken) {
      let params = {
        PRS: {
          refreshToken: refreshToken
        }
      }
      $this.Axios.get(refTokenRouter, params).then(res => {
        utils.setCookie("accessToken", res.data.data.accessToken);
        utils.setCookie("refreshToken", res.data.data.refreshToken, res.data.data.refreshTokenExpires);
        func();
      }).catch(err => {
        router.push('/login');
      })
    } else {
      router.push('/login');
    }
  },
  /**
   * 【参数格式化】
   */
  formartParams(config, baseURL, appConfig) {
    let accessToken = utils.getCookie('accessToken');

    let method = config.method.toUpperCase();
    let url = config.url;
    let signKey = method + url.replace(baseURL, "/");

    if (method == 'GET' || method == 'DELETE') { // GET、DELETE
      let PRS = config.PRS ? config.PRS : {};
      PRS.accessToken = accessToken;
      PRS.signKey = this.getSignKey(signKey, PRS, appConfig);
      config.PRS = PRS;

      let params = utils.fomartParams(config.PRS);
      url = config.url + '?' + params;
      config.url = url;
    } else if (method == 'PUT' || method == 'POST') { // PUT、POST
      config.data = config.data ? config.data : {};
      signKey += '&' + JSON.stringify(config.data) + '&' + appConfig.sign;
      let isFormdata = 'append' in config.data
      if (isFormdata) {
        config.data.append('signKey', new Base64().encode(signKey).MD5(32));
        config.data.append('accessToken', accessToken);
      } else {
        config.data.signKey = new Base64().encode(signKey).MD5(32);
        config.data.accessToken = accessToken;
      }
    }
  },
  /**
   * 获取签名
   */
  getSignKey(signKey, PRS, appConfig) {
    let keys = Object.keys(PRS).sort();
    for (var i = 0; i < keys.length; i++) {
      if (Object.prototype.toString.call(PRS[keys[i]]) === '[object Array]') {
        PRS[keys[i]].forEach(val => {
          signKey += '&' + keys[i] + '=' + val
        });
      } else {
        signKey += '&' + keys[i] + '=' + PRS[keys[i]]
      }
    }
    signKey += '&' + appConfig.sign;
    let result = new Base64().encode(signKey).MD5(32);
    return result;
  },
}
