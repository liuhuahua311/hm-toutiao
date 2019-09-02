<template>
    <div>
        <!-- 组件内部 -->
        <div>header</div>
        <div><slot name="conter" :msg="message" list='数组'>默认内容</slot></div>
        <div><slot name="foot">底部内容</slot></div>

        <b> {{message}}</b>
    </div>
</template>

<script>
import eventBus from '@/eventbus'
export default {
  data () {
    return {
      message: '这是组件内部数据com-a'
    }
  },
  created () {
    eventBus.$on('b2a', (data) => {
      this.message = data
    })
  }
}
</script>

<style lang="less" scoped>
</style>
