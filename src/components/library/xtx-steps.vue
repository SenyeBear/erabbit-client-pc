<script>
// 获取当前组件实例的属性和方法 {ctx}仅支持开发环境 {proxy}开发和生产环境都支持
import { getCurrentInstance } from 'vue'
export default {
  name: 'XtxSteps',
  props: {
    // 传入激活的序号
    active: {
      type: Number,
      default: 1
    }
  },
  // render函数作用 渲染标签 xtx-steps组件的结构由render动态渲染来的
  render (props) {
    const { ctx } = getCurrentInstance()
    // 获取默认插槽内容
    const items = ctx.$slots.default()
    // 获取所有xtx-steps-item列表
    const dynamicItems = []
    // 判断是静态item还是动态遍历的item
    items.forEach(item => {
      if (item.type.name === 'XtxStepsItem') {
        dynamicItems.push(item)
      } else {
        item.children.forEach(child => {
          dynamicItems.push(child)
        })
      }
    })
    // 获取到所有xtx-steps-item列表后，遍历为每个item生成结构 将item结构数组存到itemsJsx变量 该变量之后会插入xtx-steps的 div中
    const itemsJsx = dynamicItems.map((item, i) => {
      return <div class="xtx-steps-item" class={{ active: i < props.active }}>
      <div class="step"><span>{i + 1}</span></div>
      <div class="title">{item.props.title}</div>
      <div class="desc">{item.props.desc}</div>
    </div>
    })
    // render函数return的内容就是渲染的内容。此时xtx-steps组件的结构就被渲染出来
    return <div class="xtx-steps">{itemsJsx}</div>
  }
}
</script>
<style lang="less">
.xtx-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before,&::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,&::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
         left: 0;
      }
      &::after {
         right: 0;
       }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
