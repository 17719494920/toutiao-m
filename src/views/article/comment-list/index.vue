<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    :immediate-check="false"
  >
    <!-- immediate-check是否在初始化时立即执行滚动位置检查，如果我们手动执行一遍了，就可以把这个属性观了 -->
    <comment-item v-for="(item, index) in list" :key="index" :comment="item">
    </comment-item>
  </van-list>
</template>

<script>
import { getComments } from '@/api/comments'
import commentItem from '../comment-item/index'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  name: 'comment-list',
  created () {
    // 加判断渲染
    // 用那种方法不知道可行不
    // 当你手动初始onload的话，他不会自带开始初始的loading
    // 所以我们要手动的开启初始loading
    this.loading = true
    this.onLoad()
  },
  mounted () {

  },
  components: {
    'comment-item': commentItem
  },
  methods: {
    async onLoad () {
      try {
        //   2.将数据添加到列表中
        //   3.将loading设置为false
        //   4.判断是否还有数据
        // 有就更新获取下一页代码，
        // 没有finished设置为true
        //   1.请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          // 因为这里使用了jsonbig对象，必须先toString()，不然就是得到的就是字符串，
          // 太长的id，最好都tostring一下
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data)
        var results = data.data.results
        // 拿了数据就传过去
        const total_count = data.data.total_count
        this.$emit('commentCountChange', total_count)
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (error) {
        this.loading = false
        this.error = true
      }
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: [Array],
      //   如果父组件传了值，就用父组件的值，没传就为空数组
      default: () => []
    },
    // 默认为获取评论列表，如果要获取评论回覆，应该传值type="c"
    type: {
      type: String,
      // 自定义prop验证
      validator (value) {
        // 从这两个里面选一个
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  }
}
</script>
<style scoped lang="less">
</style>
