<template>
  <!-- 装载内容 -->
  <div class="xtx-tabs-panel" v-show="name===activeName">
    <slot />
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'XtxTabsPanel',
  props: {
    // 选项卡文字 选项卡唯一标识 $slot.default()获取默认插槽内容
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>

<style scoped lang="less">

</style>
