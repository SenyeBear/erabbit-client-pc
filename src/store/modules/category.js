// 分类模块

// 存储的分类数据
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state: () => {
    return {
      // 分类信息集合
      // 将topCategory里的9个常量遍历拿出存入list，格式是对象格式。因为根据接口数据个数，返回的是对象数组。
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 加载数据成功后需要修改list所以需要mutations函数
  mutations: {
    setList (state, headCategory) {
      state.list = headCategory
    },
    // 修改当前一级分类下的open状态-显示
    show (state, item) {
      // 找到当前鼠标悬停的这个一级分类
      const category = state.list.find(category => category.id === item.id)
      // 展示这个一级分类下的二级分类
      category.open = true
    },
    // 修改当前一级分类下的open状态-隐藏
    hide (state, item) {
      // 找到当前鼠标悬停的这个一级分类
      const category = state.list.find(category => category.id === item.id)
      // 隐藏这个一级分类下的二级分类
      category.open = false
    }
  },
  // 需要向后台加载数据，所以需要actions函数获取数据
  actions: {
    async getList ({ commit }) {
      // const { result } = await findAllCategory()
      // const res = await findAllCategory()
      const { result } = await findAllCategory()
      // 实现分类弹层显示隐藏：给一级分类添加open属性控制二级分类显示隐藏
      result.forEach(item => {
        item.open = false
      })
      // 获取数据成功，提交mutations进行数据修改
      commit('setList', result)
    }
  }

}
