// 订单相关的api

import request from '@/utils/request'

/**
 * 结算页面 - 生成订单
 * @returns
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (address) => {
  return request('/member/address', 'post', address)
}

/**
 * 编辑收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (address) => {
  return request('/member/address', 'put', address)
}

/**
 * 删除收货地址信息
 * @param {Object} id - 地址对象id
 */
export const deleteAddress = (id) => {
  return request(`/member/address/${id}`, 'delete')
}

/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const submitOrder = (order) => {
  return request('/member/order', 'post', order)
}
