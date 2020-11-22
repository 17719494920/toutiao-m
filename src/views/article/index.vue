<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="onBack"
    >
    </van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div
        class="article-detail markdown-body"
        v-else-if="articlecontent.title"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articlecontent.title }}</h1>

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articlecontent.aut_photo"
          />
          <div slot="title" class="user-name">
            {{ articlecontent.aut_name }}
          </div>
          <!-- 这里我估计是整个过滤器,上来就干 -->
          <div slot="label" class="publish-date">
            {{ articlecontent.pubdate | relativeTime }}
          </div>
          <!-- 提前准备已关注和未关注两个按钮，由articlecontent.is_followed的正反值来确定渲染哪一个按钮 -->
          <follow-user
            @isfollowedchange="followchange"
            :isfollowed="articlecontent.is_followed"
            :userid="articlecontent.aut_id"
          ></follow-user>
        </van-cell>

        <!-- 文章内容 -->
        <div
          class="article-content"
          ref="article-content"
          v-html="articlecontent.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 儿子的传，应该传给父亲，从儿子标签传 -->
        <comments-list
          :list="results"
          :source="articlecontent.art_id"
          @commentCountChange="changeCommentCount"
        ></comments-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPopShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="commentCount" color="#777" />
          <collect-article
            @collectchange="collectchange"
            :artid="articlecontent.art_id"
            :iscollected="articlecontent.is_collected"
          ></collect-article>
          <like-article
            @likechange="likechange"
            :isliked="articlecontent.attitude"
            :artid="articlecontent.art_id"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <van-popup
          v-model="isPopShow"
          position="bottom"
          :style="{ height: '30%' }"
        >
          <comment-post
            :target="articlecontent.art_id"
            @addcomments="addcomment"
          ></comment-post>
        </van-popup>
      </div>
      <!-- 估计是v-if 报错才会生成 -->
      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errstatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticlesById"
          >点击重试</van-button
        >
      </div>
    </div>
    <!-- 弹出层是懒渲染的，只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏
    弹层组件- 如果初始的条件是 false，则弹层的内容不会渲染 -
    程序运行期间，当条件变为 true 的时候，弹层才渲染了内容 -
    之后切换弹层的展示，弹层只是通过 `CSS` 控制隐藏和显示,相当于v-show
    弹层渲染出来以后就只是简单的切换显示和隐藏，里面的内容也不再重新渲染了，所以会导致我们的评论的回复列表不会动态更新了。解决办法就是在每次弹层显示的时候重新渲染组件。 -->
    <van-popup
      close-icon-position="top-left"
      v-model="$store.state.isReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 又因为我们并没有属性去改变弹出层，只能给里面的元素加v-if判断渲染，满足条件就渲染，不满足就销毁，刚好能满足我们的需求 -->
      <comment-reply
        v-if="$store.state.isReplyShow"
        @close="$store.state.isReplyShow = false"
        :comment="this.$store.state.currentComment"
      ></comment-reply>
    </van-popup>
    <!-- 计算属性不能直接被当作数据传值，不然会报错，以后用vuex用第一种方法 -->
  </div>
</template>
<script>
import { getArticlesById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/followuser/index'
import collectArticle from '@/components/collect-user/index'
import likeArticle from '@/components/like-article/index'
import commentsList from '@/views/article/comment-list/index'
import commentPost from '@/views/article/comment-post/index'
import commentReply from '@/views/article/comment-reply/index'
export default {
  // 给所有的后代组件提供数据,可以直接爷爷传孙子
  // 注意：不要滥用
  // 用inject去接
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      // data可以起到保存数据的效果
      articlecontent: {},
      loading: true,
      errstatus: 0,
      followloading: false, // 是否为等待状态
      commentCount: 0,
      isPopShow: false,
      results: []
    }
  },
  name: 'Article',
  created () {
    this.loadArticlesById()
  },
  mounted () {

  },
  components: {
    'follow-user': FollowUser,
    'collect-article': collectArticle,
    'like-article': likeArticle,
    'comments-list': commentsList,
    'comment-post': commentPost,
    'comment-reply': commentReply
  },
  methods: {
    async loadArticlesById () {
      // 一调接口就打开loading
      this.loading = true
      try {
        const { data } = await getArticlesById(this.articleId)
        console.log(data)
        // if (Math.random() > 0.5) {
        //   JSON.parse('ssss')
        // }
        // 人为制造失败
        this.articlecontent = data.data
        // 数据到渲染需要时间，所以我们制造了异步
        setTimeout(() => {
          this.previewImg()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errstatus = 404
        }
      }
      this.loading = false
    },
    // 预览图片，而我们的页面中又没这个标签，=怎么做，看这里
    previewImg () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((item, index) => {
        images.push(item.src)
        // 遍历这个imgs数组，并且人为的给这个标签元素添加一个click事件
        // item点击出发一个箭头函数
        item.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    onBack () {
      this.$router.back()
    },
    followchange (val) {
      this.articlecontent.is_followed = val
    },
    collectchange (val) {
      this.articlecontent.is_collected = val
    },
    likechange (val) {
      console.log(val)
      this.articlecontent.attitude = val
    },
    changeCommentCount (val) {
      console.log(1111)
      this.commentCount = val
    },
    addcomment (val) {
      this.results.unshift(val)
      this.isPopShow = false
      this.commentCount++
    }
  },
  watch: {

  },
  //   通过props把传递的路由参数映射到数据中来
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  }
}
</script>
<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
