<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="mySchema" v-slot="{errors}">
      <!-- 账号登录 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="account" v-model="form.account" type="text" placeholder="请输入用户名" autocomplete="off" :class="{error: errors.account}" />
          </div>
          <!-- 错误提示 -->
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field name="password" v-model="form.password" type="password" placeholder="请输入密码" />
          </div>
          <!-- 错误提示 -->
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <!-- 手机号登录 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <!-- 错误提示 -->
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field name="code" v-model="form.code" type="text" placeholder="请输入验证码" />
            <span class="code">发送验证码</span>
          </div>
          <!-- 错误提示 -->
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <!-- 不管哪种登录 都需要同意协议 -->
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <!-- 错误提示 -->
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/message'
export default {
  name: 'LoginForm',
  components: {
    Form,
    Field
  },
  setup () {
    // 切换短信登录
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // 定义Form的validation-schema接收的校验规则函数对象
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 监听切换isMsgLogin 重置表单 清除校验结果
    // 拿到Form组件实例
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果html结构里使用的不是v-if而是v-show等，没有销毁Field组件 之前的校验结果仍在 因此需要清除
      // 调用Form组件提供的resetForm()
      formCom.value.resetForm()
    })
    // setup中获取组件实例 proxy
    // const { proxy } = getCurrentInstance()
    // console.log(proxy)
    // proxy.$message({ text: '测试' })
    // 点击登录按钮 对表单进行整体校验
    const login = async () => {
      // 调用Form组件提供的validate() 返回一个promise
      const valid = await formCom.value.validate()
      console.log(valid)
      Message({ type: 'success', text: '用户名或密码错误' })
    }
    return { isMsgLogin, form, mySchema, formCom, login }
  }
}

</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
