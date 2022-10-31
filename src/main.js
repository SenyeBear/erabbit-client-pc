import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 1.重置样式的库
import 'normalize.css'
// 2.自己项目的重置样式和公共样式
import '@/assets/styles/common.less'

// 引入我们自己封装的UI库
import ui from '@/components/library/index'

// mockjs
// import '@/mock'

// 注册使用
createApp(App).use(store).use(router).use(ui).mount('#app')
