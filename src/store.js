import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 状态对象
const state = {
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  },
}

// 计算属性
const getters = {}

// 事件处理（同步）
const mutations = {}

// 事件处理（异步）
const actions = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
