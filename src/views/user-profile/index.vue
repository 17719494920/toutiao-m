<template>
  <div class="user-profile">
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 这个文件输入框文件显示出来太丑了,所以我们将他隐藏起来,通过在头像框中的
    点击事件触发$refs.file.click(),实现他的点击效果,并监听file输入框的
    change事件 -->
    <input type="file" hidden ref="file" @change="filechange" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="userProfilelist.photo"
      />
    </van-cell>
    <van-cell
      @click="isUpdateNameShow = true"
      title="昵称"
      :value="userProfilelist.name"
      is-link
    />
    <van-cell
      title="性别"
      :value="userProfilelist.gender ? '女' : '男'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      @click="isUpdateBirthdayShow = true"
      title="生日"
      :value="userProfilelist.birthday"
      is-link
    />
    <!-- 编辑昵称 -->
    <van-popup
      class="nicheng"
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        @updatename="updatename"
        :username="userProfilelist.name"
        @close="isUpdateNameShow = false"
      ></update-name>
    </van-popup>
    <!-- 编辑性别 -->
    <van-popup class="gender" v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        :gender="userProfilelist.gender"
        @changeGender="changeGender"
        @closegender="closegender"
        v-if="isUpdateGenderShow"
      ></update-gender>
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup
      class="birthday"
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        @updatebirthday="updatebirthday"
        v-if="isUpdateBirthdayShow"
        :date="userProfilelist.birthday"
        @cancelbirthday="isUpdateBirthdayShow = false"
      ></update-birthday>
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
      class="photo"
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        @changephoto="changephoto"
        @cancelphoto="cancelphoto"
        v-if="isUpdatePhotoShow"
        :img="img"
      ></update-photo>
    </van-popup>
  </div>
  <!-- is-link是否展示右侧箭头并开启点击反馈 -->
</template>

<script>
import { getUserProfile } from '@/api/user'
import updateName from './components/update-name'
import updateGender from './components/update-gender'
import updateBirthday from './components/update-birthday'
import updatePhoto from './components/update-photo'
export default {
  data () {
    return {
      userProfilelist: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  components: {
    'update-name': updateName,
    'update-gender': updateGender,
    'update-birthday': updateBirthday,
    'update-photo': updatePhoto

  },
  name: 'userProfile',
  created () {
    this.loadProfile()
  },
  mounted () {

  },
  methods: {
    async loadProfile () {
      try {
        const { data } = await getUserProfile()
        this.userProfilelist = data.data
        console.log(this.userProfilelist)
      } catch (error) {
        this.$toast('获取数据失败')
      }
    },
    updatename (val) {
      this.userProfilelist.name = val
      this.isUpdateNameShow = false
    },
    closegender () {
      this.isUpdateGenderShow = false
    },
    changeGender (val) {
      this.userProfilelist.gender = val
      this.isUpdateGenderShow = false
    },
    updatebirthday (val) {
      this.userProfilelist.birthday = val
      this.isUpdateBirthdayShow = false
    },
    filechange () {
      // 这两步是在浏览器预览本地图片的方法,记下来就行
      const file = this.$refs.file.files[0] // 这个操作可以获取你这个文件的各项数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      // file-input如果选了同一个文件不会触发change事件
      // 解决办法就是每次使用完毕,把他的value清空
      this.$refs.file.value = ''
    },
    cancelphoto () {
      this.isUpdatePhotoShow = false
    },
    changephoto (val) {
      this.userProfilelist.photo = val
      this.isUpdatePhotoShow = false
    }
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
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .nicheng {
    background-color: #f5f7f9;
  }
}
</style>
