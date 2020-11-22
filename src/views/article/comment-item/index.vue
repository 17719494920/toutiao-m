<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :class="{
          liked: comment.is_liking,
        }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        @click="onCommentIslike"
        :loading="loading"
        >{{ comment.like_count || "赞" }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <van-button class="reply-btn" round @click="replyclick(comment)"
          >回复{{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentsLike, deleteCommentsLike } from '@/api/comments'
export default {
  name: 'CommentItem',
  data () {
    return {
      loading: false
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCommentIslike () {
      try {
        //    如果有点赞，就取消点赞
        if (this.comment.is_liking) {
          await deleteCommentsLike(this.comment.com_id)
          this.comment.like_count--
          console.log(this.comment.is_liking)
          //   如果没有点赞，就点赞
        } else {
          await addCommentsLike(this.comment.com_id)
          this.comment.like_count++
        }
        this.comment.is_liking = !this.comment.is_liking
      } catch (error) {
        this.$toast('操作失败，请重试')
      }
    },
    replyclick (val) {
      this.$store.commit('replyclick', val)
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    min-width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f !important;
    }
  }
}
</style>
