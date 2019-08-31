<template>
  <el-select clearable :value="value" @change="changeChannel" placeholder="请选择">
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
// 默认功能：
// 1，选择器的结构
// 2，有下拉表中的数据
// 有数据，先声明，还得先获取数据
export default {
  name: 'my-channel',
  props: ['value'],
  data () {
    return {
      // 声明数据
    //   value: null,/这个是自己声明的，但有父组件传过来的value了，所以就注释了
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  // 获取数据
  methods: {
    changeChannel (channelId) {
      // 将选中的频道的id给父组件，通过自定义事件
    //   如果清空，值应该是null
      if (channelId === '') channelId = null
      this.$emit('input', channelId)
    },
    async getChannelOptions () {
      // data.channels 数组 [{id,name}]  获取数据
      const {
        data: { data }
      } = await this.$http.get('channels')
      // 赋值
      this.channelOptions = data.channels
    }
  }
}
</script>

<style lang="less" scoped>
</style>
