<template>
  <div class="update-photo">
    <img :src="img" alt="" class="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('cancelphoto')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
// cropper截图插件,import引入,然后直接按照文档用,具体要求看文档
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { patchUserPhoto } from '@/api/user'
export default {
  data () {
    return {
      cropper: null
    }
  },
  name: 'UpdatePhoto',
  created () {

  },
  mounted () {
    //   对页面元素调取,因为已经挂载了元素,所以应该放在mounted中
    // 找到image这个dom元素
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 剪裁器只能在画布内容中
      dragMode: 'move', // 移动的是后面的图片
      aspectRatio: 1, // 裁剪器宽高比
      autoCropArea: 1, // 裁剪器撑满整个画布大小
      cropBoxMovable: false, // 裁剪器不能移动
      cropBoxResizable: false, // 截图区域不能缩小,但允许放大
      background: false, // 背景关闭
      movable: true // 画布允许被拖动
    })
  },
  methods: {
    onConfirm () {
      //   基于服务端的裁切使用 getDate 方法获取裁切参数
      //   console.log(this.cropper.getDate());
      //   纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        this.$toast.loading({
          message: '更新中...',
          forbidClick: true,
          duration: 0
        })
        try {
          // 错误的用法,一用就用错了
          // 如果接口要求Content-Type 是application/json
          // 则传递普通JavaScript对象
          //   const { data } = await patchUserPhoto({
          //     photo: blob
          //   })
          // 如果接口要求Content-Type 是multipart/form-data
          // 则必须传递FormData对象
          //  传递普通对象,axios设置默认传输对象类型为application/json,如果传输的是文件类型的数据,则用formData类型数据,axios会设置传输对象类型为multipart/form-data
          const formData = new FormData()
          //   因为formData已经是一个对象了,包括了键photo与值blob,所以我们直接传它,而不是传成对象包含形势
          formData.append('photo', blob)
          const { data } = await patchUserPhoto(formData)
          console.log(data)
          this.$toast('更改用户照片成功')
          this.$emit('changephoto', data.data.photo)
        } catch (error) {
          this.$toast('更改用户照片失败')
        }
      })
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    img: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
