<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  // vue3 v-modl语法糖 :modelValue + @update:modelValue
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  // 自己写父子通信的逻辑
  //   setup (props, { emit }) {
  //     // 控制复选框显示隐藏
  //     const checked = ref(false)
  //     const changeChecked = () => {
  //       checked.value = !checked.value
  //       // check数据更新 通知父组件
  //       emit('update:modelValue', checked.value)
  //     }
  //     // 使用watch监听父组件传进来的modelValue 赋值给checked
  //     watch(() => props.modelValue, () => {
  //       checked.value = props.modelValue
  //     }, {
  //       immediate: true
  //     })
  //     return { checked, changeChecked }
  //   }
  // }

  // 使用vueuse库
  // 使用useVModel实现双向数据绑定v-model指令
  // 1.使用props接收modelValue
  // 2.使用useVModel包装props中的modelValue属性数据 （变成ref响应式数据）
  // 3.使用checked.value 就是在使用父组件数据
  // 4.使用checked.value = '数据' 赋值 会自动通知父组件改值 （自动触发emit('update:modelValue','数据')）
  setup (props, { emit }) {
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      // 通知父组件
      const newVal = !checked.value
      checked.value = newVal
      // 除了通知父组件外 满足其他事件 还需要自己emit
      emit('change', newVal)
    }
    return { checked, changeChecked }
  }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
