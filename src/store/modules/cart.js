// 购物车模块

import { getNewCartGoods, mergeCart, findCart, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

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
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100 * c.count), 0) / 100 // 若还有浮点数 就取整 还需考虑四舍五入的情况
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 && !goods.isEffective)
    },
    // 已选商品列表 (从有效商品列表里筛出selected为true的)
    selectedList (state, getters) {
      return getters.validList.filter(goods => goods.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100 * c.count), 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.selectedList !== 0 && getters.selectedList.length === getters.validList.length
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
    },
    // 设置购物车
    setCart (state, payload) {
      // payload为空数组——清空 有值——设置
      state.list = payload
    }
  },
  // 所有actions操作都要区分两种状态 本地 || 登录 都需要返回promise
  actions: {
    // 合并购物车
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并成功 清空本地购物车
      ctx.commit('setCart', [])
    },
    // 加入购物车
    insertCart (ctx, payload) {
      // 判断操作是否完毕 => 返回promise
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) { // .state当前模块状态 .rootState根模块状态
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCart() // 再调一次接口拿服务端数据
          }).then(data => {
            ctx.commit('setCart', data.result) // 拿服务的最新数据再设置到本地
            resolve() // 表示执行成功
          })
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
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
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
          deleteCart([payload]).then(() => {
            return findCart() // 再调一次接口拿服务端数据
          }).then(data => {
            ctx.commit('setCart', data.result) // 拿服务的最新数据再设置到本地
            resolve() // 表示执行成功
          })
        } else {
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 批量删除购物车/ 清空无效商品
    batchDeleteCart (ctx, isClear) {
      // 单条删除 payload现在就是skuId
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(goods => goods.skuId)
          deleteCart(ids).then(() => {
            return findCart() // 再调一次接口拿服务端数据
          }).then(data => {
            ctx.commit('setCart', data.result) // 拿服务的最新数据再设置到本地
            resolve() // 表示执行成功
          })
        } else {
          // 判断删除选中商品列表还是失效商品列表
          // 找出选中商品列表 遍历 调用删除单条商品的actions方法
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(goods => {
            ctx.commit('deleteCart', goods.skuId)
          })
          resolve()
        }
      })
    },
    // 修改购物车商品 选中状态 和 数量
    updateCart (ctx, payload) {
      // payload必须包括skuId 知道修改谁 可能有selectd 可能有count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          updateCart(payload).then(() => {
            return findCart() // 再调一次接口拿服务端数据
          }).then(data => {
            ctx.commit('setCart', data.result) // 拿服务的最新数据再设置到本地
            resolve() // 表示执行成功
          })
        } else {
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters.validList.map(goods => goods.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCart() // 再调一次接口拿服务端数据
          }).then(data => {
            ctx.commit('setCart', data.result) // 拿服务的最新数据再设置到本地
            resolve() // 表示执行成功
          })
        } else {
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车商品规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 根据旧skuId找到旧的sku
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 删除
          deleteCart([oldGoods.skuId]).then(() => {
          // 原来商品的count+新商品skuId 合并一条新的
            // 加入
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart() // 再调一次接口拿服务端数据
          }).then(data => {
            ctx.commit('setCart', data.result) // 拿服务的最新数据再设置到本地
            resolve() // 表示执行成功
          })
        } else {
          // 根据旧skuId找到旧的sku
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 删除
          ctx.commit('deleteCart', oldSkuId)
          // 结合新sku信息 合并一条新的
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stocks } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stocks }
          // 加入
          ctx.commit('insertCart', newGoods)

          resolve()
        }
      })
    }
  }
}
