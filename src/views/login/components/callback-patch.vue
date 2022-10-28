<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{errors}" autocomplete="off" class="xtx-form">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.account}" name="account" v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div class="errors.account" v-if="errors">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field  :class="{err:errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">{{time === 0 ? '发送验证码' : time}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.password}" name="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.rePassword}" name="rePassword" v-model="form.repassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/message'
import { useIntervalFn } from '@vueuse/core'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 表单校验
    // 定义表单校验规则对象
    const mySchema = {
      account: schema.accountRepeat,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 定义表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      repassword: null
    })
    // 发送验证码
    const formCom = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    // 发送手机验证码的函数
    const send = async () => {
      const valid = mySchema.mobile(form.mobile) // 返回true 或者 错误信息的字符串
      if (valid === true) {
        if (time.value === 0) {
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 点击提交完善信息
    const store = useStore()
    const router = useRouter()
    const submit = () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          // 存入用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 跳转页面
            router.push(store.state.user.redirectUrl)
            // 提示
            Message({ type: 'success', text: 'QQ完善信息成功' })
          })
        }).catch(err => {
          if (err.response.data) {
            Message({ type: 'error', text: '完善信息失败' })
          }
        })
      }
    }
    return { mySchema, form, formCom, time, send, submit }
  }
}
</script>

<style scoped lang='less'>
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
