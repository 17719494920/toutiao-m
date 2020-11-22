<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('deleteall')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="iconHanler(history, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isDeleteShow: false
    }
  },
  name: 'SearchHistory',
  created () {

  },
  mounted () {

  },
  methods: {
    iconHanler (history, index) {
      if (this.isDeleteShow) {
        this.$emit('deletehistory', index)
      } else {
        // 传递事件给父亲,然后进入搜索事件
        this.$emit('enterSearch', history)
      }
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    searchHistories: {
      // prop数据
      // prop是受父组件数据影响的
      // 如果是普通数据(数字,字符串,布尔值) 绝对不能修改
      // 即便改了也不会传导给父组件
      // 如果是引用类型数据(数组,对象)
      // 可以修改,例如[].push(xxx),对象.xxx=xxx
      // 不能重新赋值,xxx=[]
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
</style>
