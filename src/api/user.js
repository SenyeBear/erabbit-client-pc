// 用户相关接口
import request from '@/utils/request'

/**
 * 账号密码登录
 * @param {String} account - 账号
 * @param {String} password - 密码
 * @returns
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * 获取手机号登录的验证码
 * @param {String} mobile - 手机号
 * @returns
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 手机号登录
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码 默认123456
 * @returns
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * QQ登录
 * @param {String} unionId - 三方标识 qq唯一标识
 * @param {String} source -  注册来源，1为pc 客户端类型
 * @returns
 */
export const userQQLogin = (unionId, source = 6) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * 获取QQ登录绑定手机号的验证码
 * @param {String} mobile - 手机号
 * @returns
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录绑定手机号
 * @param {String} unicode - 三方标识 qq唯一标识
 * @param {String} source -  注册来源，1为pc 客户端类型
 * @param {String} code -  验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, source = 6, code }) => {
  return request('/login/social/bind', 'post', { unionId, source, code })
}

/**
 * 校验帐号是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userCheckAccount = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取QQ登录完善信息的手机号的验证码
 * @param {String} mobile - 手机号
 * @returns
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录完善信息
 * @param {String} unicode - 三方标识 qq唯一标识
 * @param {String} source -  注册来源，1为pc 客户端类型
 * @param {String} code -  验证码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, account, mobile, code, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { account, mobile, code, password })
}
