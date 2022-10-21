import { createRouter, createWebHashHistory } from 'vue-router'
// 动态导入组件
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub-category')
const Goods = () => import('@/views/goods/index')
// 路由规则
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        component: SubCategory
      },
      {
        path: '/product/:id',
        component: Goods
      }
    ]
  }
]

// vue2.0 创建路由实例 new VueRouter({})
// vue3.0 创建路由实例 createRouter({})
const router = createRouter({
  // 使用hash路由模式
  history: createWebHashHistory(),
  routes,
  // 每次切换路由时滚动到页面顶部
  scrollBehavior () {
    // return { x: 0, y: 0 } // vue2.0 x y 控制
    return { left: 0, top: 0 } // vue3.0 left top
  }
})

export default router
