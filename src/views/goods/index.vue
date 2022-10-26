<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container" >
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[0].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem to="/">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"/>
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodName :goods="goods"/>
          <!-- sku组件 -->
          <GoodsSku :goods="goods" @change="changeSku"/>
          <!-- 数量组件 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory"/>
          <!-- 按钮组件 -->
          <XtxButton @click="insertCart()" type="primary" style="margin-top:20px;">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type="1" />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch, provide } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sale'
import GoodName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn.vue'
import { findGoods } from '@/api/product'
import Message from '@/components/library/message.js'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    // 1.获取商品详情 进行渲染
    const goods = useGoods()

    // 接收子组件改变sku的函数
    const changeSku = (sku) => {
      // 修改商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的sku 可能有数据可能为空（表示没选择完）-用于加入购物车做判断 加入购物车传值
      currSku.value = sku
    }

    // 提供goods数据给后代使用
    provide('goods', goods)

    // 数量组件的默认值
    const num = ref(1)

    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
      // 加入购物车行为前 判断规格是否完整
      if (currSku.value && currSku.value.skuId) {
        // 调用action
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
          id,
          skuId,
          name,
          picture: mainPictures[0],
          price: price,
          nowPrice: price,
          count: num.value,
          attrsText,
          selected: true,
          isEffective: true,
          stock
        })
        Message({ type: 'success', text: '加入购物车成功' })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    return { goods, num, changeSku, insertCart }
  }

}
// 获取商品详情的函数
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 为了实现更新组件 在获取数据赋值前将数据重置为空
        goods.value = null // v-if 引发组件销毁和创建
        nextTick(() => { // vue的dom更新是异步的，nextTick在dom更新后再执行
          goods.value = data.result
        })
      })
    }
  }, {
    immediate: true
  })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
