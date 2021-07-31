<template>
    <div class="seller">
        <div class="seller-wrapper">
            <!-- 組件使用(間隔線) --> 
            <septalLine ></septalLine>
            <div class="seller-View">
                <div class="address-wrapper">
                    <div class="address-left">{{seller.address}}</div>
                    <div class="address-right">
                        <div class="content"></div>
                    </div>
                </div>
                <div class="pics-wrapper" v-if="seller.poi_env" ref="picsView">
                    <ul class="pics-list" ref="picsList">
                        <li class="pics-item" v-for="imgurl in seller.poi_env.thumbnails_url_list" ref="picsItem">
                            <img :src="imgurl">
                        </li>
                    </ul>
                </div>
                <div class="foodSafety-wrapper">
                    查看食品安全檔案
                    <span class="icon-keyboard_arrow_right"></span>   <!-- 右箭頭圖標(直接使用icomoon圖標) -->
                </div>
            </div>

            <!-- 組件使用(間隔線) -->
            <septalLine ></septalLine>
            <div class="tip-wrapper">
                <div class="delivery-wrapper">
                    配送服務: {{seller.app_delivery_tip}}
                </div>
                <div class="shipping-wrapper">
                    配送時間: {{seller.shipping_time}}
                </div>
            </div>

            <!-- 組件使用(間隔線) -->
            <septalLine ></septalLine> 
            <div class="other-wrapper">
                <div class="server-wrapper">
                    商家服務
                    <div class="poi-server" v-for="item in seller.poi_service">
                        <img :src="item.icon">
                        {{item.content}}
                    </div>
                </div>
                <div class="discounts-wrapper"> 
                    <div class="discounts-item" v-for="item in seller.discounts2">
                        <div class="icon">
                            <img :src="item.icon_url">
                        </div>
                        <div class="text">
                            {{item.info}}
                        </div>
                    </div>
                </div>
            </div>
            <!-- 組件使用(間隔線) -->
            <septalLine class="septalLine-bottom"></septalLine> 
        </div>
    </div>
</template>

<script>
//導入septalLine.vue組件
import septalLine from 'components/septalLine/SeptalLine';
//①導入better-scroll插件
import BScroll from 'better-scroll';

//導出
export default {
    data() {
        return {
            seller: {}
        }
    },
    created() {     //在完成創建實例此步驟，發起異步請求，獲取數據
        const that = this;          //將this儲存在變數中
        this.$axios.get('/api/seller')   //this指向Vue，通過axios發起get請求來獲取數據

        //axios回傳的物件是Promise(完成狀態)，所以我們可以用.then和.catch去處理成功和失敗結果
        .then(function (response){       //成功。獲取到數據之後的處理
            const dataSource = response.data;       //將回應數據中的data資料儲存在變數中
            if (dataSource.code == 0){      //判斷條件:如果數據獲取成功
                that.seller = dataSource.data;     //將data資料賦值給seller變數

                //②滾動初始化
                //this.$nextTick(): 即在DOM渲染之後觸發的函式
                that.$nextTick( () =>{    
                    if (that.seller.poi_env.thumbnails_url_list) {
                        const imgWidth = that.$refs.picsItem[0].clientWidth;   //獲取li的第一個元素寬度
                        const marginRight = 11;
                        const width = (imgWidth + marginRight)*that.seller.poi_env.thumbnails_url_list.length;
                        that.$refs.picsList.style.width = width + 'px';  //設置ul的寬度單位 width + 'px'
                        //通過new方式實例化了一個對象
                        //(傳入對象):通過this.$refs呼叫ref綁定的DOM元素，用來取得該區塊的寬度
                        that.sellerScroll = new BScroll(that.$refs.picsView, {scrollX: true});    //設置scrollX為true。(因預設為Y軸方向滾動)
                    }
                });
            }
        })
        .catch(function (error){    //失敗。出錯處理
            console.log(error);
        });
    },
    components: {
        //註冊組件
        septalLine,
        BScroll
    }
}
</script>

<style>
/* 導入css樣式 */
/* @import url("Seller.css"); */

.seller{
    position: absolute;
    left: 0;
    top: 190px;
    bottom: 0;
    width: 100%;
}

.seller .seller-wrapper .seller-View{
    padding-left: 15px;
}

.seller .seller-wrapper .seller-View .address-wrapper{
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid #f4f4f4;
}

.seller .seller-wrapper .seller-View .address-wrapper .address-left{
    flex: 1;
    background: url(./img/address.png) no-repeat left center;
    padding-left: 26px;
    padding-right: 31px;
    background-size: 14px 16px;   /* 寬 X 高 */
    font-size: 14px;
    line-height: 19px;
}

.seller .seller-wrapper .seller-View .address-wrapper .address-right{
    flex: 0 0 60px;
    background: url(./img/line.png) no-repeat left center;
    background-size: 1px 15px;   /* 寬 X 高 */
}

.seller .seller-wrapper .seller-View .address-wrapper .address-right .content{
    width: 100%;
    height: 100%;
    background: url(./img/phone.png) no-repeat center center;
    background-size: 18px 18px;   /* 寬 X 高 */
}

.seller .seller-wrapper .seller-View .pics-wrapper{
    padding: 10px 0;
    overflow: hidden;
    border-bottom: 1px solid #f4f4f4;
    white-space: nowrap;    /* 強制顯示inline-block不換行 */
}

.seller .seller-wrapper .seller-View .pics-wrapper .pics-list .pics-item{
    display: inline-block;
    margin-right: 11px;
    width: 93px;
    height: 75px;
}

.seller .seller-wrapper .seller-View .pics-wrapper .pics-list .pics-item img{
    width: 100%;
    height: 100%;
    border-radius: 2px;
}

.seller .seller-wrapper .seller-View .foodSafety-wrapper{
    padding: 15px 14px 15px 25px;
    background: url(./img/safety.png) no-repeat left center;
    background-size: 14px 16px;   /* 寬 X 高 */
    font-size: 14px;
}

.seller .seller-wrapper .seller-View .foodSafety-wrapper span{
    float: right;
    font-size: 14px;
    color: #656565;
}

.seller .seller-wrapper .tip-wrapper{
    padding: 15px;   /* 左右 */ 
}

.seller .seller-wrapper .tip-wrapper .delivery-wrapper{
    background: url(./img/delivery.png) no-repeat left center;
    background-size: 13px 15px;   /* 寬 X 高 */
    padding: 15px 0 15px 25px;
    font-size: 14px;
    border-bottom: 1px solid #f4f4f4;
}

.seller .seller-wrapper .tip-wrapper .shipping-wrapper{
    background: url(./img/time.png) no-repeat left center;
    background-size: 15px 15px;   /* 寬 X 高 */
    padding: 15px 17px 15px 25px;
    font-size: 14px;
    line-height: 18px;
}

.seller .seller-wrapper .other-wrapper{
    padding-left: 15px;
}

.seller .seller-wrapper .other-wrapper .server-wrapper{
    background: url(./img/server.png) no-repeat left center;
    background-size: 15px 15px;   /* 寬 X 高 */
    padding: 18px 0 17px 25px;
    font-size: 14px;
    border-bottom: 1px solid #f4f4f4;
}

.seller .seller-wrapper .other-wrapper .server-wrapper .poi-server{
    display: inline-block;
    margin-left: 17px;
}

.seller .seller-wrapper .other-wrapper .server-wrapper .poi-server img{
    width: 17px;
    height: 18px;
    margin-right: 6px;
    vertical-align: middle;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper{
    padding: 17px 24px 19px 0;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper .discounts-item{
    display: flex;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper .discounts-item .icon{
    flex: 0 0 25px;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper .discounts-item .icon img{
    width: 15px;
    height: 15px;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper .discounts-item .text{
    flex: 1;
    font-size: 14px;
}

.seller .seller-wrapper .septalLine-bottom{
    height: 20px;
}
</style>