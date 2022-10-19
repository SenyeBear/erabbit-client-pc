<template>
  <div class='home-category' @mouseleave="categoryId = null">
    <ul class="menu">
        <!-- 鼠标滑过 记录下当前li的id 用于显示对应li的推荐弹层 -->
      <li :class="{active:categoryId===item.id}" v-for="item in menuList" :key="item.id" @mouseenter="categoryId = item.id">
        <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
        <template v-if="item.children">
          <RouterLink
          :to="`/category/sub/${sub.id}`"
           v-for="sub in item.children"
           :key="sub.id"
           >
           {{sub.name}}
          </RouterLink>
        </template >
        <!-- 还没有数据的时候 使用骨架 -->
        <template v-else>
          <XtxSkeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)" />
+         <XtxSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </template>
      </li>
    </ul>
    <!-- 对应弹层 -->
    <div class="layer">
      <!-- 根据经过的是普通li还是brand显示对应文字 -->
      <h4 v-if="currCategory">{{currCategory.id === 'brand' ? '品牌' : '分类'}} <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 商品推荐 -->
      <ul v-if="currCategory && currCategory.goods && currCategory.goods.length">
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌推荐 -->
      <ul v-if="currCategory && currCategory.brands && currCategory.brands.length">
        <li class="brand" v-for="item in currCategory.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{item.place}}</p>
              <p class="name ellipsis">{{item.name}}</p>
              <p class="desc ellipsis-2">{{item.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { reactive, computed, ref } from 'vue'
import { findBrand } from '@/api/home'

export default {
  name: 'HomeCategory',
  // 1. 获取vuex的一级分类，并且只需要两个二级分类
  // 2. 需要在组件内部，定义一个品牌数据
  // 3. 根据vuex的分类数据和组件中定义品牌数据，得到左侧分类完整数据(9分类+1品牌)数组
  // 4. 进行渲染即可
  setup () {
    const store = useStore()
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{
        id: 'brand-children',
        name: '品牌推荐',
        // 品牌推荐数据
        brands: []
      }]
    })
    // 获取左侧分类的完整数据
    const menuList = computed(() => {
      // 取出九个一级分类及其对应二级分类中的两个子项
      const list = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          // 展示左侧分类对应的推荐商品弹层需要的数据
          goods: item.goods
        }
      })
      // 把brand也加入构成一个完整数据数组
      list.push(brand)
      return list
    })

    // 显示左侧分类对应的推荐弹层
    // 设置一个变量记录当前li的id
    const categoryId = ref(null)
    // 根据li的id拿到对应的一级分类数据 进而拿到其中的推荐商品
    const currCategory = computed(() => {
      // 响应式数据取值必须.value
      return menuList.value.find(item => item.id === categoryId.value)
    })

    // 获取品牌推荐数据
    findBrand().then(data => {
      brand.brands = data.result
    })
    return { menuList, categoryId, currCategory }
  }

}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0,0,0,0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&:active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
    .layer {
    width: 990px;
    height: 500px;
    background: rgba(255,255,255,0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
              width: 95px;
              height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
    // 品牌的样式
          li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
  .xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
}

</style>
