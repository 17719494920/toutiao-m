<template>
  <van-button
    v-if="isliked === -1"
    class="likebutton"
    plain
    color="#777"
    icon="good-job-o"
    @click="onliking"
    :loading="loading"
  ></van-button>
  <van-button
    v-else
    class="likebutton"
    plain
    color="red"
    icon="good-job"
    @click="onliking"
    :loading="loading"
  ></van-button>
</template>

<script>
import { likeArticle, deleteLikeArticle } from '@/api/user'
export default {
  data () {
    return {
      loading: false
    }
  },
  name: 'likeArticle',
  created () {

  },
  mounted () {

  },
  methods: {
    async onliking () {
      // 一点就显示loading按钮
      this.loading = true
      try {
        if (this.isliked === -1) {
          await likeArticle(this.artid)
          this.$emit('likechange', 1)
        } else {
          await deleteLikeArticle(this.artid)
          this.$emit('likechange', -1)
        }
        // console.log(this.isliked)
        this.$toast(this.isliked === -1 ? '点赞成功' : '取消点赞成功')
      } catch (error) {
        this.$toast('点赞，请重试')
      }
      this.loading = false
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    isliked: {
      type: [String, Number],
      required: true
    },
    artid: {
      type: [String, Number, Object],
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.likebutton {
  border: none;
}
</style>
