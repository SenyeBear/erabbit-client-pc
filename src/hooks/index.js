// 提供复用逻辑的函数（钩子）
import { ref, onUnmounted } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'

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

/**
 *  倒计时函数
 * @param {Integer} countdown - 倒计时秒数
 */
export const usePayTime = () => {
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown倒计时
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return {
    start,
    timeText
  }
}
