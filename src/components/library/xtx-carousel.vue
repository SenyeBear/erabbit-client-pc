<template>
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <li class="carousel-item" :class="{fade: index===i}" v-for="(item,i) in sliders" :key="i">
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span v-for="(item,i) in (sliders.length)" :key="i" :class="{active:index===i}" @click="index = i"></span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 自动轮播的间隔时间
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    // 控制显示图片的索引 默认显示第一张图片
    const index = ref(0)

    // 1.自动轮播图的逻辑
    // 设置定时器变量
    let timer = null
    // 自动轮播函数
    const autoPlayFn = () => {
      // 每次调用前先清掉原来的定时器 防止定时器重复添加
      clearInterval(timer)
      timer = setInterval(() => {
        // index同时控制着图片和对应小圆点的显示 是同步的
        index.value++
        // 当index超过传入的sliders的长度 index重置
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 设置自动轮播函数开启的条件
    // 当sliders有值 且autoPlay为true时
    // 因此要监听sliders变化 从无到有 存在有了sliders但是为空的情况因此还需判断
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        autoPlayFn()
      }
    }, {
      immediate: true // 初始化时立即调用一次（存在sliders不是动态获取而是静态的情况 如果不设置那么slider没变化就不起作用）
    })

    // 2.鼠标进入暂停轮播图自动播放 离开开启自动播放
    const stop = () => {
      if (timer) { clearInterval(timer) }
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 3.点击小圆点切换图片 点击箭头切换图片
    const toggle = (step) => {
      const newIndex = index.value + step
      // 判断newIndex是否超出合法值范围 超过范围就return停止执行
      if (newIndex >= props.sliders.length) {
        index.value = 0
        return
      }
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex
    }
    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
