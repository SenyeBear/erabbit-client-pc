<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange"/>
      <!-- 商品面板 -->
      <div class="goods-list">
        <!-- 排序列表 -->
        <SubSort @sort-change="sortChange" />
        <!-- 商品列表 -->
         <ul>
          <li v-for="goods in goodsList" :key="goods.id" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 加载更多 -->
        <XtxInfiniteLoading @infinite="getData" :loading="loading" :finished="finished"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/goods-item'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      // 开启加载中状态
      loading.value = true
      // 设置二级分类ID 文档body里分类ID必须
      reqParams.categoryId = route.params.id
      // 发请求
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) { // 如果获取数据成功
          goodsList.value.push(...result.items)
          // 加载完一页page更新到下一页
          reqParams.page++
        } else { // 如果没有数据 代表加载完成
          finished.value = true
        }
        // 关闭加载中状态
        loading.value = false
      })
      // 更改了二级类目时需要重新加载数据 原来的goodsList finished reqParams 重置
      watch(() => route.params.id, (newVal) => {
        if (newVal && `/category/sub/${newVal}` === route.path) {
          finished.value = false
          goodsList.value = [] // 清空列表 加载更多组件被顶上来 进入了可视区 就加载数据
          // 重置reqParams请求数据
          reqParams = {
            page: 1,
            pageSize: 20
          }
        }
      })
    }

    // 需要重新发请求的情况：
    // 1.更改了排序数组的筛选数据
    const sortChange = (sortParams) => {
      finished.value = false
      // 合并请求参数 保留之前参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    // 2.更改了筛选数组的筛选数据
    const filterChange = (filterParams) => {
      finished.value = false
      // 合并请求参数 保留之前参数
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }
    return { loading, finished, getData, goodsList, sortChange, filterChange }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
