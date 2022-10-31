<template>
  <div class="member-order">
    <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tab-click="changeTab">
      <XtxTabsPanel
         v-for="item in orderStatus"
         :key="item.name"
         :label="item.label"
         :name="item.name">
      </XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <!-- 加载效果 -->
      <div v-if="loading" class="loading"></div>
      <!-- 没有数据的情况 -->
      <div v-if="!loading && orderList.length === 0" class="none">暂无数据</div>
      <!-- 商品数据 -->
      <OrderItem @on-cancel="handlerCancel" v-for="item in orderList" :key="item.id" :order="item"/>
    </div>
    <!-- 分页组件 -->
    <XtxPagination
      v-if="total>0"
      :current-page="reqParams.page"
      :page-size="reqParams.pageSize"
      :total="total"
      @current-change="reqParams.page=$event"
    />
    <!-- 取消原因 -->
    <OrderCancel ref="orderCancelCom"/>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList } from '@/api/order'
import OrderItem from './components/order-item'
import OrderCancel from './components/order-cancel'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel
  },
  setup () {
    const activeName = ref('all')

    // 监听tab切换的事件
    const changeTab = (tab) => {
      // 设置的constants数据索引和订单状态一致
      reqParams.orderState = tab.index
    }

    // 订单筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 2,
      orderState: 0
    })

    // 筛选条件发生变化重新发请求 page从第一页开始加载
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    watch(reqParams, () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }, { immediate: true })

    return { activeName, orderStatus, orderList, reqParams, loading, total, changeTab, ...useCancel() }
  }
}

// 取消订单逻辑
const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    // 拿到子组件实例调用方法
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  position: relative;
  min-height: 400px;
  background: #fff;
  padding: 20px;
    .loading {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
  }
  .none {
    height: 400px;
    text-align: center;
    line-height: 400px;
    color: #999;
  }
}

</style>
