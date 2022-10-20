<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="topCategory.id">{{topCategory.name}}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height:500px" auto-play />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" >
              <p>{{sub.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <div class="head">
          <h3>- {{item.name}} -</h3>
          <p class="tag">{{item.desc}}</p>
          <XtxMore :path="`/category/sub/${item.id}`"/>
        </div>
        <div class="body">
          <GoodsItem v-for="goods in item.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/category'
import { useStore } from 'vuex'
import GoodsItem from './components/goods-item'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // 轮播图数据
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })

    // 面包屑+所有子分类数据 从vuex拿
    const route = useRouter()
    const store = useStore()
    const topCategory = computed(() => {
      // 避免category没数据 先提前定义一个 有值了再重新赋值 这样就避免了写很多v-if
      let category = {}
      // 根据动态路由中的id去找vuex子模块category里的list下对应的元素
      const data = store.state.category.list.find(item => item.id === route.currentRoute.value.params.id)
      if (data) category = data
      return category
    })

    // 获取各个子类目下推荐商品
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.currentRoute.value.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    // 监听id改变重新获取数据
    watch(() => route.currentRoute.value.params.id, (newVal) => {
      // 值的变化可能是从无值到有，从有到无，无值的情况就不需要请求了
      // newVal && getSubList()
      // 保证只在切换顶级类目时发请求
      if (newVal && (`/category/${newVal}` === route.currentRoute.value.path)) {
        getSubList()
      }
    }, {
      immediate: true // 在在初始化时就监听 触发一次
    })

    return { sliders, topCategory, subList }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
    .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
