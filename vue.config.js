const { defineConfig } = require('@vue/cli-service')
// commonjs导入语法
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 使用绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  }
  // 配置：把10kb以下图片转为base64格式 vuecli创建的webpack模板自动将10kb以下图片转为base64 因此可以不加这段配置
  // chainWebpack: config => {
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap(options => Object.assign(options, { limit: 10000 }))
  // }
  // 写了报错 object为undefined or null
})
