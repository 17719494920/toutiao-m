<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      :default-index="this.gender"
    />
  </div>
</template>

<script>
import { patchUserProfile } from '@/api/user'
export default {
  data () {
    return {
      columns: ['男', '女']
    }
  },
  name: 'UpdateGender',
  created () {

  },
  mounted () {

  },
  methods: {
    async onConfirm (value, index) {
      try {
        const { data } = await patchUserProfile({
          gender: index
        })
        console.log(data)
        this.$emit('changeGender', index)
      } catch (error) {
        this.$toast('更改性别失败')
      }
    },
    onCancel () {
      this.$emit('closegender')
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    gender: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style scoped lang="less">
</style>
