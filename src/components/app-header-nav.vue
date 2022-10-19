<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
     <li v-for="item in list" :key="item.id" @mouseenter="show(item)" @mouseleave="hide(item)">
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">
        {{item.name}}
      </RouterLink>
      <div class="layer" :class="{open: item.open}">
        <ul>
          <li v-for="i in item.children" :key="i.id">
            <RouterLink :to="`/category/sub/${i.id}`" @click="hide(item)">
              <img :src="i.picture" alt="">
              <p>{{i.name}}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    // vue3使用vuex仓库的数据要通过计算属性函数
    const list = computed(() => {
      return store.state.category.list
    })
    const show = (item) => {
      store.commit('category/show', item)
    }
    const hide = (item) => {
      store.commit('category/hide', item)
    }
    return { list, show, hide }
  }
}
</script>

<style scoped lang='less'>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    // 设置每个一级分类的open控制二级分类弹层显示隐藏后 不再由css的hover控制
    //   > .layer {
    //     height: 132px;
    //     opacity: 1;
    //   }
    }
  }
}
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  // 由一级分类的open属性控制class中有无open类 进而控制显示隐藏
  &.open {
    height: 132px;
    opacity: 1;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
