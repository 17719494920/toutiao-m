import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'
Vue.use(Vuex)
const tokenKey = 'toutiao_user'
export default new Vuex.Store({
  state: {
    // 取出来的token最好是个对象,所以需要parse
    user: getItem(tokenKey),
    isReplyShow: false,
    currentComment: {}
  },
  mutations: {
    setUser (state, data) {
      // 1.把数据保存到vuex数据库
      state.user = data
      // vuex因为在刷新后，数据会丢失，所以需要配合localstorage使用
      // 2.为了防止刷新丢失,持久化,把数据保存到本地存储,注意,本地储存只能存储字符串,所以需要将获取到的data josn.stringify
      setItem(tokenKey, data)
    },
    replyclick (state, data) {
      state.isReplyShow = !state.isReplyShow
      state.currentComment = data
    },
    closeItem (state, data) {
      state.isReplyShow = data
    }
  },
  actions: {
  },
  modules: {
  }
})
