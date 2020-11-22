<template>
  <!-- 当我们滚动它的时候，不是组件内部再滚动，而是整个Body页面在滚动 -->
  <div class="article-list">
    <!-- List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->
    <!-- 若列表数据加载失败，将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件。 -->
    <!-- load事件:
      list初始化后会触发一次load事件,用于加载第一屏的数据.
      如果一次请求加载的数据条数较少,导致列表内容无法铺满当前屏幕,list会继续触发load事件,直到内容铺满屏幕或数据全部加载完成 -->

    <!-- loading 属性:控制加载中的loading状态
      非加载中,loading为false,此时会根据列表滚动位置判断是否触发load事件,列表内容不足一屏幕时,会直接触发)
      加载中,loading为true,表示正在发送异步请求,此时不会触发load事件

      finied属性:控制加载结束的状态,
      在每次请求完毕后,需要手动将loading设置为false,表示本次加载结束
      所有数据加载结束,finished为true,此时不会触发load事件 -->
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="successText"
      :success-duration="1500"
    >
      <!-- :success-duration="1500" 刷新成功框停留的时间 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- 设置失败框 -->
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
        <!-- 不用单元格，改用组件article-item -->
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        >
          <!-- article组件的内容根据父组件向子组件传值由 :article="item"传递了过去，在components里面的articleitem组件用就行 -->
          <!-- 每一个article-item组件就代表了一个小行单元格，里面放着一行数据，一整页的数据由它的父组件article-list存放 -->
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index'
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      refreshing: false,
      successText: '刷新成功'
      // 刷新效果

    }
  },
  components: {
    ArticleItem
    // 这里是省略写法，'ArticleItem':ArticleItem为完整写法，同时驼峰命名转换为-式命名，上面引用变成了article-item
  },
  name: 'ArticleList',
  created () {

  },
  mounted () {

  },
  methods: {
    // onLoad () {
    //     // 1.请求获取数据
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     //   2.把请求结国数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3.本次数据加载结束之后要把加载状态设置为结束
    //     // loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false

    //     // 4.判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //         // 如果没有数据,把fininshed设置为true,之后不再触发加载更多
    //       this.finished = true
    //     }
    //   }, 1000)
    // }
    async onLoad () {
      // 为加载数据
      // 1.请求获取数据
      // 2.把请求结国数据放到list数组中
      // 3.本次数据加载结束之后要把加载状态设置为结束
      // 4.判断数据是否全部加载完成
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), // 你可以把timestamp理解为页码
          with_top: 1 // 如果请求为第一页数据,当前最新时间戳 Date.now()
        })// 如果请求之后的数据,使用本次接口返回的数据中的pre_time
        // console.log(data)// 是否包含置顶,进入页面第一次请求时包含之变
        // 设置失败情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsadsad')
        // }
        const { results } = data.data
        this.list.push(...results)
        this.loading = false

        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
        // 失败了就返回这个数据
      } catch (err) {
        //   打开失败框,关闭等待框
        this.error = true
        this.loading = false
      }
    },
    async onRefresh () {
      // 更新数据
      // 启动这个函数,自动获取数据,然后把数据放在第一行
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 当前获取的数据永远是最新的数据
          with_top: 1 // 如果请求为第一页数据,当前最新时间戳 Date.now()
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsadsad')
        // }
        const { results } = data.data
        this.list.unshift(...results)
        this.refreshing = false
        this.successText = `刷新成功，获取到了${results.length}条数据`
        // results需要被解构成单个的元素才能被添加到数组里面去
      } catch (err) {
        this.refreshing = false
        this.successText = '刷新失败'
      }
      // this.refreshing参数会在调用此函数的时候自动变为true,需要我们人为关闭，当此参数为false了，表示加载完成
    }
  },
  watch: {

  },
  computed: {

  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
// 溢出滚动
// 为什么列表滚动会相互影响 ？

// - 因为他们并不是再自己内部滚动，而是整个 `body` 页面在滚动，无论你是在 `a` 频道还是在 `b` 频道，其实滚动的都是 `body` 元素
// 如何记住列表的滚动位置

// 如何快速找到是哪个元素产生的滚动
// function findscroller(element) {
//   element.onscroll = function () {
//     console.log(element)
//   }
//   Array.from(element.children).forEach(findscroller)
// }
// findscroller(document.body)

// 让每一个标签内容文章列表产生自己的滚动容器，这样就不会相互影响了
// 如何让标签内容文章列表产生自己的滚动容器？通过样式就能生成
// - 固定高度： `height: xxx;`
// - 溢出滚动：`overflow-y: auto;`
// 记住这两个吧，height不能设置为百分比，得用vh,1vh为0.01最大高度
// `css3` 中新增了一种视口单位 `vw` 和 `vh` ，何谓视口，就是根据你浏览器窗口的大小的单位，不受父元素的影响
</style>
