// 提供商品相关API函数
import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id -商品id
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取相关商品推荐/猜你喜欢
 * @param {String} id -商品id - 传入就是相关推荐 不传就是猜你喜欢
 * @param {Integer} limit -商品数量
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热榜
 * @param {String} id - 商品id
 * @param {Integer} limit -商品数量
 * @param {Integer} type - 热销榜类型
 */
export const findGoodsHot = ({ id, limit = 3, type }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 获取商品评价信息
 * @param {String} id -商品id
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`/goods/:${id}/evaluate`, 'get')
  // axios遇见http https开头的地址 不会再加基地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * 获取热榜
 * @param {String} id - 商品id
 * @param {Object} params - 请求参数
 */
export const findGoodsCommentList = (id, { params }) => {
  // return request(`/goods/:${id}/evaluate/page`, 'get', { id, params })
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', { id, params })
}
