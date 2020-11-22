module.exports = {
    plugins: {
        // vuecli内部已经配置了autoprefixer插件,我们又配置了一次,所以冲突了
        // autoprefixer: {
        //     browsers: ['Android >= 4.0', 'iOS >= 8'],
        // },
        // 配置使用postcss-pxtorem插件
        // 作用:把px转为rem
        'postcss-pxtorem': {
            // lib-flexible的REM适配方案,把一行分为10份,每份就是十分之一
            // 所以rootValue应该设置为你的设计稿宽度的十分之一
            // 我们的设计稿是750,所以应该设置为750/10=75
            // 但vant建议设置为37.5,因为vant是基于375写的
            // 所以必须设置为37.5,唯一的缺点是使用我们设计稿的尺寸都必须除以2,解决方案
            // 如果是vant样式, 就按照37.5来转换
            // 如果是我们自己的样式,就按照75来转换
            // 通过查阅文档, 我们发现rootvalue支持两种类型:
            //     数字: 固定的数值
            //     函数:可以动态处理返回
            //     postcss- pxtorem处理每个css文件的时候都会来调用这个函数,
            // 他会把吃力的css文件相关信息通过参数传递给该函数
            // 配置好这个以后,我们设计稿是多少就直接写多少,不需要额外进行转换,和pc端页面一样写就行了
            rootValue ({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // 配置要转换的css属性
            // *表示全部
            propList: ['*'],
            // 配置不要转换的样式资源
            exclude: 'github-markdown'
        }
    }
}
