import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 状态对象
const state = {
  kindParams: {}, // 【产品库 =》 批量添加到推广类别 参数对象】
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
