<template>
  <div class="my-container">
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" fit="cover" round :src="userinfo.photo" />
          <span class="name">{{ userinfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" type="default" to="/user/profile"
            >编辑资料</van-button
          >
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userinfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont iconshoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont iconlishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      v-if="user"
      title="退出登录"
      @click="onLogout"
      class="logout-cell"
      clickable
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { loadUserInfo } from '@/api/user'
export default {
  data () {
    return {
      userinfo: {}
    }
  },
  name: 'My',
  created () {
    // 如果用户登录了网页,有了user,才需要获取用户数据
    if (this.user) {
      this.getUserList()
    }
  },
  mounted () {

  },
  methods: {
    onLogout () {
      this.$dialog.confirm({
        title: '确认退出吗'
      })
        .then(() => {
          // on confirm
          console.log('确定执行这里')
          // 直接传个空值给vuex,就能把里面的token值替代了
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里')
        })
    },
    async getUserList () {
      try {
        const { data } = await loadUserInfo()
        this.userinfo = data.data
      } catch (err) {
        this.$toast.fail('获取用户信息失败')
      }
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
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .left {
      display: flex;
      align-items: center;
    }
    .avatar {
      width: 132px;
      height: 132px;
      margin-right: 23px;
      border: 4px solid #fff;
    }
    .name {
      font-size: 30px;
      color: #fff;
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.iconfont {
        font-size: 45px;
      }
      .iconshoucang {
        color: #eb5253;
      }
      .iconlishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    margin-top: 5px;
    text-align: center;
    color: #eb5253;
  }
}
</style>
