<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  // render: h => {}
  // 1.单页面文件中 使用render template标签要去除
  // 2.render函数返回值 组件内容（html结构）
  // 3. vue2.0的h函数是需要传参进来 vue3.0是导入进来
  // 4.render('标签名', 标签的属性对象, 标签子节点)
  render () {
    // 获取插槽 render函数的属性所以用this 默认插槽为default 具名插槽.名字
    const items = this.$slots.default()
    // 拿到默认插槽对象数组 给每个插槽最后增加一个箭头 除了最后一个插槽元素
    const dynamicItems = []
    items.forEach((item, i) => {
      dynamicItems.push(item)
      if (i < (items.length - 1)) {
        dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dynamicItems)
  }
}
</script>

<style lang='less'>
// 取出scoped属性让样式作用到xtx-bread-item组件 ::deep 深度穿透应用于父子组件 而bread和bread-item是插槽关系
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
