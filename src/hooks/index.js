// 提供复用逻辑的函数（钩子）
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
/**
 * 数据懒加载函数
 * @param {*} target -DOM对象
 * @param {*} apiFn  -api请求函数
 */
export const useLazyData = (apiFn) => {
  // 直接在函数内部定义target 避免每次组件使用时都要定义
  const target = ref(null)
  const result = ref([]) // 这里不能设置成null 因为最开始导出时result为null 则goods为null会报错
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是否进入可视区
      if (isIntersecting) {
        stop()
        // 调用API函数获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 产品区域需要滚动比较多才能去加载数据。
    {
      threshold: 0 // 设置为进入区域立即滚动 而不是达到多少进入比例（越大的盒子要滚动更多才能触发进入）
    }
  )
  return { result, target }
}
