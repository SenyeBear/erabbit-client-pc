<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{active: sortParams.sortFiled === null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{active: sortParams.sortFiled === 'publishTime'}" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{active: sortParams.sortFiled === 'orderNum'}" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{active: sortParams.sortFiled === 'evaluateNum'}" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i :class="{active: sortParams.sortFiled === 'price' && sortParams.sortMethod==='asc'}" class="arrow up" />
        <i :class="{active: sortParams.sortFiled === 'price' && sortParams.sortMethod==='desc'}"  class="arrow down" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory" @change="changeCheck">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount" @change="changeCheck">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 实现交互 和后台数据保持一致
    // 1.确认需要的数据 响应式
    const sortParams = reactive({
      inventory: null,
      onlyDiscount: null,
      sortFiled: null,
      sortMethod: null
    })
    // 2.提供给模板使用
    // 3.提供方法修改数据
    const changeSort = (sortFiled) => {
      // 因为price还需要判断asc还是desc 因此先判断是否传入的是price
      if (sortFiled === 'price') {
        // 把传入的sortFiled赋值给对象数据
        sortParams.sortFiled = sortFiled
        // 还需判断是否是第一次点击price排序 如果为第一次， sortMethod是null 点击后箭头向上
        if (!sortParams.sortMethod) {
          sortParams.sortMethod = 'desc'
        } else {
          // 不是第一次点击则正常判断取反
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 判断price外的字段 这些字段没有sortMethod 应该为null
        // 如果传入字段已经存在 没必要重复发送数据 停止运行
        if (sortFiled === sortParams.sortFiled) return
        sortParams.sortFiled = sortFiled
        sortParams.sortMethod = null
      }
      // 触发sort-change事件 通知父组件重新发请求
      emit('sort-change', sortParams)
    }
    // 勾选复选框同样改变了筛选条件需要重新发请求
    const changeCheck = () => {
      // 触发sort-change事件 通知父组件重新发请求
      emit('sort-change', sortParams)
    }
    return { sortParams, changeSort, changeCheck }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
