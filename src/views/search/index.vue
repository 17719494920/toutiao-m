<template>
  <div class="search-container">
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，action里面随便写就行,即可在 iOS 输入法中显示搜索按钮。 -->
    <!-- 外面包的这个action,就是给手机键盘一个搜索按钮,没有手机上就没有 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isSearchShow = false"
      />
      <!-- @focus="isSearchShow = false",一聚焦就把搜索框结果关了,第一个组件判断失败,由于文本中有内容,所以联想建议会触发 -->
      <!-- @search="onSearch"搜索事件,@cancel="onCancel"用户取消事件 -->
    </form>
    <!-- 用组件渲染,然后根据v-if,不同的判定值渲染不同的内容 -->
    <!-- 搜索结果 -->
    <!-- 判断顺序很重要,越容易达成的条件放在越后面 -->
    <!-- 对搜索结果,联想建议,搜索历史记录依次判断,如果第一条满足了,就不会执行下一条了 -->
    <!-- 如果isSearchShow这个数据为true,就渲染搜索结果这个组件 -->
    <search-results
      :searchText="searchText"
      v-if="isSearchShow"
    ></search-results>
    <!-- 联想建议 -->
    <!-- 如果搜索结果组件没渲染,且文本内有内容,则渲染联想建议组件 -->
    <search-suggestion
      :searchText="searchText"
      v-else-if="searchText"
      @clicksearch="onSearch"
    ></search-suggestion>
    <!-- 点击某个联想建议,就会把他的title文本给传到父组件中来,然后根据这个文本来调接口,生成搜索结果 -->
    <!-- :searchText="searchText",props里面的数据名称应该等于v-bind:后面的属性,而不是等号后面的值,:属性="值" -->
    <!-- 搜索历史记录 -->
    <!-- 其他两个都不渲染,就渲染历史记录 -->
    <search-history
      :searchHistories="searchHistories"
      @deletehistory="deleteSearchHistory"
      @deleteall="deleAll"
      @enterSearch="onSearch"
      v-else
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResults from './components/search-results'
import { setItem, getItem } from '@/utils/storage'
export default {
  data () {
    return {
      searchText: '',
      isSearchShow: false,
      searchHistories: getItem('TOUTIAO-SEARCH-HISTORIES') || []
      //   获取searchHistories搜索历史,如果有,就返回本地存储里面存的值,如果没有,就返回空数组
    }
  },
  name: 'Search',
  created () {

  },
  mounted () {

  },
  methods: {
    onSearch (val) {
      // 因为调接口就是根据searchText来做的,所以必须时刻更新searchText,这是重点
      // 然而生成搜索结果需要在子组件search-results中完成,所以需要把searchtext传递给子组件search-results
      // ,当调用onsearch函数,this.isSearchShow = true时,立即开始渲染search-results组件,然后在search-results
      // 组件中的created调接口,就能获取到数据了,最后把数据渲染到页面上,功能就完成了
      this.searchText = val
      //   一调用这个函数,就把搜索历史记录保存了下来,搜索历史也是文本
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isSearchShow = true
    },
    onCancel () {
      this.$router.back()
    },
    deleteSearchHistory (val) {
      this.searchHistories.splice(val, 1)
    },
    deleAll () {
      this.searchHistories = []
    }
  },
  watch: {
    searchHistories (val) {
      setItem('TOUTIAO-SEARCH-HISTORIES', val)
    }
  },
  computed: {

  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResults
  },
  props: {

  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
