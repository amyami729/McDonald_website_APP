<template>
    <div class="shopcart">
        <div class="shopcart-warpper">
            <!-- 1.購物車內容左側 -->
            <div class="content-left" :class="{highligh: get_total_number_items > 0}">
                <div class="shopping-cart-warpper" @click="toggleList">
                    <span class="icon-shopping_cart" :class="{highligh: get_total_number_items > 0}"></span>    <!-- 購物車圖標(直接使用icomoon圖標) -->
                    <i class="num" v-show="get_total_number_items">{{get_total_number_items}}</i>
                </div>

                <div class="description-warpper">
                    <!-- v-show:控制模塊顯示隱藏（若資料不存在情況下則不顯示，系統才不會報錯） -->
                    <p class="total-price" v-show="get_total_price_items">¥{{ get_total_price_items }}</p>
                    <p class="shipping-cost" :class="{highligh: get_total_number_items > 0}">另需{{poiInfo.shipping_fee_tip}}</p>
                </div>
            </div>

            <!-- 2.購物車內容右側 -->
            <div class="content-right">
                <p :class="{ highligh: get_total_number_items > 0 }">{{checkout}}</p> 
            </div>

            <!-- 3.購物車詳情頁 --> 
            <div class="shopcart-detailPage" v-show="shopcart_detailPage_show" :class="{show:shopcart_detailPage_show}">
                <div class="promotion-information" v-if="poiInfo.discounts2">{{poiInfo.discounts2[0].info}}</div>
                <div class="shopcart-empty">
                    <h3 class="title">購物車</h3>
                    <div class="delete-all-items" @click="delete_all_items">
                        <img src="./img/ash_bin.png">
                        <span>清空購物車</span>
                    </div>
                </div>
                <div class="items-list" ref="itemsList">    <!-- 因為想取得該區塊的高度，所以在該區塊上設置ref屬性並添加屬性名 -->
                    <ul>
                        <li class="settleItems" v-for="settleItems in settle_accounts">
                            <div class="description-warpper">
                                <div class="description-left">
                                    <p class="item-name">{{settleItems.name}}</p>
                                    <p class="unit" v-show="!settleItems.description">{{settleItems.unit}}</p>
                                    <p class="description" v-show="settleItems.description">{{settleItems.description}}</p>
                                </div>
                                <div class="description-right">
                                    <span class="price">¥{{settleItems.min_price}}</span>
                                </div>
                            </div>
                            <div class="cartcontrol-warpper">
                                <!-- 組件使用 -->
                                <cartcontrol :commodity="settleItems"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="detailPage-bottom">
                    <i class="line"></i>
                </div>
            </div>
        </div>

        <div class="shopcart-backdrop" v-show="shopcart_detailPage_show" @click="hideMask"></div> 
    </div>
</template>

<script>
//導入Cartcontrol.vue組件
import cartcontrol from 'components/cartcontrol/Cartcontrol';
//①導入better-scroll插件
import BScroll from 'better-scroll';

    export default {
        components: {   //註冊組件
            cartcontrol,
            BScroll
        },
        data() {     //資料選項
            return {
                fold: true
            }
        },
        props: {
            poiInfo: {
                type: Object, 
                default: {}
            },
            settle_accounts: {
                type: Array,
                default(){
                    return [
                        // {
                        //     min_price: 23,
                        //     count: 3
                        // },
                        // {
                        //     min_price: 11,
                        //     count: 5
                        // }
                    ];
                }
            }
        },
        computed: {      //計算屬性(方法)
            //總個數
            get_total_number_items(){
                let totalNum = 0;
                //遍歷settle_accounts該陣列元素
                this.settle_accounts.forEach( goods => {
                    //總個數累加
                    totalNum += goods.count; //totalNum += goods裡的count資料
                });
                return totalNum;
            },
            //總金額
            get_total_price_items(){
                let totalPrice = 0;
                //遍歷settle_accounts該陣列元素
                this.settle_accounts.forEach( goods => {
                    //總價格累加
                    totalPrice += goods.min_price * goods.count; //當前商品價格*選擇的個數
                });
                return totalPrice;
            },
            //結帳按鈕
            checkout(){
                if (this.get_total_number_items > 0) {
                    return "去買單";
                }else{
                    return this.poiInfo.min_price_tip;
                }
            },
            //用來控制購物車詳情頁顯示隱藏
            shopcart_detailPage_show(){
                if (this.get_total_number_items === 0) {    //判斷如果總個數為0時，   
                    this.fold = true;     //折疊
                    return false;    //所以列表為不顯示
                }
                // 如果資料是摺疊的(fold=true) -> 就不顯示詳情頁面(isShow=false)
                // 如果資料是展開的(fold=false) -> 就顯示詳情頁面(isShow=true)
                const isShow = !this.fold;  
                
                //②滾動初始化
                if (isShow) {   //判斷如果詳情頁面是顯示狀態

                    //this.$nextTick(): 即在DOM渲染之後觸發的函式
                    this.$nextTick( () =>{    
                        if (!this.shopScroll) {    // !null -> true  如果沒有初始化this.shopScroll
                            //通過new方式實例化了一個對象
                            //(傳入對象):通過this.$refs呼叫ref綁定的DOM元素，用來取得該區塊的高度
                            this.shopScroll = new BScroll(this.$refs.itemsList, {click: true});   //設置click為true。(因better-scroll預設會阻止瀏覽器的原生click事件)
                        }else{    // 如果已經初始化this.shopScroll
                            this.shopScroll.refresh();    //refresh()方法:重新計算better-scroll，當DOM結構發生變化時務必要調用確保滾動的效果正常
                        }
                    });
                }
                return isShow;
            }
        },
        methods: {    //方法選項
            toggleList(){
                if (this.get_total_number_items === 0) {    //判斷如果總個數為0時，
                    return;
                }
                this.fold = !this.fold;    //為取反狀態。若真則顯示，若假則隱藏
            },
            //清空購物車商品
            delete_all_items(){
                this.settle_accounts.forEach( items => {   //items拿到對應的商品
                    items.count = 0;   //將對應的商品設置為0
                });
            },
            hideMask(){
                this.fold = true;   //折疊
            }
        }
    }
</script>

<style>
/* 導入css樣式 */
/* @import url("Shopcart.css"); */

.shopcart-warpper{
    width: 100%;
    height: 51px;
    background: #514f4f;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    z-index: 99;
}
/* 1.背景 */
.shopcart-warpper .highligh{
    background: #2d2b2a;
}

.shopcart-warpper .content-left{
    flex: 1;              /* 只填一個數值時，預設為flex-grow; 屏幕發生改變時，寬度會隨著改變 */
}

.shopcart-warpper .content-left .shopping-cart-warpper{
    width: 50px;
    height: 50px;
    background: #666666;
    border-radius: 50%;
    position: relative;
    top: -14px;
    left: 10px;
    text-align: center;
    float: left;
}
/* 2.購物車顏色、背景 */
.shopcart-warpper .content-left .shopping-cart-warpper .highligh{
    background: #ffd161;
    color: #2d2b2a;
}

.shopcart-warpper .content-left .shopping-cart-warpper span{
    display: block;
    border-radius: 50%;
    font-size: 28px;
    color: #c4c4c4;
    line-height: 50px;
}

.shopcart-warpper .content-left .shopping-cart-warpper .num{
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 50%;
    font-size: 9px;
    color: white;
    background: red;
    position: absolute;
    right: 0;
    top: 0;
}

.shopcart-warpper .content-left .description-warpper{
    float: left;
    margin-left: 13px;
}

.shopcart-warpper .content-left .description-warpper .total-price{
    font-size: 18px;
    line-height: 33px;
    color: white;
}

.shopcart-warpper .content-left .description-warpper .shipping-cost{
    font-size: 12px;
    color: #bab9b9;
    line-height: 51px;
}

/* 3.運費顯示 */
.shopcart-warpper .content-left .description-warpper .highligh{
    line-height: 12px;
}

.shopcart-warpper .content-right{
    flex: 0 0 110px;      /* flex: 伸展比例 壓縮比例 85px; 屏幕發生改變時，寬度是固定的 */
    font-size: 15px;
    color: #bab9b9;
    line-height: 51px;
    text-align: center;
}

/* 4.結帳按鈕 */
.shopcart-warpper .content-right .highligh{
    background: #ffd161;
    color: #2d2b2a;
}

.shopcart-warpper .shopcart-detailPage{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: -1;
}

.shopcart-warpper .show{
    transform: translateY(-100%);
}

.shopcart-warpper .shopcart-detailPage .promotion-information{
    height: 30px;
    text-align: center;
    font-size: 11px;
    background: #f3e6e6;
    line-height: 30px;
    color: #646158;
}

.shopcart-warpper .shopcart-detailPage .shopcart-empty{
    height: 30px;
    background: #f4f4f4;
}

.shopcart-warpper .shopcart-detailPage .shopcart-empty .title{
    float: left;
    border-left: 4px solid #53c123;
    padding-left: 6px;
    line-height: 30px;
    font-size: 12px;
}

.shopcart-warpper .shopcart-detailPage .shopcart-empty .delete-all-items{
    float: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 0;
}

.shopcart-warpper .shopcart-detailPage .shopcart-empty .delete-all-items img{
    height: 14px;
    margin-right: 9px;
    vertical-align: middle;    /* 垂直居中 */
}

.shopcart-warpper .shopcart-detailPage .shopcart-empty .delete-all-items span{
    font-size: 12px;
    vertical-align: middle;    /* 垂直居中 */
}

.shopcart-warpper .shopcart-detailPage .items-list{
    max-height: 380px;
    overflow: hidden;
    background: white;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems{
    /* height: 60px; */
    height: 38px;
    padding: 12px 12px 10px 12px;
    border-bottom: 1px solid #f4f4f4;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper{
    float: left;
    width: 240px;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper .description-left{
    float: left;
    width: 170px;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper .description-left .item-name{
    font-size: 16px;
    margin-bottom: 8px;

    /* 超出部分顯示省略號(...)，webkit適用於瀏覽器以及移動端 */
    -webkit-line-clamp: 1;     /* 用來定義塊元素顯示文本行數 */
    display: -webkit-box;     /* 將對象作為彈性伸縮盒子模型顯示 */
    -webkit-box-orient: vertical;     /* 設置或檢索伸縮盒子的子元素排列方式 */

    overflow: hidden;   /* 超出文字隱藏 */
    height: 16px;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper .description-left .unit{
    font-size: 12px;
    color: #b4b4b4;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper .description-left .description{
    font-size: 12px;
    color: #b4b4b4;

    /* 超出部分顯示省略號(...)，webkit適用於瀏覽器以及移動端 */
    -webkit-line-clamp: 1;     /* 用來定義塊元素顯示文本行數 */
    display: -webkit-box;     /* 將對象作為彈性伸縮盒子模型顯示 */
    -webkit-box-orient: vertical;     /* 設置或檢索伸縮盒子的子元素排列方式 */

    overflow: hidden;   /* 超出文字隱藏 */
    height: 12px;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper .description-right{
    float: right;
    width: 70px;
    text-align: right;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .description-warpper .description-right .price{
    font-size: 12px;
    line-height: 38px;
}

.shopcart-warpper .shopcart-detailPage .items-list .settleItems .cartcontrol-warpper{
    float: right;
    margin-top: 6px;
}

.shopcart-warpper .shopcart-detailPage .detailPage-bottom{
    height: 11px;
    background: #f4f4f4;
}

.shopcart-warpper .shopcart-detailPage .detailPage-bottom .line{
    border-left: 4px solid #ffd161;
}

.shopcart .shopcart-backdrop{
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
    background: rgba(7, 17, 27, 0.6);
}
</style>
