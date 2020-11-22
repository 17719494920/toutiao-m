<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 标签栏支持路由模式，用于搭配 vue-router 使用。路由模式下会匹配页面路径和标签的 to 属性，并自动选中对应的标签。
    使用方法看案例 -->
    <van-tabbar v-model="active" route>
      <!-- 如果我们想用自己的样式替代它原有的样式,需要用插槽来设置 -->
      <van-tabbar-item to="/"
        ><span class="text">首页</span>
        <i slot="icon" class="iconfont iconshouye"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/qa"
        ><span class="text">问答</span>
        <i slot="icon" class="iconfont iconwenda"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/video"
        ><span class="text">视频</span>
        <i slot="icon" class="iconfont iconshipin"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="iconfont iconwode"></i>
        <span class="text">{{ user ? "我的" : "未登录" }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      active: 0
    }
  },
  name: 'LayoutIndex',
  created () {

  },
  mounted () {

  },
  methods: {

  },
  watch: {

  },
  computed: {
    ...mapState(['user'])
  },
  props: {

  }
}
// 组件状态保持
// 使用场景，有一个页面组件，加载和请求较多的数据，页面渲染的内容可能也比较复杂，这个页面需要加载完毕会花费比较多的时间
// 如果从这个A页面切换到下一个B页面，就会销毁当前页面组件，渲染新的页面组件
// 下一次重新切换会加载渲染时间比较多的时候，又会花费时间进行渲染和加载

// 组件状态保持就可以解决这也的问题

// 在vue中，有一些内置的组件，比如内置组件keep-alive就可以帮助我们去做组件状态保持。
// 做法也比较简单，只要用keep-alive标签组件将需要换成的组件包含起来就可以了。

// 但是，有的时候我们包含的会是<router-view/>或者是<component>的占位符
// 就需要限制哪些组件需要缓存，就可以通过include属性来设置包含，或者exclude属性来设置排除，如下：
// include和exclude属性设置的是组件名称

// <keep-alive include="Users,Rights"/>
</script>

<style scoped lang="less">
.van-tabbar-item {
  i.iconfont {
    font-size: 40px;
  }
  span.text {
    font-size: 20px;
  }
}
</style>
