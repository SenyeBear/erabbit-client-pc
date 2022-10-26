// 购物车相关api

import request from '@/utils/request'

/**
 * 获取商品的 最新价格 库存 是否有效
 * @param {String} skuId - sku id
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
