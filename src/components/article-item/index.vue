<template>
  <!-- 获取文章列表的组件 -->
  <div class="article-item">
    <van-cell @click="toArticle(article.art_id)">
      <!-- 标题 -->
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ article.title }}
      </div>
      <!-- 内容 -->
      <div slot="label">
        <!-- 三张图片的时候，放在评论上面 -->
        <div class="cover-wrap" v-if="article.cover.type === 3">
          <!-- v-for就是对元素本身来用，循环遍历父数据，相当于for in  -->
          <div
            class="cover-item"
            v-for="(image, index) in article.cover.images"
            :key="index"
          >
            <!-- 图片组件,为行内块样式 -->
            <van-image class="cover-item-img" fit="cover" :src="image" />
          </div>
        </div>
        <div class="label-info-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}</span>
          <span>{{ article.pubdate | relativeTime }}</span>
        </div>
      </div>
      <div slot="default" v-if="article.cover.type === 1">
        <van-image
          class="right-cover"
          fit="cover"
          :src="article.cover.images[0]"
        />
      </div>
      <!-- 如果图片只有一张，图片就放在右边 -->
      <!-- 单元格里面不能直接加内容，如果要加，需要使用插槽 -->
    </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  name: 'ArticleItem',
  created () {

  },
  mounted () {

  },
  methods: {
    toArticle (val) {
      console.log(1)
      this.$router.push(`/article/${val}`)
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
// cover：图片宽高比不变、铺满整个容器的宽高，而图片多出的部分则会被截掉；
// contain:图片自身的宽高比不变，缩放至图片自身能完全显示出来，所以容器会有留白区域；
.title {
  font-size: 32px;
  color: #3a3a3a;
}
.van-cell__value {
  flex: unset;
  width: 232px;
  height: 146px;
  padding-left: 25px;
}

.right-cover {
  width: 232px;
  height: 146px;
}
.cover-wrap {
  display: flex;
  padding: 30px 0;
  .cover-item {
    flex: 1;
    height: 146px;
    &:not(:last-child) {
      padding-right: 4px;
    }
    .cover-item-img {
      width: 100%;
      height: 146px;
    }
  }
}
.label-info-wrap span {
  font-size: 22px;
  color: #b4b4b4;
  margin-right: 25px;
}
</style>
