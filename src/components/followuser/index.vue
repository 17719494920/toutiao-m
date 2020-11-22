<template>
  <van-button
    v-if="isfollowed"
    class="follow-btn"
    round
    size="small"
    @click="onfollowing"
    :loading="followloading"
    >已关注</van-button
  >
  <!-- loading是否显示为加载状态 -->
  <van-button
    v-else
    class="follow-btn"
    type="badge"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onfollowing"
    :loading="followloading"
    >关注</van-button
  >
</template>

<script>
import { addFollowingsUser, deleteFollowingsUser } from '@/api/user'
export default {
  data () {
    return {
      followloading: false
    }
  },
  name: 'followUser',
  created () {

  },
  mounted () {

  },
  methods: {
    async onfollowing () {
      this.followloading = true
      //   一按按钮，就把等待按钮打开
      try {
        if (this.isfollowed) {
          // 这里改联网
          // 如果已关注，则调用取消关注接口，如果未关注，就关注用户
          await deleteFollowingsUser(this.userid)
        } else {
          await addFollowingsUser(this.userid)
        }
        // 这里改本地
        this.$emit('isfollowedchange', !this.isfollowed)
        // this.articlecontent.is_followed = !this.articlecontent.is_followed
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast('不能关注自己')
        } else if (error.response && error.response.status === 401) {
          this.$toast('你未登录，请登陆后操作')
        } else {
          this.$toast('关注失败，请重试')
        }
      }
      //   调接口结束，把等待按钮观了
      this.followloading = false
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    isfollowed: {
      type: Boolean,
      required: true
    },
    userid: {
      type: [String, Object, Number],
      required: true
    }
  }
}
</script>

<style scoped lang="less">
</style>
