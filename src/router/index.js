import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
// RouterView不是原生标签 因此还需要引入使用
import store from '@/store'
import { h } from 'vue'
// 动态导入组件
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub-category')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')
const Cart = () => import('@/views/cart')
const Checkout = () => import('@/views/member/pay/checkout')
const Pay = () => import('@/views/member/pay')
const Result = () => import('@/views/member/pay/result')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home/index.vue')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/detail')
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
      },
      {
        path: '/cart',
        component: Cart
      },
      {
        path: 'member/checkout',
        component: Checkout
      },
      {
        path: 'member/pay',
        component: Pay
      },
      {
        path: '/pay/callback',
        component: Result
      },
      {
        path: '/member',
        component: MemberLayout,
        children: [{
          path: '/member',
          component: MemberHome
        },
        // vue2.0可以的写法
        // {
        //   path: '/member/order',
        //   component: MemberOrder
        // },
        // {
        //   path: '/member/order/:id',
        //   component: MemberOrderDetail
        // }
        // vue3.0 必须用嵌套
        {
          path: '/member/order',
          component: { render: () => h(<RouterView />) },
          children: [
            {
              path: '',
              component: MemberOrder
            },
            {
              path: ':id',
              component: MemberOrderDetail
            }
          ]
        }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
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

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 判断登录状态 约定需要登录的路由 地址以/member开头
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    // 记录登录完的回跳地址
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})
export default router
