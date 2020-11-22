import dayjs from 'dayjs'
import Vue from 'vue'
import 'dayjs/locale/zh-cn'// 全局使用时间过滤器
// 配置相对时间插件，想看也可以直接去relativeTime查看
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
// from, ...以内，to 。。。以前

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用
// 其实过滤器就相当于一个全局可用的方法，仅供模板
// 参数一：过滤器名称
// 参数二：过滤器函数
Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})
Vue.filter('filterTime', value => {
    return dayjs(value).format('YYYY-MM-DD hh:mm:ss')
})
// 过滤器用法，很熟了
// dayjs()获取当前最新时间
// 把这个过滤器定义到main,就相当于全局使用
