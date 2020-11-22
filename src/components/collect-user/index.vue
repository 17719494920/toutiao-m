<template>
  <van-button
    v-if="iscollected"
    color="yellow"
    plain
    icon="star"
    @click="onCollecting"
    class="firsticon"
    :loading="loading"
  >
  </van-button>
  <van-button
    class="firsticon"
    v-else
    plain
    color="#777"
    icon="star-o"
    @click="onCollecting"
    :loading="loading"
  >
  </van-button>
</template>

<script>
import { addArticle, deleteArticle } from '@/api/user'
export default {
  data () {
    return {
      loading: false
    }
  },
  name: 'collectArticle',
  created () {

  },
  mounted () {

  },
  methods: {
    async onCollecting () {
      this.loading = true
      try {
        if (this.iscollected) {
          await deleteArticle(this.artid)
        } else {
          await addArticle(this.artid)
        }
        this.$emit('collectchange', !this.iscollected)
        this.$toast(!this.iscollected ? '收藏成功' : '取消收藏成功')
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast('不能收藏自己的文章')
        } else if (error.response && error.response.status === 401) {
          this.$toast('你未登录，请登陆后操作')
        } else {
          this.$toast('收藏失败，请重试')
        }
      }
      this.loading = false
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    artid: {
      type: [Number, String, Object],
      required: true
    },
    iscollected: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.firsticon {
  border: none;
}
</style>
