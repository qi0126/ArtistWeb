/**
 * ============================ @前端开发小组-Batar =============================
 */
export default {
  /**
   * 格式化参数
   */
  fomartParams(obj) {
    let newKeys = Object.keys(obj).sort()
    let newObj = {}
    for (let i = 0; i < newKeys.length; i++) {
      newObj[newKeys[i]] = obj[newKeys[i]]
    }
    let result = ''
    for (let it in newObj) {
      if (Object.prototype.toString.call(newObj[it]) === '[object Array]') {
        newObj[it].forEach(val => {
          result += it + '=' + val + '&'
        });
      } else {
        result += it + '=' + newObj[it] + '&';
      }
    }
    result = result.substring(0, result.length - 1)
    return result;
  },
  /**
   * 判断是否为空对象
   */
  isEmptyObj(obj) {
    let is = false;
    if (obj) {
      if (JSON.stringify(obj) === '{}') {
        is = true;
      } else {
        is = false;
      }
    } else {
      is = true;
    }
    return is;
  },
  /**
   * 设置cookie
   */
  setCookie(c_name, value, expiredays) {
    let date = new Date();
    date.setTime(date.getTime() + expiredays * 1000);
    if (expiredays && expiredays != '') {
      document.cookie = `${c_name}=${value};expires=${date.toGMTString()}`;
    } else {
      document.cookie = `${c_name}=${value}`;
    }
  },
  /**
   * 获取cookie
   */
  getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  },
  /**
   * 删除cookie
   */
  delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
    var cval = this.getCookie(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
  },
  /**
   * 图片转base64
   */
  encodeBase64(e) {
    let p = new Promise((resolve, reject) => {
      let uploadFile = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onloadend = function () {
        return resolve(reader.result);
      };
    })
    return p;
  },
  /**
   * 重置file控制值
   */
  reset(e) {
    e.target.value = ''
  }
}
