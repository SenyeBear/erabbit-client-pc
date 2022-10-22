<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img @click="changeSku(item, val)" :class="{selected: val.selected,disabled: val.disabled}" v-if="val.picture" :src="val.picture" :title="val.name">
          <span @click="changeSku(item, val)" :class="{selected: val.selected,disabled: val.disabled}" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import powerSet from '@/vender/power-set'
// 声明一个特殊字符
const spliter = '★'
// 得到路径字典对象的方法
const getPathMap = (skus) => {
// 1.得到所有sku的集合 props.goods拿
// 2.从所有sku中筛选出有效sku
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
    // 3.根据有效sku幂集算法得到所有子集
    // 拿到的数据是对象 要先转为可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      //   可选值数组的子集
      const valueArrPowerSet = powerSet(valueArr)
      // 4.根据子集在路径字典对象中存储键值对
      valueArrPowerSet.forEach(arr => {
        // 键要字符型 根据arr得到字符串的key 约定key是形式 ['a','b'] => 'a★b'
        const key = arr.join(spliter)
        // 给pathMap插入数据 存储在pathMap的两个意义:表示该sku可选; 便于之后选择完整sku后查找对应信息
        // 有相同的key 没相同的key
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 获取当前选择span的方法
const getSelectedValues = (specs) => {
  const arr = [] // 数组长度与规格数组一致
  specs.forEach(item => {
    // 先取出被选中的span
    const selectedVal = item.values.find(val => val.selected)
    // 存入数组中, 有值存值 没值undefined
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 更新span禁用状态的方法
// 何时调用: 初始化时; 点击span时
const updateDisabledStatus = (specs, pathMap) => {
  // 1.约定每个span的可选状态由自身的disabled属性控制
  specs.forEach((item, i) => { // 记录下遍历每一行规格的索引i 与selectedValues中的各属性顺序对应
    // 先获取选中对象的数组
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2.判断val是否选中 如果已经选中则无需改变状态
      if (val.name === selectedValues[i]) return false
      // 3.拿当前的值按顺序套入选中对象的数组
      selectedValues[i] = val.name
      // 4.剔除数组中undefined数据 按分隔符拼接key （filter内return undefined转为布尔值为false，undefined元素被筛掉）
      const key = selectedValues.filter(val => val).join(spliter)
      console.log(pathMap)
      console.log(key)
      // 5.拿着key去pathMap查找是否存在数据 有就可以点击 没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    // 1.点击规格选项 选中与取消选中 约定每一个按钮都拥有自己的选中状态数据 selected
    // 1.1 点击已选中按钮 取消当前选中即可
    // 1.2 点击未选中按钮 排他 取消当前规格下其他选中 留下当前选中
    const changeSku = (item, val) => {
      // 在样式上设置disabled只是样式上被禁用 需要js控制 点击有disabled属性的span就停止运行
      if (val.disabled) return false
      // 判断点击的span是否被选中
      if (val.selected) {
        val.selected = !val.selected
      } else {
        item.values.forEach(val => { val.selected = false })
        val.selected = true
      }
      // 点击span:更新span禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
    }

    // 调用得到路径字典对象的方法
    const pathMap = getPathMap(props.goods.skus)

    // 组件初始化:更新span禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
