<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div class="large" v-show="show" :style="[{backgroundImage:`url(${images[currIndex]})`}, backgroundImagePosition]"></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!-- 遮罩层色块 -->
       <div class="layer" v-show="show" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const currIndex = ref(0)
    // 控制遮罩层显示隐藏
    const show = ref(false)
    // 1.定义需要的数据 数据将作用于样式
    // 遮罩层坐标
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 背景图坐标
    const backgroundImagePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })

    // 2.调用vueuse库的useMouseInElement()获取坐标数据
    // 绑定需要监听的元素对象
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 监听数据改变修改样式
    watch([elementX, elementY, isOutside], () => {
      // 3.计算坐标
      // 先用一个临时变量记录设置给样式的坐标
      const position = { x: 0, y: 0 }
      // 判断鼠标移动范围
      // x轴
      if (elementX.value < 100) position.x = 0
      else if (elementX.value > 300) position.x = 200
      else position.x = elementX.value - 100
      // y轴
      if (elementY.value < 100) position.y = 0
      else if (elementY.value > 300) position.y = 200
      else position.y = elementY.value - 100

      // 4.修改相应坐标数据 给样式赋值
      // 遮罩层坐标
      layerPosition.left = position.x + 'px'
      layerPosition.top = position.y + 'px'
      // 背景图坐标
      backgroundImagePosition.backgroundPositionX = -2 * position.x + 'px'
      backgroundImagePosition.backgroundPositionY = -2 * position.y + 'px'

      // 5.设置是否显示预览大图
      show.value = !isOutside.value
    })

    return { currIndex, show, layerPosition, backgroundImagePosition, target }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
