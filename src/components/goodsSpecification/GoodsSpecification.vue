<template>
    <transition name="moveBottom">
        <div class="goodsSpecification" v-show="isShow" ref="foodView">
            <div class="specification-wrapper">
                <div class="specification-content">
                    <div class="image-wrapper">
                        <img class="itemImg" :src="specification.picture">
                        <span class="icon-close" @click="closeView"></span>
                        <img src="./img/share.png" class="share-button">
                        <img src="./img/more.png" class="more-button">
                    </div>
                    <div class="content-wrapper">
                        <h3 class="itemName">{{specification.name}}</h3>
                        <p class="monthly-saled">{{specification.month_saled_content}}</p>
                        <img class="products-featured" v-show="specification.product_label_picture" :src="specification.product_label_picture">
                        <p class="products-information">
                            <span class="price">¥{{specification.min_price}}</span>
                            <span class="unit">/{{specification.unit}}</span>
                        </p>
                        <div class="cartcontrol-wrapper">
                            <!-- 組件使用(商品遞增／遞減) -->
                            <cartcontrol :commodity="specification"></cartcontrol>
                        </div>
                        <!-- v-show:控制模塊顯示隱藏(以下兩種情況顯示模塊) -->
                        <div class="buy" v-show="specification.count == null || specification.count == 0" @click="addFirst">選規格</div>
                    </div>
                </div>

                <!-- 組件使用(間隔線) -->
                <septalLine></septalLine>
                <div class="rating-wrapper">
                    <div class="rating-top">
                        <div class="like-ratio" v-if="specification.rating">
                            <span class="title">{{specification.rating.title}}</span>
                            <span class="popularity-value">
                                ({{specification.rating.like_ratio_desc}}
                                <i>{{specification.rating.like_ratio}}</i>)
                            </span>
                        </div>
                        <div class="number-of-comments" v-if="specification.rating">
                            <span class="comments">{{specification.rating.snd_title}}</span>
                            <span class="icon-keyboard_arrow_right"></span>
                        </div>
                    </div>
                    <ul class="rating-content" v-if="specification.rating">
                        <li v-for="comment in specification.rating.comment_list" class="comment-item">
                            <div class="comment-header">
                                <img :src="comment.user_icon" v-if="comment.user_icon">   <!-- comment.user_icon 有屬性的情況下顯示模塊 -->
                                <img src="./img/anonymity.png" v-if="!comment.user_icon">   <!-- !comment.user_icon 屬性為null的情況不顯示模塊 -->
                            </div>
                            <div class="comment-main">
                                <div class="user">{{comment.user_name}}</div>
                                <div class="time">{{comment.comment_time}}</div>
                                <div class="content">{{comment.comment_content}}</div>
                            </div>
                        </li>
                    </ul>
            </div>
            </div>
        </div>
    </transition>
</template>

<script>
//導入Cartcontrol.vue組件 
import cartcontrol from 'components/cartcontrol/Cartcontrol';
//導入Vue
import Vue from 'vue';
//①導入better-scroll插件
import BScroll from 'better-scroll';
//導入septalLine.vue組件
import septalLine from 'components/septalLine/SeptalLine';

    export default {
        data() {
            return {
                isShow: false   //預設為隱藏
            }
        },
        components: {   //註冊組件
            cartcontrol,
            BScroll,
            septalLine
        },
        props: {
            specification: {
                type: Object
            }
        },
        methods: {
            //當我觸發此函式時，商品規格即顯示
            showView(){
                this.isShow = true;

                //②滾動初始化
                //this.$nextTick(): 即在DOM渲染之後觸發的函式
                this.$nextTick( () =>{    
                    if (!this.specificationScroll) {    // !null -> true  如果沒有初始化this.specificationScroll
                        //通過new方式實例化了一個對象
                        //(傳入對象):通過this.$refs呼叫ref綁定的DOM元素，用來取得該區塊的高度
                        this.specificationScroll = new BScroll(this.$refs.foodView, {click: true});   //設置click為true。(因better-scroll預設會阻止瀏覽器的原生click事件)
                    }else{    // 如果已經初始化this.specificationScroll
                        this.specificationScroll.refresh();    //refresh()方法:重新計算better-scroll，當DOM結構發生變化時務必要調用確保滾動的效果正常
                    }
                });
            },
            closeView(){
                this.isShow = false;
            },
            addFirst(){
                //Vue.set()方法:將響應式屬性添加到嵌套的對象上
                Vue.set(this.specification,'count',1);
            }
        }
    }
</script>

<style>
/* 導入css樣式 */
/* @import url("GoodsSpecification.css"); */

.goodsSpecification{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 51px;
    background: white;
    width: 100%;
    z-index: 90;
}

/* Vue過渡效果
    <transition name="moveBottom"> </transition>

    進入效果:
    .XXX-enter         過渡開始的狀態
    .XXX-enter-to      過渡結束的狀態
    .XXX-enter-active  過渡持續的時間、延遲、曲線函數

    離開效果:
    .XXX-leave         過渡開始的狀態
    .XXX-leave-to      過渡結束的狀態
    .XXX-leave-active  過渡持續的時間、延遲、曲線函數

*/
.moveBottom-enter-active, .moveBottom-leave-active{
    transition: 1.0s;
}

.moveBottom-enter, .moveBottom-leave-to{
    transform: translateX(100%);     /* X軸移動100% */
    opacity: 0.6;
}

.goodsSpecification .specification-wrapper .specification-content .image-wrapper{
    position: relative;
    width: 100%;
    height: 0;
/* 
    高度撐開！
    在定位中，使用padding-top或padding-bottom設置為100%，盒子寬度會根據盒子的高度進行計算
*/
    padding-top: 100%;  
}

.goodsSpecification .specification-wrapper .specification-content .image-wrapper .itemImg{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}

.goodsSpecification .specification-wrapper .specification-content .image-wrapper .icon-close{
    width: 30px;
    height: 30px;
    position: absolute;
    left: 10px;
    top: 10px;
    text-align: center;
    font-size: 30px;
    color: white;
    background: #7f7f7f;
    border-radius: 50%;
}

.goodsSpecification .specification-wrapper .specification-content .image-wrapper .share-button{
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 50px;
}
.goodsSpecification .specification-wrapper .specification-content .image-wrapper .more-button{
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
}

.goodsSpecification .specification-wrapper .specification-content .content-wrapper{
    padding: 0 0 16px 16px;
    position: relative;
}

.goodsSpecification .specification-wrapper .specification-content .itemName{
    font-size: 15px;
    color: #333333;
    line-height: 30px;
    font-weight: bold;
}

.goodsSpecification .specification-wrapper .specification-content .monthly-saled{
    font-size: 11px;
    color: #9d9d9d;
    margin-bottom: 6px;
}

.goodsSpecification .specification-wrapper .specification-content .products-featured{
    height: 15px;
    margin-bottom: 16px;
}

.goodsSpecification .specification-wrapper .specification-content .products-information{
    font-size: 0;
}

.goodsSpecification .specification-wrapper .specification-content .products-information .price{
    font-size: 17px;
    color: #fb4e44;
}

.goodsSpecification .specification-wrapper .specification-content .products-information .unit{
    font-size: 11px;
    color: #9d9d9d;
}

.goodsSpecification .specification-wrapper .specification-content .cartcontrol-wrapper{
    position: absolute;
    right: 12px;
    bottom: 10px;
    padding: 2px;
}

.goodsSpecification .specification-wrapper .specification-content .buy{
    width: 64px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    background: #ffd161;
    border-radius: 30px;
    position: absolute;
    right: 12px;
    bottom: 10px;
}


.goodsSpecification .specification-wrapper .rating-wrapper{
    padding-left: 16px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .rating-top{
    padding: 16px 16px 16px 0;
}

.goodsSpecification .specification-wrapper .rating-wrapper .rating-top .like-ratio{
    float: left;
    font-size: 0;
}

.goodsSpecification .specification-wrapper .rating-wrapper .rating-top .like-ratio .title{
    font-size: 13px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .rating-top .like-ratio .popularity-value{
    font-size: 11px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .rating-top .like-ratio .popularity-value i{
    color: #fb4e44;
    font-size: 11px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .number-of-comments{
    float: right;
    font-size: 0;
}

.goodsSpecification .specification-wrapper .rating-wrapper .number-of-comments .comments{
    font-size: 13px;
    color: #9d9d9d;
    display: inline-block;
}

.goodsSpecification .specification-wrapper .rating-wrapper .number-of-comments .icon-keyboard_arrow_right{
    font-size: 13px;
    color: #9d9d9d;
    display: inline-block;
    margin-left: 12px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item{
    padding: 15px 14px 17px 0;
    border-bottom: 1px solid #f4f4f4;
    width: 100%;
    box-sizing: border-box;
    display: flex;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item .comment-header{
    flex: 0 0 41px;
    margin-right: 10px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item .comment-header img{
    width: 41px;
    height: 41px;
    border-radius: 50%;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item .comment-main{
    flex: 1;
    margin-top: 6px;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item .comment-main .user{
    width: 50%;
    float: left;
    font-size: 12px;
    color: #333333;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item .comment-main .time{
    width: 50%;
    float: right;
    text-align: right;
    font-size: 10px;
    color: #666666;
}

.goodsSpecification .specification-wrapper .rating-wrapper .comment-item .comment-main .content{
    margin-top: 17px;
    font-size: 13px;
    line-height: 19px;
}
</style>