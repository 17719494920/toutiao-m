<template>
  <div class="search-results">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="(result, index) in searchResults"
        :key="index"
        :title="result.title"
        :to="`/article/${result.art_id}`"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      searchResults: [],
      page: 1,
      per_page: 20,
      error: false
    }
  },
  name: 'SearchResults',
  created () {

  },
  mounted () {

  },
  methods: {
    onLoad () {
      this.loadSearch(this.searchText)
      //   this.loading = false
    },
    //   1.请求获取数据
    async loadSearch (val) {
      try {
        console.log(val)
        const { data } = await getSearchResults({
          page: this.page,
          per_page: this.per_page,
          q: val
        })
        const results = data.data.results
        // 数组需要解构才能添加到数组里面
        //   2.将数据添加到数组列表中
        this.searchResults.push(...results)
        //   3.将本次加载中的loading关闭
        this.loading = false
        //   4.判断是否还有数据
        if (results.length) {
          //   如果有,则更新获取下一个数据的页妈,
          this.page++
        } else {
          //   如果没有,则将加载状态finished设置为结束
          this.finished = true
        }
      } catch (error) {
        this.$toast('搜索结果获取失败')
      }
    }
  },
  watch: {

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
</script>

<style scoped lang="less">
</style>
