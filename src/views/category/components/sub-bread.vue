<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
    <XtxBreadItem :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性从vuex获取顶级和二级类目数据
    // 数据格式： {top:{id,name}, sub: {id,name}}
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      // 此时route拿到的是二级类目id 因此不能直接find
      store.state.category.list.forEach(top => {
        if (top.children) { // 如果顶级类目有children才遍历find
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) { // 如果找到了sub
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return { category }
  }
}
</script>

<style>
</style>
