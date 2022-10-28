<template>
  <LoginHeader>联合登录</LoginHeader>
  <div class="container">
    <section v-if="isBind">
      <div class="unbind">
        <div class="loading"></div>
      </div>
    </section>
    <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId"/>
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId"/>
    </div>
  </section>
  </div>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/message'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
export default {
  name: 'LoginCallback',
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  setup () {
    const hasAccount = ref(true)
    const isBind = ref(true)
    const unionId = ref(null)
    const store = useStore()
    const router = useRouter()
    if (QC.Login.check()) { // 确保qq已经登录
    // qq第三方唯一标识
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // 请求后台 判断是否能qq登录
        userQQLogin(openId).then(data => {
          // 登录成功 返回用户信息
          // 1.存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 2.跳转到首页或来源页
            router.push(store.state.user.redirectUrl)
            // 3.消息提示
            Message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(err => {
          // 登录失败 表示该qq号未和系统绑定
          isBind.value = false
          console.log(err)
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
 padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
