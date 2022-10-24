// 提供给vee-validate的校验函数
export default {
  // 用户名校验
  account (value) {
    // 非空
    if (!value) return '请输入用户名'
    // 字母开头 6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 密码校验
  password (value) {
    // 非空
    if (!value) return '请输入密码'
    // 6-24字符之间
    if (!/^\w{6,24}$/.test(value)) return '密码在6-24位之间'
    return true
  },
  // 手机号校验
  mobile (value) {
    // 非空
    if (!value) return '请输入手机号'
    // 1开头 3-9之间 剩下9位数字
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  // 验证码校验
  code (value) {
    // 非空
    if (!value) return '请输入验证码'
    // 6位数字
    if (!/^\d{6}$/.test(value)) return '验证码格式错误'
    return true
  },
  // 同意协议校验
  isAgree (value) {
    if (!value) return '请勾选登陆协议'
    return true
  }
}
