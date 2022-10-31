<template>
  <div class="member-home">
    <!-- 概览 -->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item"/>
    </HomePanel>
    <!-- 组件 -->
    <HomePanel title="我的足迹">
      <!-- <GoodsItem /> -->
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>

<script>
import { ref } from 'vue'
import HomeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import GoodsItem from '@/views/category/components/goods-item'
import { findCollect } from '@/api/member'
export default {
  name: 'MemberHome',
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  setup () {
    // 调用模拟接口
    const collectGoods = ref([])
    findCollect({
      page: 1,
      pageSize: 4
    }).then(data => {
      collectGoods.value = data.result.items
    })
    return { collectGoods }
  }
}
</script>

<style lang="less" scoped>
:deep(.xtx-carousel .carousel-btn.prev) {
  left: 10px;
}
:deep(.xtx-carousel .carousel-btn.next) {
  right: 10px;
}

</style>
