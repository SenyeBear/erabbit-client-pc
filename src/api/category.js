import request from '@/utils/request'

/**
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'GET')
}

/**
 * 获取顶级类目数据
 * @param {String} id - 顶级类目Id
 */
export const findTopCategory = (id) => {
  return request('/category', 'GET', { id })
}

/**
 * 获取二级类目筛选数据
 * @param {String} id - 二级类目Id
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'GET', { id })
}

/**
 * 获取二级类目商品（带筛选条件）
 * @param {Object} params - 请求参数
 */
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'POST', params)
}
