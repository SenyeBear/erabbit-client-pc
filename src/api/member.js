// 个人中心相关api

import request from '@/utils/request'

/**
 * 获取我的收藏分页数据
 * @param {*} param0
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
