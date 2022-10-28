import XtxConfirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'

// 导入被创建的组件
// 使用creatVnode 创建虚拟节点
// 准备在页面创建一个dom容器装在组件
// 使用render 渲染组件到容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 返回一个promise对象 点击确认或取消都要销毁组件
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 点击取消的回调函数
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 点击确认的回调函数
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 把回调函数通过props传给组件使用
    const vn = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  })
}
