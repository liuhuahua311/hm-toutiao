<template>
    <div>
        <!-- 使用组件 -->
        <com-a>
            <div slot="conter" slot-scope="scope">内容一{{scope.msg}}</div>
            <div slot="foot">底部一</div>
        </com-a>
        <hr>
        <my-bread>测试组件</my-bread>

        <hr>
        <hr>
        <hr>
        <com-b></com-b>
    </div>
</template>

<script>
import ComA from './com-a'
import ComB from './com-b'
export default {
  components: { ComA, ComB }
}
</script>

<style lang="less" scoped>
</style>
