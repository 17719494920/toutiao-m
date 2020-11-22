import axios from "axios"
import store from '@/store/index'
import JSONBig from 'json-bigint'
// axios.create()方法可以帮助我们创建一个全新的axios实例对象,因为axios只能存在一个,就算在不同的axios里面导入,也是这个
const request = axios.create({
    baseURL: "http://toutiao-app.itheima.net/", // 基础路径
    // 每个接口的调用都需要token,所以我们应该在总的axios中设置请求拦截器,获取到请求头,然后加到axios接口里面
    // 为了解决JS处理不了超大数据的问题，我们这里引用了JSONbig插件，来处理
    transformResponse: [function (data) {
        try {
            // 我们这里手动通过JSONBig把响应数据从字符串格式转换成json对象格式，而不是用axios自带的json.parse了
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }
        // 用try，catch就是为了增加容错率，不让报错崩溃系统
        // axios默认会在内部这养来处理后端返回的数据 json.parse(data)
    }]
})
request.interceptors.request.use(function (config) {
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token} `
    }
    // 注意:这里务必返回config配置对象,否则请求就停在这里出不去了
    return config
}, function (error) {
    return Promise.reject(error)
})

export default request
