'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'production',
  devServer: {
    port: 8004 // 端口
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
