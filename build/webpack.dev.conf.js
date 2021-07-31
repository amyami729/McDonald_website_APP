'use strict'
//webpack-dev-server是一個小型的Node.js Express伺服器
//透過require引入模組（module.exports）
const utils = require('./utils');         //引入utils檔案的模組（module.exports）
const webpack = require('webpack');       //引入webpack，用來編譯工具
const config = require('../config');      //引入config資料夾，所指向的是index.js檔案的模組（module.exports）
const merge = require('webpack-merge');   //引入webpack-merge，用來合併配置文件所使用
const baseWebpackConfig = require('./webpack.base.conf');       //引入webpack.base.conf檔案的模組，用於開發及運行時共享的文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

//middleware:是一個可以接收request和response物件的函數，每個中間件可以針對所收到的物件進行修改處理或是解析處理，處理完畢後再決定是否繼續傳給下個中間件或是中斷傳遞行為
//中間件(middleware)作用:把已經編譯好的文件把放置內存中，當瀏覽器需要訪問時，將直接對內存訪問
//ⓐ引入express模組，專門為webpack開發的内置中間件(middleware)
const express = require('express');  

//ⓑ使用express，用來建立一個Express伺服器
const app = express();

// 1、讀取json數據
const goods = require('../data/ProductPageMenu.json');
const ratings = require('../data/ProductPageEvaluation.json');
const seller = require('../data/ProductPageMerchant.json');

// 建立中間件
// app.use('/api',routes);

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

//baseWebpackConfig和當前配置(參數2之後的物件)進行合併
const devWebpackConfig = merge(baseWebpackConfig, {
    module: {

        //調用utils.js裡的styleLoaders方法
        //調用對應的loaders進行處理，並針對css相關文件進行編譯操作
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },

    // devtool:為開發工具。cheap-module-eval-source-map 的開發速度更快
    devtool: config.dev.devtool,

    // 這些 devServer 選項應該在 /config/index.js 中自定義
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,      //是否壓縮
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,    //ⓒ設定port位置
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,   //公共路徑
        proxy: config.dev.proxyTable,
        quiet: true,       // 需要 FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
    },

    // 2、建立基本GET路由、建立中間件'/api'並設定鏈值 >>通過鏈接獲取數據
    //before()方法:在伺服器内部的其他中間件啟動之前所執行的自定義的中間件
    before(app) {
        // 定義client對 `/api/goods` 發出GET request時的處理
        app.get('/api/goods', (request, response) => {       //告訴伺服器在我們設定的路徑/api/goods，client可以透過get取得json資料、並建立一個路由函數(中間件)

            // 返回json數據給客戶端
            // response.setHeader('Content-Type', 'application/json');   //設置響應數據的內容型態：格式
            // response.send(JSON.stringify(goods, null, 2));           //將響應JSON數據轉換為字符串並漂亮打印，傳送
            response.json(goods);
        }),
        app.get('/api/ratings', (request, response) => {

            // 返回json數據給客戶端
            response.json(ratings);
        }),
        app.get('/api/seller', (request, response) => {

            // 返回json數據給客戶端
            response.json(seller);
        })
      }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),      //自動刷新網頁
        new webpack.NamedModulesPlugin(),            // HMR 在更新時在控制台中顯示正確的文件名
        new webpack.NoEmitOnErrorsPlugin(),        //當編譯生成一些錯誤時，它會跳過那些編譯代碼，使編譯後的運行打包不會出現錯誤

        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',     //設定編譯打包後的HTML檔案名稱
            template: 'index.html',     //設定編譯打包後的模板檔案名稱
            inject: true                //自動將編譯打包後的.css、.js檔案注入到index.html
        }),
    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {

            // 發布新的端口，e2e 測試所必需的
            process.env.PORT = port;

            // 將端口添加到 devServer 配置
            devWebpackConfig.devServer.port = port;

            // 添加友好錯誤插件
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(devWebpackConfig);
        }
    });
});