<template>
  <div id="app">
    <!-- ④組件使用 -->
    <!-- 1、Header(菜單) -->
    <myheader :poiInfo="poiInfo"></myheader>

    <!-- 2、Nav(評價) (當我點擊該按鈕時，) -->
    <mynav :commentNum="commentNum"></mynav>

    <!-- 3、主體內容(即跳轉到對應內容) -->
    <!-- 路由出口 -->
    <!-- 路由匹配到的組件將渲染在這 -->
    <keep-alive>   <!-- keep-alive:當router切換到其他組件時，keep-alive包裹動態組件將會緩存狀態顯示 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
 

<script>
//②導入Header.vue組件  （Header.vue 是掛載在 App.vue 下）
import  myheader from 'components/header/Header';
import mynav from 'components/nav/Nav';

//導出
export default {
  name: 'App',
  components: {
    //③註冊組件
    myheader,
    mynav
  },
  data() {
    return {
      poiInfo: {},    //定義空物件。通過axios異步請求方式獲取後端數據，push進來
      commentNum: 0   //定義初始值。通過axios異步請求方式獲取後端數據，push進來
    }
  },
  created() {   //在完成創建實例此步驟，發起異步請求，獲取數據
      const that = this;          //將this儲存在變數中

      //goods
      this.$axios.get('/api/goods')        //this指向Vue，通過axios發起get請求來獲取數據

          //axios回傳的物件是Promise(完成狀態)，所以我們可以用.then和.catch去處理成功和失敗結果
          .then(function (response) {      //成功。獲取到數據之後的處理 
              // console.log(response);
              const dataSource = response.data;   //將回應數據中的data資料儲存在變數中
              // console.log(dataSource);
              if (dataSource.code == 0) {     //判斷條件:如果數據獲取成功
                  that.poiInfo = dataSource.data.poi_info;      //將data資料中的poi_info賦值給poiInfo空物件
                  // console.log(that.poiInfo);
              }
          })
          .catch(function (error) {         //失敗。出錯處理
              console.log(error);
          });

      //ratings
      this.$axios.get('/api/ratings')

          .then(function (response) {
              const dataSource = response.data;
              if (dataSource.code == 0) {
                  that.commentNum = dataSource.data.comment_num;
              }
          })
          .catch(function (error) {
              console.log(error);
          });
  }
}
</script>

<style></style>
