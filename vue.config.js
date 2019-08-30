const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const { BASE_URL, npm_package_version } = process.env

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
    config.plugins.delete('prefetch') // 移除 prefetch
    config.plugin('define')
      .tap(args => {
        args[0]['process.env'].VUE_APP_VERSION_INFO = `'当前版本信息  V${npm_package_version}  [${new Date().toLocaleString()}]'`
        return args
      })
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 设置代理
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://192.168.1.171:7301/mock/5d1ad62258260982ec16f910/offline',
        // target: 'http://192.168.12.110:9091', // 阿秋
        // target: 'http://192.168.60.148:9091', // 草莓
        target: 'http://192.168.12.31:9091', // 测试
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
}
