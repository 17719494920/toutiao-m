<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="addUserComment"
      :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComments } from '@/api/comments'
// 异步函数里面的代码，同步执行，外面的代码，该怎么执行就怎么执行
export default {
  // 接受爷爷传过来的值
  inject: {
    articleId: {
      type: [Object, Number, String],
      default: null
    }
  },
  name: 'CommentPost',
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async addUserComment () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await addComments({
          target: this.target,
          content: this.message,
          // 传个参数进去做判断，来区分评论与回复评论
          art_id: this.type === 'c' ? this.articleId.toString() : null
        })
        console.log(1)
        const { new_obj } = data.data
        this.$emit('addcomments', new_obj)
        this.message = ''
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布评论失败')
      }
    }
  },
  props: {
    target: {
      type: [Object, Number, String],
      required: true
    },
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
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
