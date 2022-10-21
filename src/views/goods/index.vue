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
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sale'
import GoodName from './components/goods-name'
import { findGoods } from '@/api/product'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodName },
  setup () {
    // 1.获取商品详情 进行渲染
    const goods = useGoods()
    return { goods }
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
