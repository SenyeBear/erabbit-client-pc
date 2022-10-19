// 扩展vue原有的功能 全局组件 自定义指令 挂载原型方法 vue3没有过滤器

// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel'
import XtxMore from './xtx-more'
// 图片懒加载设置的默认图片
import defaultImg from '@/assets/images/200.png'
export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    defineDirective(app)
  }
}

// 定义指令
const defineDirective = (app) => {
  // 图片懒加载 v-lazy
  // 原理：图片地址先不存储在src，当图片进入可视区 将存储的图片地址设置给图片
  // 监听使用指令的DOM是否创建好：
  // Vue2.0 inserted构造函数
  // vue3.0 mounted构造函数 选项api的形式
  app.directive('lazy', {
    mounted (el, binding) {
      // 创建一个观察对象 观察使用指令的当前元素
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 进入可视区后停止观察
          observer.unobserve(el)
          // 处理图片加载失败 加载失败事件 onerror 加载成功事件 load
          el.onerror = () => {
            el.src = defaultImg
          }
          // 将指令上的地址给el的src
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      observer.observe(el)
    }
  })
}
