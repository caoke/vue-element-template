'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  lintOnSave: process.env.NODE_ENV === 'production',
  devServer: {
    port: 8004, // 端口
    proxy: {
      '/yyServer': {
        target: 'http://120.24.54.8',
        pathRewrite: {
          '^/yyServer': '/yyServer'
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src'),
        'views': resolve('src/views')
      },
      mainFiles: ['index'],
      extensions: ['.js', '.vue']
    }
  }

}
