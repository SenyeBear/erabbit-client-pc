<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right><XtxMore path="/" /></template>
      <!-- 面板内容 -->
      <!-- 使用骨架与vue动画 -->
      <!-- 父容器一定要有定位 -->
      <div ref="target" style="position: relative; height: 406px">
        <Transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
                <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="">
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
                </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else :bg="'#f0f9f4'"/>
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
// import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // 获取新鲜好物数据
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    // return { goods }

    // 数据懒加载
    const { result, target } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
