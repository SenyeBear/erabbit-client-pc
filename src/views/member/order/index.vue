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
      <OrderItem
        @on-cancel="handlerCancel"
        @on-delete="handlerDelete"
        @on-confirm="handlerConfirm"
        @on-logistics="handlerLogistics"
        v-for="item in orderList"
        :key="item.id"
        :order="item"/>
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
    <!-- 查看物流 -->
    <OrderLogistics ref="orderLogisticsCom"/>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import OrderItem from './components/order-item'
import OrderCancel from './components/order-cancel'
import OrderLogistics from './components/order-logistics'
import Message from '@/components/library/message'
import Confirm from '@/components/library/confirm'

export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup () {
    const activeName = ref('all')

    // 监听tab切换的事件
    const changeTab = (tab) => {
      // 设置的constants数据索引和订单状态一致 page从第一页开始加载
      reqParams.orderState = tab.index
      reqParams.page = 1
    }

    // 订单筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 2,
      orderState: 0
    })

    // 获取订单列表数据
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }

    // 筛选条件发生变化重新发请求
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    // 删除订单逻辑
    const handlerDelete = (order) => {
      Confirm({ title: '删除订单', text: '确认删除订单吗' }).then(() => {
        confirmOrder(order.id).then(() => {
          Message({ type: 'success', text: '确认收获成功' })
          // 重新获取列表数据
          getOrderList()
        })
      }).catch(err => { console.log(err) })
    }
    return { activeName, orderStatus, orderList, reqParams, loading, total, changeTab, ...useCancel(), handlerDelete, ...useConfirm(), ...useLogistics() }
  }
}

// 取消订单逻辑
export const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    // 拿到子组件实例调用方法
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}

// 确认收货逻辑
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ title: '确认收货', text: '确认收获后货款将打给卖家，是否确认收货？' }).then(() => {
      deleteOrder([order.id]).then(() => {
        Message({ type: 'success', text: '删除订单成功' })
        // 修改订单状态
        order.value.orderState = 4
      })
    }).catch(err => { console.log(err) })
  }
  return { handlerConfirm }
}

// 查看物流逻辑
export const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {

  }
  return { handlerLogistics, orderLogisticsCom }
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
