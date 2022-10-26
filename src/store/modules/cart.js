// 购物车模块

import { getNewCartGoods } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品内容
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 库存stock > 0 商品有效标识isEffective === true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) { // getters第一个参数state 第二个参数接收getters本模块其他getters属性 rootGetters根
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100 先乘100转为整数进行计算再/100
      return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100 * c.count), 0) / 100 // 若还有浮点数 就parseInt
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车要存入哪些字段 和后端保持一致
      // 插入数据规则：
      // 1.找是否有相同商品
      // 2.有相同商品 查询数量 累加到payload 删除原来商品 保存到最新位置
      // 3.没有相同商品 保存到最新位置
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      console.log(sameIndex)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来的
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息 nowPrice stock isEffective
      // goods 商品对象字段不固定 对象中有哪些字段就改哪些
      // 判断字段值的合法性
      // goods 商品对象必须有skuId 才能找到给谁修改
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') { // goods中有布尔类型字段
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  // 所有actions操作都要区分两种状态 本地 || 登录 都需要返回promise
  actions: {
    // 加入购物车
    insertCart (ctx, payload) {
      // 判断操作是否完毕 => 返回promise
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) { // .state当前模块状态 .rootState根模块状态
          // 已登录

        } else {
          // 未登录 - 本地
          ctx.commit('insertCart', payload)
          resolve() // 表示执行成功
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) { // .state当前模块状态 .rootState根模块状态
          // 已登录

        } else {
          // 未登录 - 本地
          // 有几个商品发几个请求 同时发生 => 所有请求都发送完毕 一并修改本地数据
          // Promise.all([promise数组]).then((dateList) => {})
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data, i) => { // promiseArr返回的dataList 于 list 元素对应索引一致
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          }).catch(err => {
            reject(err)
          })
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      // 单条删除 payload现在就是skuId
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录

        } else {
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
