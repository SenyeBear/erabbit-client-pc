<template>
  <div class="member-order-detail" v-if="order">
    <!-- 订单头部 -->
    <OrderDetailAction :order="order"/>
    <!-- 订单进度 -->
    <DetailSteps :order="order" />
    <!-- 物流信息 -->
    <Suspense s v-if="[3,4,5].includes(order.orderState)">
      <template #default>
        <DetailLogistics :order="order"/>
      </template>
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 商品信息 -->
    <OrderInfo :order="order"/>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import OrderDetailAction from './components/detail-action'
import OrderInfo from './components/detail-info'
import DetailLogistics from './components/detail-logistics'
import { findOrderDetail } from '@/api/order'
import DetailSteps from './components/detail-steps'
export default {
  name: 'MemberOrderDetail',
  components: { OrderDetailAction, DetailLogistics, OrderInfo, DetailSteps },
  setup () {
    // 获取订单详情
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }

}
</script>

<style lang="less" scoped>
.member-order-detail {
  background-color: #fff;
  height: 100%;
}
.loading {
   height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
