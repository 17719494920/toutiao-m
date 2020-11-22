import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
// vant组件
import Vant from 'vant'
// vant全局样式
import 'vant/lib/index.css'
// 动态设置rem基准值,包里面是个子调用函数,所以直接使用就行,不需要返回值使用
import 'amfe-flexible'
// 加载dayjs初始化配置
import './utils/dayjs'
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
