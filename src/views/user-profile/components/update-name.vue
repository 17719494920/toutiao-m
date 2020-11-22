<template>
  <div class="update-name">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="patchUser"
    />
    <div class="field">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { patchUserProfile } from '@/api/user'
export default {
  data () {
    return {
      message: this.username
    }
  },
  name: 'updateName',
  created () {

  },
  mounted () {

  },
  methods: {
    async patchUser () {
      this.$toast.loading({
        message: '更改中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        if (!this.message) {
          return this.$toast('昵称不能为空')
        }
        await patchUserProfile({
          name: this.message
        })
        this.$emit('updatename', this.message)
        this.$toast('更改名称成功')
      } catch (error) {
        this.$toast('更改名称失败')
      }
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    username: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.update-name {
  .field {
    padding-top: 20px;
  }
}
</style>
