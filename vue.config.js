const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '/lucky',
  chainWebpack: (config) => {
    config.module
      .rule('rpx')
      .test(/\.css$/)
      .use('rpx-vw-loader')
      .loader('rpx-vw-loader')
      .options({
        // designWidth设计稿的尺寸，默认750：designWidth / 750 * 100 = vw
        designWidth: 6240
      })
      .end();
  }
})
