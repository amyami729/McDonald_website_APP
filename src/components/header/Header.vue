<template>
    <div class="header">

        <!-- 1.互動欄 -->
        <div class="header-Interactive-bar">

            <div class="arrow-lift-warpper">
                <span class="icon-arrow_lift"></span>    <!-- 左箭頭圖標(直接使用icomoon圖標) -->
            </div>

            <form class="search-warpper">
                <span class="icon-search"></span>     <!-- 搜尋圖標(透過css編輯器索取資料夾圖標) -->
                <input type="text" class="search-bar" placeholder="在此賣場搜尋">  
            </form>

            <div class="more-warpper">
                <a href="#" class="pinduoduo-button">拼單</a>
                <div class="other-button">
                    <i class="small-radius"></i>
                    <i class="small-radius"></i>
                    <i class="small-radius"></i>          
                </div>
            </div>
        </div>

        <!-- 2.主體內容 -->
        <div class="header-main-content">

            <div class="main-McDonald-logo" :style="McDonald_logoImg">       <!-- 透過計算屬性獲取poiInfo該物件的pic_url資料(圖片)並調用McDonald_logoImg函式綁定到DOM -->
                <!-- <img :src="poiInfo.pic_url"> -->
            </div>

            <div class="main-McDonald-name">
                <h3>{{poiInfo.name}}</h3>     <!-- 透過props父子組件傳值的方式雙向資料綁定 -->
            </div>

            <div class="collect">
                <img src="./img/star.png">    <!-- 星星圖標(透過img標籤索取資料夾圖標) -->
                <span>收藏</span>
            </div>
        </div>

        <!-- 3.公告內容 -->
        <div class="header-bulletin-warpper">
            <!-- v-if:控制模塊顯示隱藏（若poiInfo.discounts2資料不存在情況下則不顯示，系統才不會報錯） -->
            <img class="bulletin-icon" v-if="poiInfo.discounts2" :src="poiInfo.discounts2[0].icon_url">       <!-- 透過props父子組件傳值的方式獲取poiInfo資料裡的icon_url圖標並綁定到DOM -->

            <span class="bulletin-message" v-if="poiInfo.discounts2" >
                {{poiInfo.discounts2[0].info}}      <!-- 透過props父子組件傳值的方式雙向資料綁定 -->
            </span>    

            <div class="activity-length-display" v-if="poiInfo.discounts2"  @click="show_detailPage">       <!-- 綁定點擊事件，並觸發show_detailPage函式 -->
                <a href="#">
                {{poiInfo.discounts2.length}}個活動            <!-- 透過props父子組件傳值的方式雙向資料綁定 -->
                <span class="icon-keyboard_arrow_right"></span>     <!-- 右箭頭圖標(直接使用icomoon圖標) -->
                </a>
            </div>
        </div>

        <!-- 4.背景圖 -->
        <div class="header-backgroundImg-warpper" :style="header_backgroundImg">     <!-- 透過計算屬性獲取poiInfo該物件的head_pic_url資料(圖片)並調用header_backgroundImg函式綁定到DOM -->
            <!-- <img :src="poiInfo.head_pic_url"> -->
        </div>

        <!-- 5.公告詳情頁 --> 
        <transition name="detail">     <!-- transition: Vue提供的套裝組件，用來添加過渡效果 -->
            <div class="header-bulletin-detailPage" v-show="isShow">     <!-- v-show:若為truthy就顯示，falsy則隱藏而非移除元素(是透過CSS的 display: none 來將元素隱藏) -->
                <div class="detailPage-warpper"> 

                    <div class="detailPage-content" :style="detailPage_backgroundImg">   <!-- 透過計算屬性獲取poiInfo該物件的poi_back_pic_url資料(圖片)並調用detailPage_backgroundImg函式綁定到DOM -->
                        <div class="detailPage-McDonald-logo" :style="McDonald_logoImg"></div>
                        <h3 class="detailPage-McDonald-name">{{poiInfo.name}}</h3>

                        <div class="score">
                            <!-- ④組件使用 -->
                            <mystar :score="poiInfo.wm_poi_score"></mystar>    <!-- 透過props父子組件傳值的方式獲取poiInfo資料裡的wm_poi_score評分並綁定到DOM -->
                            <span class="number">{{poiInfo.wm_poi_score}}</span>    <!-- 透過props父子組件傳值的方式雙向資料綁定 -->
                        </div>

                        <p class="detailPage-news">
                            {{poiInfo.min_price_tip}} <i>|</i> 
                            {{poiInfo.shipping_fee_tip}} <i>|</i>
                            {{poiInfo.delivery_time_tip}}
                        </p>

                        <p class="detailPage-time">
                            配送時間:
                            {{poiInfo.shipping_time}}
                        </p>

                        <div class="discounts" v-if="poiInfo.discounts2">
                            <p>
                                <img :src="poiInfo.discounts2[0].icon_url">
                                <span>{{poiInfo.discounts2[0].info}}</span>
                            </p>
                        </div>
                    </div>

                    <div class="close-warpper">
                        <span class="icon-close" @click="close_detailPage"></span>      <!-- 關閉圖標(直接使用icomoon圖標) 綁定點擊事件，並觸發close_detailPage函式 -->
                    </div>
                </div>  
            </div>
        </transition>
    </div>
</template>

<script>
//②導入Star.vue組件  （Star.vue 是掛載在 Header.vue 下）
import mystar from 'components/star/Star';

//導出 
export default {
    components: {
        //③註冊組件
        mystar
    },
    data() {      //資料選項，用來綁定數據到html，達成資料驅動畫面
        return {
            isShow: false   //用來設定公告詳情頁是否顯示，此預設為隱藏
        }
    },
    props:{       //組件傳值。父組件傳遞數據給子組件
        poiInfo:{
            type: Object,
            default: {}
        }
    },
    computed:{       //計算屬性(方法) >不能傳入參數
        header_backgroundImg(){
            return "background-image: url(" + this.poiInfo.head_pic_url + ");"   
        },
        McDonald_logoImg(){
            return "background-image: url(" + this.poiInfo.pic_url + ");"        
        },
        detailPage_backgroundImg(){
            return "background-image: url(" + this.poiInfo.poi_back_pic_url + ");"
        }
    },
    methods: {       //方法選項
        show_detailPage(){
            this.isShow = true;     //this指向show_detailPage，當我點擊公告詳情頁時，即顯示
        },
        close_detailPage(){
            this.isShow = false;    //this指向close_detailPage，當我觸發此函式時，即隱藏
        }
    }
}
</script>

<style>
/* 導入字體圖標 */
@import url("../../common/styles/icon.css"); 

/* 導入css樣式 */
/* @import url("Header.css"); */

.header{
    /* height: 160px; */
    height: 130px;
    padding-top: 20px;
}

.header .header-Interactive-bar{
    position: relative;
}

.header .header-Interactive-bar .arrow-lift-warpper{
    width: 50px;
    height: 31px;
    /* background: red; */
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
    line-height: 31px;
}

/* 左箭頭圖標 */
.header .header-Interactive-bar .arrow-lift-warpper span{
    display: inline-block;
    color: white;
}

.header .header-Interactive-bar .search-warpper{
    width: 100%;
    height: 31px;
    padding: 0 104px 0 50px;
    box-sizing: border-box;      /* 寬高度包括內容(content)，內邊距(padding)和邊框(border)，但不包括外邊距(margin) */
}

.header .header-Interactive-bar .search-warpper .icon-search{
    width: 28px;
    height: 31px;
    background: url(./img/titans_h5_search@2x.png) no-repeat 11px center;
    background-size: 13px 13px;   /* 寬 X 高 */
    position: absolute;
}

.header .header-Interactive-bar .search-warpper .search-bar{
    width: 100%;
    height: 31px;
    border: 0;
    box-sizing: border-box;     /* 設置盒子從邊框開始計算 */
    background: #cdcdcc;
    border-radius: 25px;
    padding-left: 28px;
    outline: none;       /* 去除選中時輸入框邊框 */
}

.header .header-Interactive-bar .more-warpper{
    /* width: 104px; */
    width: 65px;
    /* height: 31px; */
    height: 24px;
    /* background: blue; */
    position: absolute;
    right: 0;
    top: 0;
    padding: 7px 15px 0 24px;
}

.header .header-Interactive-bar .more-warpper .pinduoduo-button{
    width: 30px;
    height: 17px;
    color: white;
    line-height: 17px;
    border: 1px solid white;
    text-align: center;
    float: left;
    text-decoration: none;
    font-size: 10px;
}

.header .header-Interactive-bar .more-warpper .other-button{
    float: right;
    width: 20px;
    /* height: 31px; */
    height: 24px;
    margin-left: 13px;
    margin-top: 6px;
}

.header .header-Interactive-bar .more-warpper .other-button .small-radius{
    width: 3px;
    height: 3px;
    border-radius: 50%;
    border: 1px solid white;
    display: block;
    float: left;
}

/* 主體內容 */
.header .header-main-content{
    padding: 17px 10px 11px;
    height: 50px;
}

.header .header-main-content .main-McDonald-logo{
    width: 50px;
    height: 50px;
    background-size: 135% 100%;
    background-position: center;
    border-radius: 3px;
    float: left;
}

.header .header-main-content .main-McDonald-name{
    float: left;
    padding: 18px 0 0 12px;
}

.header .header-main-content .main-McDonald-name h3{
    font-size: 16px;
    font-weight: bold;   /* 加粗 */
    color: white;
}

.header .header-main-content .collect{
    width: 25px;
    height: 37px;
    float: right;
    text-align: center;
    padding-top: 6px;
}

.header .header-main-content img{
    width: 20px;
    height: 20px;
}

.header .header-main-content span{
    margin-top: 7px;
    color: white;
    font-size: 11px;
}

/* 公告內容 */
.header .header-bulletin-warpper{
    height: 16px;
    padding: 0 10px;
}

.header .header-bulletin-warpper .bulletin-icon{
    width: 16px;
    height: 16px;
    float: left;
    margin-right: 6px;
}

.header .header-bulletin-warpper .bulletin-message{
    font-size: 11px;
    color: white;
    float: left;
    line-height: 16px;
}

.header .header-bulletin-warpper .activity-length-display{
    float: right;
    font-size: 11px;
    line-height: 16px;
}

.header .header-bulletin-warpper .activity-length-display a{
    color: white;
    text-decoration: none;
    font-size: 11px;
    line-height: 16px;
}

.header .header-bulletin-warpper .activity-length-display a:hover{
    text-decoration: underline;
}

/* 右箭頭圖標 */
.header .header-bulletin-warpper .activity-length-display a span{
    font-size: 16px;
    line-height: 16px;
    float: right;
}

/* 背景圖 */
.header .header-backgroundImg-warpper{
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;

    background-size: 100% 135%;
    background-position: center -12px;
}

/* 公告詳情頁 */
.header .header-bulletin-detailPage{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(98, 98, 98, 0.8);
    z-index: 1000;
}

.header .header-bulletin-detailPage .detailPage-warpper{
    width: 100%;
    height: 100%;
    padding: 43px 20px 125px;
    box-sizing: border-box;         /* 寬高度包括內容(content)，內邊距(padding)和邊框(border)，但不包括外邊距(margin) */ 
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content{
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    border-radius: 10px;
    text-align: center;
    
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .detailPage-McDonald-logo{
    width: 60px;
    height: 60px;
    background-size: 135% 100%;
    background-position: center;
    border-radius: 3px;
    display: inline-block;
    margin-top: 40px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .detailPage-McDonald-name{
    font-size: 15px;
    color: white;
    margin-top: 13px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .score{
    height: 10px;
    margin-top: 6px;
    text-align: center;
    font-size: 0;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .score .mystar{
    display: inline-block;
    margin-right: 7px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .score .number{
    display: inline-block;
    font-size: 10px;
    margin: -10px 0 0 90px ;
    color: white;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .detailPage-news{
    font-size: 11px;
    color: #bababc;
    margin-top: 8px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .detailPage-news i{
    margin: 0 7px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .detailPage-time{
    font-size: 11px;
    color: #bababc;
    margin-top: 13px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .discounts{
    margin-top: 20px;
    padding: 0 20px;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .discounts p{
    padding-top: 20px;
    border-top: 1px solid #bababc;
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .discounts img{
    width: 16px;
    height: 16px;
    vertical-align: middle;     /* 垂直居中 */   
}

.header .header-bulletin-detailPage .detailPage-warpper .detailPage-content .discounts span{
    font-size: 11px;
    line-height: 16px;
    color: white;
}

.header .header-bulletin-detailPage .detailPage-warpper .close-warpper{
    padding-top: 20px;
    height: 40px;
    text-align: center;
}

.header .header-bulletin-detailPage .detailPage-warpper .close-warpper span{
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    font-size: 14px;
    color: white;
    display: inline-block;
    background: rgba(118, 118, 118, 0.7);
    border: 1px solid rgba(140, 140, 140, 0.9);
}

.header .header-bulletin-detailPage .detailPage-warpper .close-warpper span:hover{
    /* background: #FF5151; */
    background: rgba(118, 118, 118, 1.0);
}

/* Vue過渡效果
    <transition name="detail"> </transition>

    進入效果:
    .XXX-enter         過渡開始的狀態
    .XXX-enter-to      過渡結束的狀態
    .XXX-enter-active  過渡持續的時間、延遲、曲線函數

    離開效果:
    .XXX-leave         過渡開始的狀態
    .XXX-leave-to      過渡結束的狀態
    .XXX-leave-active  過渡持續的時間、延遲、曲線函數

*/
.detail-enter-active, .detail-leave-active{
    transition: 0.7s;
}

.detail-enter, .detail-leave-to{
    opacity: 0;
}

.detail-enter-to, .detail-leave{
    opacity: 1;
}

</style>