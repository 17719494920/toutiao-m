<template>
  <div>
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')"> </van-icon>
    </van-nav-bar>
    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>
      <van-cell title="全部回复"></van-cell>
      <comment-list
        :list="results"
        type="c"
        :source="comment.com_id"
      ></comment-list>
    </div>
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPopShow = true"
        >写评论</van-button
      >
    </div>
    <van-popup v-model="isPopShow" position="bottom" :style="{ height: '30%' }">
      <comment-post
        @addcomments="postcomment"
        type="c"
        :target="comment.com_id"
      ></comment-post>
    </van-popup>
  </div>
</template>

<script>
import commentItem from '@/views/article/comment-item'
import commentList from '@/views/article/comment-list'
import commentPost from '@/views/article/comment-post'
export default {
  data () {
    return {
      isPopShow: false,
      results: []
    }
  },
  components: {
    'comment-item': commentItem,
    'comment-list': commentList,
    'comment-post': commentPost
  },
  name: 'commentReply',
  created () {

  },
  mounted () {

  },
  methods: {
    postcomment (val) {
      this.results.unshift(val)
      this.isPopShow = false
      this.comment.reply_count++
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.post-wrap {
  position: fixed;
  left: 0;
  right: 0;
  height: 88px;
  bottom: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
// 加这个样式，让其实现内滚动，和之前那个页面的一样
.scroll-wrap {
  position: fixed;
  right: 0;
  left: 0;
  top: 102px;
  bottom: 88px;
  overflow-y: auto;
}
</style>
