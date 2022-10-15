import { createRouter, createWebHashHistory } from 'vue-router'

// 路由规则
const routes = [

]

// vue2.0 创建路由实例 new VueRouter({})
// vue3.0 创建路由实例 createRouter({})
const router = createRouter({
  // 使用hash路由模式
  history: createWebHashHistory(),
  routes
})

export default router
