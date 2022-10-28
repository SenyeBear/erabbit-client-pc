<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{errors}" autocomplete="off" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send">{{time === 0 ? '发送验证码' : time}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 准备需要的信息 qq昵称 头像 openId
    // 表单校验
    // 发送验证码 先校验 发api请求 倒计时
    // 进行绑定 绑定成功就是登录成功
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_qq_1
      })
    }

    // 定义表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 定义校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

    const formCom = ref(null)
    // 利用vueuse的useIntervalFn简化使用定时器
    // 设置倒计时秒数
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)// 不立即开启
    // 组件销毁时也要清除定时器
    onUnmounted(() => {
      pause()
    })
    // 发送手机验证码的函数
    const send = async () => {
      // 利用vee-validate-schema的校验函数对象校验手机号格式
      const valid = mySchema.mobile(form.mobile) // 返回true 或者 错误信息的字符串
      if (valid === true) {
        // 没有在倒计时才能点击发送
        if (time.value === 0) {
          const res = await userQQBindCode(form.mobile)
          console.log(res)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败时使用vee的错误函数提示错误信息 setFieldError(字段，错误信息) Message组件一般是请求时用 校验时直接用vee
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 立即绑定
    const store = useStore()
    const router = useRouter()
    // const route = useRoute()
    const submit = () => {
      // 表单校验
      const valid = formCom.value.validate()
      // 发请求
      if (valid) {
        userQQBindLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 2.跳转到首页或来源页
            router.push(store.state.user.redirectUrl)
            // 3.消息提示
            Message({ type: 'success', text: '登录成功' })
          })
        }).catch(err => {
          if (err.response.data) {
            Message({ type: 'error', text: err.response.data.message || '绑定失败' })
          }
        })
      }
    }
    return { nickname, avatar, form, mySchema, formCom, send, time, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>
