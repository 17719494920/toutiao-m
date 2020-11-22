<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(title, index) in suggestions"
      :key="index"
      @click="$emit('clicksearch', title)"
    >
      <div slot="title" v-html="highlight(title)"></div>
      <!-- 给我们所写的文本施加高亮效果,建议内容不施加,可以用函数包裹title内容 -->
      <!-- 双花括号绑定会直接输出纯文本内容 -->
      <!-- <div>{{htmlStr}}</div> -->
      <!-- 使用v-html指令可以绑定渲染带有HTML标签的字符串 -->
      <!-- <div v-html="htmlStr"></div> -->
    </van-cell>
  </div>
</template>

<script>
// 搜索建议,一旦文本发生改变,建议里面的内容就会立即改变,响应式,可以用watch属性监听text文本,起到响应式效果
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  data () {
    return {
      suggestions: [] // 搜索建议
    }
  },
  name: 'SearchSuggestion',
  created () {

  },
  mounted () {

  },
  methods: {
    //   这里不直接调用this.searchText,而是选泽传参,保证其复用性
    async loadSearchSuggestion (q) {
      const { data } = await getSearchSuggestion(q)
      this.suggestions = data.data.options
    },
    highlight (title) {
      // 这个函数跟过滤器,计算属性很像,都是不改变原参数,直接生成一个新数据
      // 这里可以用str.replace方法,将选中的内容替换成我们想要的文本
      //   const highlight = `<span class="active">${this.searchText}</span>`
      //   正则表达式,中间的内容都会当成匹配字符来使用,而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式(就是正则里面的内容会变化),则手动new RegExp
      // RegExp 正则表达式构造函数
      // 参数1:匹配模式字符串,他会根据这个字符串创建正则对象
      // 参数2:匹配模式,要写到字符串中
      //   const reg = new RegExp(this.searchText, 'gi')
      //   return title.replace(reg, highlight)
      //   传进来的参数title使用replace方法,把这个字符串里面的匹配到的值替换成高亮
      const highlight = title.split(this.searchText)
      //   问,为什么中间会生成一个小引号
      return highlight.join(`<span class='active'>${this.searchText}</span>`)
      //   用this.searchText打断字符串,再用<span class="active">${this.searchText}</span>把字符串拼起来,就可以起到替换作用,split打断,join拼接
    }
  },
  watch: {
    //   侦听事件,文本改变,就调接口
    searchText: {
      // 当searchText发生改变的时候会调用handler函数
      // 注意:handler函数名称是固定的

      //   debounce函数/防抖函数
      //   参数一:一个函数,
      //   参数二,延迟时间,单位是毫秒
      //   返回值,防抖之后的函数
      //   防抖就是为了防止用户请求接口过快,给服务器造成太多损耗,设置一定时间请求依次
      handler: debounce(function (val) {
        this.loadSearchSuggestion(val)
      }, 200),
      //   handler (val) {
      //     this.loadSearchSuggestion(val)
      //   },
      immediate: true // 该回调将会在侦听开始之后立即被调用
    }
  },
  computed: {

  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  }
}
// 创建 RegExp 对象的语法：生成一个动态的正则表达式
// new RegExp(pattern, attributes);
// 参数 pattern 是一个字符串，指定了正则表达式的模式或其他正则表达式。

// 参数 attributes 是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。ECMAScript 标准化之前，不支持 m 属性。如果 pattern 是正则表达式，而不是字符串，则必须省略该参数。
// 一个新的 RegExp 对象，具有指定的模式和标志。如果参数 pattern 是正则表达式而不是字符串，那么 RegExp() 构造函数将用与指定的 RegExp 相同的模式和标志创建一个新的 RegExp 对象。

// 如果不用 new 运算符，而将 RegExp() 作为函数调用，那么它的行为与用 new 运算符调用时一样，只是当 pattern 是正则表达式时，它只返回 pattern，而不再创建一个新的 RegExp 对象。
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
