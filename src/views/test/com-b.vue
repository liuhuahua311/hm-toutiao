<template>
    <div>ComB <button @click="btn">传递</button></div>
</template>

<script>
import eventBus from '@/eventbus'
export default {
  data () {
    return {
      msg: 'com-b组件数据'
    }
  },
  methods: {
    btn () {
      eventBus.$emit('b2a', this.msg)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
