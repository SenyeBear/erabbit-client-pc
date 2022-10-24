// 提供一个显示xtx-message组件的函数
// 该函数既可以导入直接使用 也可以挂载在vue实例原型上
import { render, createVNode } from 'vue'
import XtxMessage from './xtx-message.vue'

// 3.准备一个装载组件的容器
// 放在外面 创建一次就好 放在函数内部每次调用都会创建
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ type, text }) => {
  // 渲染组件
  // 1.导入组件
  // 2.将vue单文件语法模板 组件编译为虚拟节点（dom节点）
  // vue3.0 api createVNode(组件， 属性对象(props))
  const vnode = createVNode(XtxMessage, { type, text })
  // 3.准备一个装载组件的容器
  // 4.将虚拟节点渲染到容器
  // render(虚拟节点，dom容器)
  render(vnode, div)
  // 5.3s后销毁组件
  // 每次调用计时器前都先清空
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div) // 将div置空即可
  }, 3000)
}
