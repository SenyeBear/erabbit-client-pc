import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  modules: {
    cart,
    user,
    category
  },
  plugins: [
    // 默认存储在localStorage 其他的需要设置
    createPersistedState({
      // 本地存储的名字
      key: 'erabbit-client-pc-store',
      // 指定需要存储的模块
      path: ['user', 'cart']
    })
  ]
})
