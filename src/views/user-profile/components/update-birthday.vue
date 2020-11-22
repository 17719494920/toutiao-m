<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择出生日"
      :min-date="minDate"
      @cancel="$emit('cancelbirthday')"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="confirmBirthday"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { patchUserProfile } from '@/api/user'
export default {
  data () {
    return {
      minDate: new Date(1930, 0, 1),
      maxDate: new Date(),
      currentDate: this.date ? new Date(this.date) : new Date()
    }
  },
  name: 'updateBirthday',
  created () {

  },
  mounted () {

  },
  methods: {
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return `${val}日`
    },
    async confirmBirthday (val) {
      const date = moment(val).format('YYYY-MM-DD')
      try {
        await patchUserProfile({
          birthday: date
        })
        this.$emit('updatebirthday', date)
      } catch (error) {
        this.$toast('更改生日失败')
      }
    }
  },
  watch: {

  },
  computed: {

  },
  props: {
    date: {
      type: [String],
      required: true
    }
  }
}
</script>

<style scoped lang="less">
</style>
