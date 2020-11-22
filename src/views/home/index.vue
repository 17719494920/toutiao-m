<template>
  <div class="home-container">
    <!-- 导航栏应设置为固定定位，不随页面滚动而滚动 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- 点击搜索,跳转到新页面search -->
      <van-button
        slot="title"
        type="info"
        size="small"
        round
        class="search-btn"
        to="/search"
      >
        <i class="iconfont iconsousuo"></i>
        <span class="text">搜索</span>
      </van-button>
      <!-- 要想使用自己的图标,必须使用插槽来替换,具体看slot=啥得看文档 -->
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 每一个channel对应一个artlisst组件，他们之间互不影响 -->
        <!-- index为首页，里面包含的每一个页面都是一个article-list，根据channels里面由多少个channel，就会有多少页数据 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
      <!-- 最后一个标签一半出不来,需要添加一个占位符,把他挤出来,充当内容区域 -->
      <div slot="nav-right" class="zhanweifu"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <!-- close-icon-position="top-left"删除图标位置 -->
    <!-- position="bottom"，从哪个方向出来 -->
    <!-- 弹出层里面可以直接放内容，不需要加插槽 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!-- 直接父子组件传值，比调接口省心 -->
      <channel-edit
        @xiaotiancai="changeActive"
        :active="active"
        :mychannels="channels"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  data () {
    return {
      active: 1,
      channels: [], // 频道列表
      isChannelEditShow: false
    }
  },
  components: {
    'article-list': ArticleList,
    ChannelEdit
  },
  name: 'Home',
  created () {
    this.loadChannels()
  },
  mounted () {

  },
  methods: {
    // 根据用户是否登录,获取不同的个人频道
    async loadChannels () {
      let channels = []
      if (this.user) {
        try {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } catch (err) {
          this.$toast('获取频道信息失败')
        }
      } else {
        const localChannels = getItem('TOUTIAO_CHANNELS')
        // 如果本地存储存在,就用本地存储,不然就用默认推荐的模块
        if (localChannels) {
          channels = localChannels
        } else {
          try {
            console.log(1)
            const { data } = await getUserChannels()
            channels = data.data.channels
          } catch (err) {
            this.$toast('获取频道信息失败')
          }
        }
      }
      this.channels = channels
      // try {
      //   // 获取个人频道列表
      //   const { data } = await getUserChannels()
      //   this.channels = data.data.channels
      // } catch (err) {
      //   this.$toast('获取频道信息失败')
      // }
    },

    // isChannelEditShow = true,直接传句话进来，如果实参传了值，就用实参的值，如果没传，就用true，很厉害
    changeActive (index, isChannelEditShow = true) {
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  },
  watch: {

  },
  computed: {
    ...mapState(['user'])
  },
  props: {

  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      i.iconfont {
        font-size: 32px;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      left: 0;
      right: 0;
      z-index: 1;
      top: 92px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .zhanweifu {
      width: 66px;
      height: 82px;
      // 因为其他的标签已经把空间分配完了,我们只能用flex-shrink: 0;来取消占位符分配空间,设置固定宽度
      flex-shrink: 0;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-color: contain;
      }
    }
  }
}
</style>
