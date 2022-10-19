<template>
  <!-- 顶部通栏 -->
  <AppNavbar />
  <!-- 头部区域 -->
  <AppHeader />
  <!-- 吸顶 -->
  <AppHeaderSticky/>
  <!-- 中间区域 -->
  <main>
    <!-- 二级路由挂载点 -->
    <router-view />
  </main>
  <!-- 底部区域 -->
  <AppFooter />
</template>

<script>
import AppNavbar from '../components/app-navbar.vue'
import AppHeader from '../components/app-header.vue'
import AppFooter from '../components/app-footer.vue'
import AppHeaderSticky from '../components/app-header-sticky.vue'

import { useStore } from 'vuex'
export default {
  name: 'xtx-layout',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  // 获取分类数据
  setup () {
    // 页面初始化时获取
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less">
main {
  min-height: 600px;
}
</style>
