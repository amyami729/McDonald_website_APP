'use strict'
//webpack.base.conf用於開發及運行時共享的文件

//透過require引入模組（module.exports）
const path = require('path')         //引入path，用於處理文件路徑方法
const utils = require('./utils')       //引入utils檔案的模組（module.exports）
const config = require('../config')     //引入config資料夾，所指向的是index.js檔案的模組（module.exports）
const vueLoaderConfig = require('./vue-loader.conf')    //引入vue-loader.conf檔案的模組（module.exports）
// console.log('transformToRequireImg = ' + vueLoaderConfig.transformToRequire.img);  //查看輸出模組物件

function resolve (dir) {

  //path.join()方法為連接路徑。可以連接任意多個路徑字符串。要連接的多個路徑可做為参數傳入
  return path.join(__dirname, '..', dir)
}

//模組輸出
module.exports = {
    
  //path.resolve()方法為路徑解析。將多個路徑解析為一個規範化的絕對路徑
  //指定路徑(當前執行文件的所在位置, '../') [[表示回上上一層]]，輸出結果為 /Users/amy/Documents/vuejs-exercise/sell
  context: path.resolve(__dirname, '../'),  

  //entry：輸入配置文件
  entry: {  
    app: './src/main.js'   //設定entry檔案的進入點，也就是JavaScript模組檔案的入口處
  },
  //output：輸出配置文件
  output: {
    path: config.build.assetsRoot,  //設定output打包後的JavaScript檔案放置路徑，通常都會搭配path模組以形成絕對路徑
    filename: '[name].js',         //設定output打包後的JavaScript檔案名稱。[name]所對應的是app(key) ==> app.js

    //請求靜態資源的絕對路徑
    publicPath: process.env.NODE_ENV === 'production'   
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  //設定導入組件時的配置
  resolve: {
    extensions: ['.js', '.vue', '.json'],   //用來省略副檔名

    //設定指向路徑的縮寫
    alias: {
      'vue$': 'vue/dist/vue.esm.js',   
      '@': resolve('src'),
      'components': resolve('./src/components')
    }
  },
  //loader:針對不同檔案類型調用不同的loader方法去做轉換、編譯，也可以引入.js以外的其他類型檔案(不同的資源有不同的loader，要透過loader處理才能把資源載入)
  module: {
    rules: [
      {// .vue類型的文件處理
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {// .js類型的文件處理
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {// .png類型的文件處理
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {

          //圖片限制10KB。小於10KB的檔案進行base64轉碼，也就是將圖片轉為base64的格式，否則單獨生成文件
          limit: 10000,

          //圖片名稱。從build/utils.js和config/index.js可以知道這個路徑就是static/img目錄，並且圖片名是進行hash之後的值
          name: utils.assetsPath('img/[name].[hash:7].[ext]')  //所以最終編譯之後生成的文件名為static/img/圖片名.hash值.文檔後綴
        }
      },
      {// 音視頻多媒體處理
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {// 字體、圖標處理
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
