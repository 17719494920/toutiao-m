import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // @符号代表绝对路径,从当前终端的src开始
  // component: () => import('@/views/login/index') 路由懒加载
  { path: '/login', name: 'login', component: () => import('@/views/login/index') },
  { path: '/user/profile', name: 'userProfile', component: () => import('@/views/user-profile/index') },
  {
    path: '/',
    // name: 'layout',如果父路由有默认子路由,那他的name没有意义
    component: () => import('@/views/layout/index'),
    // 在布局页面内嵌套五个路由地址,由router-view导出
    children: [{
      path: '/', name: 'home', component: () => import('@/views/home/index')
    },
    {
      path: '/qa', name: 'qa', component: () => import('@/views/qa/index')
    },
    {
      path: 'video', name: 'video', component: () => import('@/views/video/index')
    }, {
      path: 'my', name: 'my', component: () => import('@/views/my/index')
    }]
  },
  { path: '/search', name: 'search', component: () => import('@/views/search/index') },
  { path: '/article/:articleId', name: 'article', component: () => import('@/views/article/index'), props: true }
  // 开启props传参,说白了就是把路由参数映射到组件的props数据中
]

const router = new VueRouter({
  routes
})

export default router
