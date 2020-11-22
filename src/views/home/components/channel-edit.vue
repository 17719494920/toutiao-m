<template>
  <div class="channel-edit">
    <!-- 用单元格设置标题 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        slot="default"
        size="mini"
        round
        plain
        type="danger"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <!-- 用grid设置内容 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in mychannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- !fixedChannels.includes(channel.id)表示固定数组里面不包含当前channel的id，则为true -->
        <!-- 里面内容必须带插槽，不然会把别的内容覆盖 -->
        <van-icon
          v-show="isEdit && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- grid中要想获得自己的样式，先得加插槽,用三元表达式，动态绑定active-->
        <!-- 老师的方法： :class="{active:index===true}" -->
        <span
          slot="text"
          class="text"
          :class="index === active ? 'active' : ''"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 用grid设置内容 -->
    <van-grid :gutter="10" class="recomment-grid">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in recommendChannels"
        :key="index"
        icon="plus"
        @click="onAddChannel(item)"
        :text="item.name"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channeljs'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制删除框的显示与隐藏
      //   添加一个固定频道，不能删除
      fixedChannels: [0, 11]
    }
  },
  name: 'ChannelEdit',
  created () {
    this.getChannelsList()
  },
  mounted () {

  },
  methods: {
    //   获取全部频道列表
    async getChannelsList () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast.fail('获取数据失败')
      }
    },
    async onAddChannel (channel) {
      // 计算属性会观测内部依赖数据的变化，如果依赖的数据发生变化，则计算属性重新执行，响应式，我们不需要另外删除channel
      //   先做了本地数据，再使用接口函数，所以本地页面一直被更新了，不需要额外去更新数据
      this.mychannels.push(channel)
      //   数据持久化设置
      //   检查token，看用户是否登录了页面，如果登录了，就用接口，否则传输到本地
      if (this.user) {
        //   登陆了就调接口
        try {
          await addUserChannels({
            id: channel.id,
            seq: this.mychannels.length
          })
        } catch (err) {
          this.$toast.fail('用户添加失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.mychannels)
      }
    },
    // 删除指定pd
    onMyChannelClick (channel, index) {
      // 编辑状态
      if (this.isEdit) {
        //   如果当前的channel属于固定channels数组，这个channel不能删除，直接return出去
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        if (index <= this.active) {
          // 如果当前的index索引小于我们所点的active值，那么就把active-1，不然会造成active和index不一致的问题6，
          // 因为active是不会变得，而index会减一，所以我们应该手动把active减一
          this.$emit('xiaotiancai', this.active - 1, true)
        }
        this.mychannels.splice(index, 1)
        // 数据持久化
        this.deleteUser(channel.id)
        // 切换状态
      } else {
        //   父组件的active，子组件不能直接控制，得传递给父组件，传它的index给父组件，使父组件的active等于index就完事了
        this.$emit('xiaotiancai', index, false)
      }
    },
    async deleteUser (channelId) {
      if (this.user) {
        try {
          await deleteUserChannels(channelId)
        } catch (err) {
          this.$toast.fail('删除指定用户频道失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.mychannels)
      }
    }

  },
  watch: {

  },
  computed: {
    // recommendChannels () {
    //   const newChannels = []
    //   this.allChannels.forEach(item => {
    //     //   这个数据是个对象，不是简单数据，所以检查不到，这个方法舍弃
    //     // if (this.mychannels.indexOf(item) === -1) {
    //     //   this.newChannels.push(item)
    //     // }
    //     const ret = this.mychannels.some(channel => {
    //       return channel.id === item.id
    //     })
    //     if (!ret) {
    //       newChannels.push(item)
    //     }
    //     // 只要是能筛选的方法都可以，先对allchannels进行遍历，再对muchannels进行遍历，找到不重合的，这就是双重for循环

    //   })
    //   return newChannels
    // }
    ...mapState(['user']),
    recommendChannels () {
      // 双重for循环，这种方法记一下
      return this.allChannels.filter(item => {
        return !this.mychannels.some(channel => channel.id === item.id)
      })
    }
  },
  props: {
    mychannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__icon-wrapper {
        position: static !important;
      }
      .van-grid-item__text,
      .text {
        font-size: 22px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recomment-grid {
    .grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 22px;
          line-height: 22px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
