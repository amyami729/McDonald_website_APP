<template>
    <div class="nav">

        <!-- 三個選項鈕分別創建三個組件。Goods、Ratings、Seller -->
        <!-- 使用router-link將組件引入 -->
        <!-- router-link:預設會被渲染一個`<a>`標籤 -->
        <!-- to:跳轉。通過該屬性指定鏈接 -->
        <router-link to="/goods" class="nav-item">菜單 <i class="line"></i> </router-link>      
        <router-link to="/ratings" class="nav-item">評價({{commentNum}}) <i class="line"></i> </router-link>
        <router-link to="/seller" class="nav-item">商家 <i class="line"></i> </router-link>
    </div>
</template>

<script>
    //導出
    export default {
        props: {
            commentNum: {
                type: Number,
                default: 0     //預設值
            }
        }
    }
</script>

<style>
   .nav{
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
   }
   .nav .nav-item{
       flex: 1;
       text-align: center;
       font-size: 13px;
       text-decoration: none;
       color: #666666;
       position: relative;
       border-bottom: 1px solid #e4e4e4;
       z-index: 89;
   }
   .nav .active{
       color: #FF5151;
   }
   .nav .active .line{
       width: 60px;
       height: 2px;
       display: inline-block;
       background: #FF5151;
       position: absolute;
       left: 50%;
       bottom: 0;
       margin-left: -30px;
   }

</style>