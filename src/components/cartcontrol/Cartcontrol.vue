<template>
    <div class="cartcontrol">
        <transition name="move">    <!-- transition: Vue提供的套裝組件，用來添加過渡效果 --> 
            <div class="decrease" @click.stop.prevent="decreaseCart" v-show="commodity.count">
                <span class="inner icon-remove_circle_outline"></span>     <!-- 遞減圖標(直接使用icomoon圖標) -->
            </div>
        </transition>

        <div class="number" v-show="commodity.count">{{commodity.count}}</div>
        <div class="add">
            <!-- stop.prevent:阻止事件冒泡 -->
            <span class="icon-add_circle" @click.stop.prevent="addCart"></span>        <!-- 遞增圖標(直接使用icomoon圖標) -->
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

    export default {
        props: {
            commodity: {
                type: Object
            }
        },
        methods: {
            decreaseCart(){
                this.commodity.count--;
            },
            addCart(){
                //Vue.set()方法:將響應式屬性添加到嵌套的對象上
                if (!this.commodity.count) {
                    Vue.set(this.commodity,'count',1);
                }else{
                    this.commodity.count++;
                }
            }
        }
    }
</script>

<style>
/* 導入css樣式 */
/* @import url("Cartcontrol.css"); */

.cartcontrol{
    font-size: 0;
}

.cartcontrol .decrease{
    display: inline-block;
}

.cartcontrol .decrease .icon-remove_circle_outline{
    width: 26px;
    height: 26px;
    font-size: 26px;
    color: #bababa;
}

.cartcontrol .number{
    display: inline-block;
    width: 25px;
    text-align: center;
    font-size: 12px;
    line-height: 26px;
    vertical-align: top;
}

.cartcontrol .add{
    display: inline-block;
}

.cartcontrol .add .icon-add_circle{
    display: block;
    width: 26px;
    height: 26px;
    font-size: 26px;
    color: #ffd161;
}

/* Vue過渡效果
    <transition name="move"> </transition>

    進入效果:
    .XXX-enter         過渡開始的狀態
    .XXX-enter-to      過渡結束的狀態
    .XXX-enter-active  過渡持續的時間、延遲、曲線函數

    離開效果:
    .XXX-leave         過渡開始的狀態
    .XXX-leave-to      過渡結束的狀態
    .XXX-leave-active  過渡持續的時間、延遲、曲線函數

*/
.move-enter-active, .move-leave-active{
    transition: all 0.5s;
}

.move-enter, .move-leave-to{
    transform: translateX(20px) rotate(180deg);     /* 移動20px 旋轉180deg */
}
</style>