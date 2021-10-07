//使用 `import` 指令加載Vue.js構建版本
//②導入App.vue組件  （App.vue 是掛載在 main.js 下）
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import axios from 'axios';

// 1、Ｏ導入組件( 定義(路由)組件 )
import Goods from 'components/goods/Goods';
import Ratings from 'components/ratings/Ratings';
import Seller from 'components/seller/Seller';

Vue.config.productionTip = false;

//使用VueRouter插件
Vue.use(VueRouter);
//將axios直接绑在原型链上，並註冊一個$axios自定義變數
//如果是这样注册一个$axios變數和项目其他成员协作的时候就必须注明你注册的变量名称
Vue.prototype.$axios = axios;

// 2、定義路由
const routes = [
  {
    path: '/',            //設定進入頁面時從根目錄開始
    redirect: '/goods'    //重定向後跳轉到該頁面（設定預設跳轉內容）
  },
  {
    path: '/goods',    //跳轉路徑
    component: Goods   //註冊組件。Ｏ導入的組件名稱
  },
  {
    path: '/ratings',
    component: Ratings
  },
  {
    path: '/seller',
    component: Seller
  }
];

// 3、創建router實例(創建router建構函式產生新的物件)
const router = new VueRouter({
    routes,

    //router構造配置，用來添加樣式類名。(linkActiveClass此關鍵字預設值:router-link-active)
    linkActiveClass: 'active'
});

new Vue({
  el: '#app',           //將創建對象掛載到DOM元素（app） 
  components: { 
    //③註冊App組件。透過import方式將App組件載入
    App 
  },   
  template: '<App/>',    //④組件使用

  // 4、創建掛載點跟實例
  router
});
