import Mock from 'mockjs'
import qs from 'qs' // nodejs内置的包 webpack运行在nodejs的环境上 打包时会自动把qs打包到依赖， query string

// 基本配置
Mock.setup({
  // 模拟网络延迟 随机延时500-1000ms
  timeout: '500-1000'
})

// 拦截接口 /my/test
// 1.接口地址的路径规则 匹配
// 2.请求方式
// 3.返回数据的方法 直接 or 函数返回
// Mock.mock(/\/my\/test/, 'get', {msg: '获取数据成功',result: []})
Mock.mock(/\/my\/test/, 'get', () => {
  // 随机数据逻辑
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname'
    }))
  }
  return { msg: '获取数据成功', result: arr }
})

// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', (config) => {
  // 取出get参数
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  // 取出来都是字符串形式 要转成数字形式
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)', // 价格 浮点数 100-200之间 两位浮点数 保留两位小数
      // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items: items
    }
  }
})
