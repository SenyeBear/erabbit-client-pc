<template>
  <div>
    <nav class="app-topnav">
      <div class="container">
        <ul>
          <template v-if="profile.token">
            <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{profile.account}}</a></li>
            <li><a @click="logout" href="javascript:;">退出登录</a></li>
          </template>
          <template v-else>
            <li><RouterLink to="/login">请先登录</RouterLink></li>
            <li><a href="javascript:;">免费注册</a></li>
          </template>
          <li><a href="javascript:;">我的订单</a></li>
          <li><a href="javascript:;">会员中心</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
          <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'AppTopnav',
  setup () {
    // 获取到用户信息才能切换导航菜单
    const store = useStore()
    // 为了让数据响应式 使用vuex的state需要计算属性
    const profile = computed(() => {
      return store.state.user.profile
    })

    // 退出登录
    // 1.清空本地存储和vuex用户信息
    // 2.跳转到登录页
    const router = useRouter()
    const logout = () => {
      store.commit('user/setUser', {})
      router.push('/login')
    }
    return { profile, logout }
  }
}
</script>

<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
