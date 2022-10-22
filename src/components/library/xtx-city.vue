<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle">
      <span class="placeholder" v-if="!fullLocation">请选择配送地址</span>
      <span class="value" :class="{actice: visible}" v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible" ref="target">
      <!-- 数据加载中 -->
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 控制option显示隐藏
    const visible = ref(false)
    // 提供给模板使用的省市区数据
    const allCityData = ref([])
    // 正在加载数据
    const loading = ref(false)
    // 计算属性：根据allcityData获取当前显示地区的数组
    const currList = computed(() => {
      // 默认省级
      let currList = allCityData.value
      // 市级
      if (changeResult.provinceCode && changeResult.provinceName) {
        // 从省级数组里找点击的那个市的数组 更新currList
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 县地区级
      if (changeResult.cityCode && changeResult.cityCode) {
        // 从市级数组里找点击的那个区县的数组 更新currList
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }
      return currList
    })

    // 记录city组件里选择的省市区数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    // 点击span的时候记录数据
    const changeItem = (item) => {
      // 根据数据的level判断省市区 存入对应数据字段
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 拼接数据
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 点到最后一级 表示选择完毕 关闭option 通知父组件
        close()
        emit('change', changeResult)
      }
    }

    // 点击和关闭的函数
    const open = () => {
      visible.value = true
      // 打开后请求数据
      loading.value = true
      getCityData().then(data => {
        allCityData.value = data
        // 拿到数据后关闭加载中状态
        loading.value = false
      })
      // 每次打开都要清空之前的选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 给select提供一个取反方法
    const toggle = () => {
      visible.value ? close() : open()
    }

    // 点击组件外部元素也要实现关闭操作
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    return { visible, loading, currList, target, open, close, toggle, changeItem }
  }
}
// 获取省市区数据的函数
// 利用oss 因为不是向自己的服务器发请求不涉及接口问题，不需要特意使用request 直接axios get就行
const getCityData = () => {
//  检测本地有无缓存
// 1.无缓存 发请求 再缓存
// 2.有缓存 取出数据
// => 这个函数里的操作既可能是异步的也有可能是同步的 => 因此封装成promise 统一在then里获取数据
  return new Promise((resolve, reject) => {
  // 数据存储在哪？约定存在window.cityData字段
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // 缓存
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}

</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    // 加载中效果
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
