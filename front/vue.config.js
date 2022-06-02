const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  outputDir: '../dist',

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8569',
      },
    }
  },

  transpileDependencies: [
    'vuetify'
  ],

  runtimeCompiler: true,
  // NOTE: set alias via `configureWebpack` or `chainWebpack`
  configureWebpack: {
    resolve: {
      alias: {
        'balm-ui-plus': 'balm-ui/dist/balm-ui-plus.js',
        'balm-ui-css': 'balm-ui/dist/balm-ui.css'
      }
    }
  }
})
