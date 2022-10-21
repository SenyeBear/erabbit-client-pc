<template>
   <div class="sub-filter" v-if="filterData && !filterLoading">
      <!-- 所有品牌 -->
      <div class="item">
        <div class="head">品牌：</div>
        <div class="body">
          <a @click="changeBrand(item.id)" :class="{active: item.id === filterData.brands.selectedBrand}" href="javascript:;"  v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
        </div>
      </div>
      <!-- 所有规格 -->
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}</div>
       <div class="body">
         <a @click="changeFilter(item, prop.id)" :class="{active: prop.id === item.properties.selectedProp}" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
       </div>
     </div>
   </div>
   <!-- 骨架屏 -->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 控制筛选区显示
    const filterLoading = ref(false)
    // 根据二级类目id变化获取筛选数据
    const filterData = ref(null)
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        // 数据请求时显示骨架屏
        filterLoading.value = true
        findSubCategoryFilter(route.params.id).then(data => {
          // console.log(data.result) 通过检查发现每一组筛选条件都缺失 全部 这一条件 需要补全
          // 给每一组数据加上选中的id
          // 1.品牌
          data.result.brands.selectedBrand = null // 设置为null 这样id也设为null 默认就选择了全部
          data.result.brands.unshift({ id: null, name: '全部' })
          // 2.属性
          data.result.saleProperties.forEach(item => {
            item.properties.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          // 设置修改好的属性
          filterData.value = data.result
          // 数据请求回来loading改为false
          filterLoading.value = false
        })
      }
    }, {
      immediate: true
    })
    // 获取筛选数据的函数
    const getFilterParams = () => {
      const filterParams = { brandId: '', attrs: [] }
      // 1.修改品牌属性
      if (filterData.value.brands) {
        filterParams.brandId = filterData.value.brands.selectedBrand // 其实默认就是全部就是null
      }
      // 2.修改属性条件
      filterData.value.saleProperties.forEach(item => {
        const prop = item.properties.find(prop => prop.id === item.properties.selectedProp)
        if (prop && prop.id !== undefined) {
          filterParams.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // return前可以检验一下brandId是否为空 null不会发送给后台
      // if (filterParams.brandId.length === 0) filterParams.brandId = null
      return filterParams
    }
    const changeBrand = (brandId) => {
      // 如果重复点击同一个品牌 停止运行
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.brands.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }

    const changeFilter = (item, propId) => {
      // 如果重复点击同一个属性 停止运行
      if (item.properties.selectedProp === propId) return
      item.properties.selectedProp = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeFilter }
  }
}
</script>

<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
        .xtx-skeleton {
      padding: 10px 0;
    }
  }
</style>
