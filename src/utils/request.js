// 1.初始化axios实例
// 2.设置请求拦截器 携带token
// 3.设置响应拦截器 解构出响应数据 处理拦截token失效
// 4.定义一个函数使用配置好的axios发请求

import axios from 'axios'
import store from '@/store'
import router from '@/router'

const instance = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front.itheima.net',
  timeout: 5000
})

// 使用axios.interceptors.request.use 方法来更新每个请求头并在Authorization HTTP头中设置访问令牌
// 以config.headers 对象中的Authorization 头为目标，并将存储在localStorage 中的Bearer 令牌设为其值
// 请求拦截器
instance.interceptors.request.use(config => {
  // config配置请求
  // 1.获取用户信息对象
  const { profile } = store.state.user
  // 2.检测有无token
  if (profile.token) {
    // 3.有就在头部携带
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  // 处理请求错误的函数
  return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(res => {
  // 解构出响应数据 axios默认包一层data
  const { data } = res
  return data
}, err => {
  // 处理响应错误的函数
  // 处理拦截token失效
  // token失效返回401状态码
  if (err.response && err.response.status === 401) {
    // 1.清空无效用户信息
    store.commit('user/setUser', {})
    // 2.跳转到登录页
    // 3.跳转传参
    // 拿到原页面路由信息 带了参数还需要传参 因此需要拿到完整路径使用fullPath
    // 这里需要.value 因为文档说明了currentRoute属性是ref响应式数据
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // 为了解析地址参数顺利，提前将参数转为uri编码
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 由于基地址可能不止在向后台发送请求时使用 向oss（object storage service）请求图片时也可能用到 因此导出
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'

// 请求工具函数
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // 根据method判断参数类型
    // get请求 params传参
    // 其他请求 data传参
    // [] 动态属性 里面为js表达式时 表达式的值为key
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
