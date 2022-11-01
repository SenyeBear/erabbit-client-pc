<template>
  <div class="detail-logistics">
    <p>
      <span>{{list[0].text}}</span>
      <span>{{list[0].time}}</span>
    </p>
    <a href="javascript:;" @click="handlerLogistics(order)">查看物流</a>
    <!-- 物流信息弹窗 -->
    <!-- vue3.0传送门 -->
    <Teleport to="#model">
      <OrderLogistics ref="orderLogisticsCom"/>
    </Teleport>
  </div>
</template>
<script>
import { ref } from 'vue'
import { logisticsOrder } from '@/api/order'
import OrderLogistics from './order-logistics'
import { useLogistics } from '../index'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  async setup (props) {
    const list = ref(null)
    const { result } = await logisticsOrder(props.order.id)
    list.value = result.list
    return { list, ...useLogistics() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
