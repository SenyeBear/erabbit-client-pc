<template>
  <div class="xtx-pagination">
    <a @click="changePager(myCurrentPage - 1)" v-if="myCurrentPage > 1" href="javascript:;">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a @click="changePager(i)" v-for="i in pager.btnArr" :key="i" href="javascript:;" :class="{active: i === myCurrentPage}">{{i}}</a>
    <span v-if="pager.end < pager.pageCount">...</span>
    <a @click="changePager(myCurrentPage + 1)" v-if="myCurrentPage < pager.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 需要的数据
    // 1.约定的按钮个数 如果要是动态的就设置为响应式
    const count = 5
    // 2.当前显示的页码
    const myCurrentPage = ref(7)
    // 3.总页数 总条数 / 每页显示条数 向上取整
    const myTotal = ref(100)
    const myPageSize = ref(10)
    // 4.其他数据依赖以上数据得到 总页数 起始按钮 结束按钮 按钮数组 因此用计算属性
    const pager = computed(() => {
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 按钮个数 => 起始按钮 结束按钮 按钮数组
      // 理想情况 start end 都在合法范围内
      const offset = Math.floor(count / 2) // 因为想让当前页码居中 因此向下取整按钮数的一半
      let start = myCurrentPage.value - offset
      let end = start + count - 1
      // 如果start小于第一页
      if (start < 1) {
        start = 1
        // end也会因此变化 所以也需要判断
        end = (start + count - 1) > pageCount ? pageCount : start + count - 1
      }
      // 如果end大于总页数
      if (end > pageCount) {
        end = pageCount
        start = (end - count + 1) < 1 ? 1 : end - count + 1
      }
      // 确认完start和end的值 创建按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, btnArr, start, end }
    })

    // 监听props的变化 更新组件内部数据
    watch(props, () => {
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, {
      immediate: true // 有可能父组件传入的total不是动态拿的，是一开始就写死的，这时props没改变就不会触发watch。因此需要加上immediate
    })

    // 切换分页的函数
    const changePager = (page) => {
      myCurrentPage.value = page
      // 通知父组件
      emit('current-change', page)
    }
    return { count, myCurrentPage, pager, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
