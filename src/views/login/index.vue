<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- 要想使用自己的图标,必须使用插槽来替换,具体看slot=啥得看文档 -->
      <van-icon slot="left" name="cross" @click="$router.go(-1)" />
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="loginForm">
      <!-- 不属于框架的图标需要用插槽来引入 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        label=""
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 通过i,slot来在输入框前面插入插槽,位置由left-icon决定,样式由class决定 -->
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        label=""
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <template #button>
          <van-count-down
            @finish="isCountShow = false"
            v-if="isCountShow"
            :time="1000 * 60"
            format="ss s"
          />
          <!-- 必须将按钮转换为功能性按钮,否则会触发表单提交native-type="button" -->
          <van-button
            v-else
            native-type="button"
            round
            class="send-sms-btn"
            size="small"
            type="primary"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, onSendSms } from '@/api/user.js'
export default {
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      userFormRules: {
        //   pattern为正则验证
        mobile: [{ required: true, message: '请填写手机号' }, { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }],
        code: [{ required: true, message: '请填写验证码' }, { pattern: /^\d{6}$/, message: '验证码格式错误' }]
      },
      isCountShow: false
    }
  },
  //   name就是来设置标签名称的
  name: 'LoginIndex',
  created () {

  },
  mounted () {

  },
  methods: {
    //   点击触发submit事件,触发onSubmit函数,在里面调用了login方法,把this.user传进去
    // 验证成功，才会触发onSubmit请求，不然不会触发这个请求
    async onSubmit () {
      // 在组件中必须通过this.$toast来调用Toast组件
      //   表单验证:
      //    1.给van-field组件配置rules验证规则
      // 参考文档:
      // 2.当表单提交的时候会自动触发表单验证
      // 如果验证通过,会触发submit事件
      // 如果验证失败,不会触发submit
      //   表单会自动触发全部的验证,要想对单个表单项进行验证,必须使用this.$refs.validate操作单个表单
      //   其中this.$refs.validate('name'),括号里面包括的是表单名称
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      //   新的this.$toast调用会立即取消掉上一个this.$toast
      try {
        const { data } = await login(this.user)

        // 发送成功后,调取vuex数据库,保存token值,谁想用直接调用...mapState,里面的token_key值就可以取到token值
        this.$store.commit('setUser', data.data)
        this.$toast.success({
          message: '登录成功',
          duration: 1000
        })
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登录失败,请稍后重试', err)
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
    },
    // 千万要注意this.$refs.loginForm.validate('mobile')是一个异步任务,需要async/await
    async onSendSms () {
      // 1.验证手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('手机号格式错误', err)
      }
      this.$toast.success('发送成功')
      this.isCountShow = true
      try {
        await onSendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountShow = false
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁,请稍后再试')
        } else {
          this.$toast.fail('发送失败,请稍后重试')
        }
      }
    }
    // 在try函数中,先对 this.$refs.loginForm.validate('mobile')进行校验,如果成功,执行下面代码,如果失败,则进入catch中
    // 2.验证通过,显示倒计时

    // 3.请求发送验证码
  },
  watch: {

  },
  computed: {
  },
  props: {

  }
}
</script>

<style scoped lang="less">
.iconfont {
  font-size: 37px;
}
.send-sms-btn {
  width: 152px;
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size: 22px;
  color: #666;
  border: none;
}
.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    background-color: #6db4fb;
  }
}
</style>
