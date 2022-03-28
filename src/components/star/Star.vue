<template>
    <div class="star">
        <!-- v-for:將itemArray(key)該物件中的資料進行遍歷並取出來，賦值給itemClass -->
        <!-- itemClass:用來控制star圖片 -->
        <span v-for="itemClass in itemArray" :key="itemClass.id" :class="itemClass" class="start-item"></span>
    </div>
</template>

<script>
//定義星星長度
const starLength = 5;

//定義星星類別
const class_on = 'on';      //滿星
const class_half = 'half';  //半星
const class_off = 'off';    //無星

//導出
export default {
    props: {
        score: {
            type: Number
        }
    },
    computed: {      //計算屬性(方法)
        itemArray(){
            let result = [];

            // 對分數進行處理  4.7 => 4.5, 3.9 => 3.5, 4.1 => 4.0 
            let score = Math.floor(this.score*2) / 2;    //分數,向下取0.5的倍數
            let hasDecimal = score % 1 !== 0;     //小數,控制半星
            let integer = Math.floor(score);     //整數,控制滿星

            //滿星
            for (let i = 0; i < integer; i++) {
                result.push(class_on);     //將class_on傳進result空陣列裡
            }

            //半星
            if (hasDecimal) {         
                result.push(class_half);    //將class_half傳進result空陣列裡
            }

            //補齊灰色星星(無星)
            while (result.length < starLength) {
                result.push(class_off);     //將class_off傳進result空陣列裡
            }

            return result;        //最後返回result
        }
    }
}
</script>

<style>
.star{
    font-size: 0;
}
.star .start-item{
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 3px;
    background-repeat: no-repeat;
    background-size: 10px 10px;
}

/* 設定無間距 */
.star .start-item:last-child{
    margin-right: 0;
}

/* 三種star狀態 */
.star .on{    /* 滿星 */
    background-image: url(./img/star24_on@2x.png);
}
.star .half{    /* 半星 */
    background-image: url(./img/star24_half@2x.png);
}
.star .off{    /* 無星 */
    background-image: url(./img/star24_off@2x.png);
}
</style>