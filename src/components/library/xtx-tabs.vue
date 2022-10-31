<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 接收v-model的值
    // 将传给panel的数据转为响应式 这样值改变值就会通知父组件
    const activeName = useVModel(props, 'modelValue', emit)
    // 点击选项卡
    const tabClick = (name, index) => {
      activeName.value = name
      // 点击选项卡时还要进行其他功能 自定义事件 通知父组件
      emit('tab-click', { name, index })
    }
    // 给每一个panel传当前激活的name
    provide('activeName', activeName)

    return { activeName, tabClick }
  },
  /* render () {
    // 返回的内容会进行渲染
    // 1.借助babel 可以在vue中写jsx语法
    // 2.数据的使用 {}插值
    // 3.事件绑定 onClick={}
    const name = 'Tim'
    const title = 'ABC 123'
    const say = () => { console.log('hi jsx') }
    // 4.定义一个jsx对象
    const sub = [<sub>11123</sub>, <sub>22213</sub>]
    return <h1 title={title} onClick={say}>{name}{sub}</h1>
  } */
  render () {
    // 组织内容
    // 1. tabs组件大容器
    // 2.选项卡的导航菜单结构 nav
    // 3.内容容器 panel
    // 获取默认插槽内容
    const panels = this.$slots.default()
    // 获取动态panels节点集合
    const dynamicPanels = []
    panels.forEach(panel => {
      // 根据type里的name组件名判断是否是静态节点
      if (panel.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(panel)
      } else {
        panel.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })
    const nav = <nav>{
      dynamicPanels.map((item, i) => {
        // jsx里函数加括号 立即调用 因此为了传出name参数 不能写成this.tabClick(name) 而要用箭头函数
        return <a
                  onClick={() => { this.tabClick(item.props.name, i) }}
                  class={{ active: item.props.name === this.activeName }}
                  href="javascript:;"
                  >
                    {item.props.label}
                </a>
      })
    }</nav>

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style scoped lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
