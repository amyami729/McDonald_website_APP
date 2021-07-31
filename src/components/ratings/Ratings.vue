<template>
    <div class="ratings" ref="ratingsView">
        <div class="ratings-wrapper">
            <div class="overView">
                <div class="overView-left">
                    <div class="comment-score">
                        <p class="score">{{ratings.comment_score}}</p>
                        <p class="text">商家評分</p>
                    </div>
                    <div class="other-score">
                        <div class="taste-score item">
                            <span class="taste-text">口味</span>
                            <mystar :score="ratings.quality_score" class="ratings-star"></mystar>
                            <span class="star-num">{{ratings.quality_score}}</span>
                        </div>
                        <div class="package-score item">
                            <span class="taste-text">包裝</span>
                            <mystar :score="ratings.pack_score" class="ratings-star"></mystar>
                            <span class="star-num">{{ratings.pack_score}}</span>
                        </div>
                    </div>
                </div>
                <div class="overView-right">
                    <div class="delivery-score">
                        <p class="num">{{ratings.delivery_score}}</p>
                        <p class="delivery-text">配送評分</p>
                    </div>
                </div>
            </div>
            <!-- 組件使用(間隔線) --> 
            <septalLine ></septalLine>

            <div class="ratings-content" v-if="ratings.tab">
                <div class="ratings-select">
                    <span class="list" @click="get_selectType(2)" :class="{active:selectType == 2}">
                        {{ratings.tab[0].comment_score_title}}
                    </span>
                    <span class="list" @click="get_selectType(1)" :class="{active:selectType == 1}">
                        {{ratings.tab[1].comment_score_title}}
                    </span>
                    <span class="list" @click="get_selectType(0)" :class="{active:selectType == 0}">
                        <img src="./img/icon_sub_tab_dp_normal@2x.png" v-show="selectType != 0">
                        <img src="./img/icon_sub_tab_dp_highlighted@2x.png" v-show="selectType == 0">
                        {{ratings.tab[2].comment_score_title}}
                    </span>
                </div>
                <div class="labels-view">
                    <span class="labels-items" v-for="labelsItems in ratings.labels" :class="{highligh:labelsItems.label_star > 0}">
                        {{labelsItems.content}}{{labelsItems.label_count}}
                    </span>
                </div>
                <ul class="ratings-detailed-comments">
                    <li v-for="commentItems in selectComments" class="comment-item">
                        <div class="comment-header">
                            <img :src="commentItems.user_pic_url" v-if="commentItems.user_pic_url">   <!-- !commentItems.user_pic_url 有屬性的情況下顯示模塊 -->
                            <img src="./img/anonymity.png" v-if="!commentItems.user_pic_url">   <!-- !commentItems.user_pic_url 屬性為null的情況下顯示模塊 -->
                        </div>
                        <div class="comment-main">
                            <div class="user">{{commentItems.user_name}}</div>
                            <div class="time">{{formatDate(commentItems.comment_time)}}</div>
                            <div class="star-wrapper">
                                <span class="starText">評分</span>
                                <mystar :score="commentItems.order_comment_score" class="Mystar"></mystar>
                            </div>
                            <div class="content" v-html="commentStr(commentItems.comment)"></div>
                            <div class="img-wrapper" v-if="commentItems.comment_pics.length">
                                <img v-for="itemm in commentItems.comment_pics" :src="itemm.thumbnail_url">
                            </div>
                        </div> 
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
//導入Star.vue組件
import mystar from 'components/star/Star';
//導入septalLine.vue組件
import septalLine from 'components/septalLine/SeptalLine';
//①導入better-scroll插件
import BScroll from 'better-scroll';

//宣告變數並初始化
const All = 2;   
const Picture = 1;
const Comment = 0;

//導出
export default {
    data() {
        return {
            ratings: {},
            selectType: All
        }
    },
    created() {   //在完成創建實例此步驟，發起異步請求，獲取數據
        const that = this;          //將this儲存在變數中
        this.$axios.get('/api/ratings')   //this指向Vue，通過axios發起get請求來獲取數據

        //axios回傳的物件是Promise(完成狀態)，所以我們可以用.then和.catch去處理成功和失敗結果
        .then(function (response){       //成功。獲取到數據之後的處理
            const dataSource = response.data;       //將回應數據中的data資料儲存在變數中
            if (dataSource.code == 0){      //判斷條件:如果數據獲取成功
                that.ratings = dataSource.data;     //將data資料賦值給ratings變數

                //②滾動初始化
                //this.$nextTick(): 即在DOM渲染之後觸發的函式
                that.$nextTick( ()=>{
                    if (!that.ratingsScroll) {    // !null -> true  如果沒有初始化that.ratingsScroll
                        //通過new方式實例化了一個對象
                        //(傳入對象):通過this.$refs呼叫ref綁定的DOM元素，用來取得該區塊的高度
                        that.ratingsScroll = new BScroll(that.$refs.ratingsView, {click: true});    //設置click為true。(因better-scroll預設會阻止瀏覽器的原生click事件)
                    }else{     // 如果已經初始化this.ratingsScroll
                        that.ratingsScroll.refresh();    //refresh()方法:重新計算better-scroll，當DOM結構發生變化時務必要調用確保滾動的效果正常
                    }
                });
            }
        })
        .catch(function (error){    //失敗。出錯處理
            console.log(error);
        });
    },
    methods: {
        get_selectType(type){   //僵直傳遞進來
            this.selectType = type;   //selectList值即改變

            //刷新操作
            this.$nextTick( ()=>{   //this.$nextTick(): 即在DOM渲染之後觸發的函式
                this.ratingsScroll.refresh();    //refresh()方法:重新計算better-scroll，當DOM結構發生變化時務必要調用確保滾動的效果正常
            });
        },
        //轉換時間格式
        formatDate(time){
            const date = new Date(time*1000);

            //時間格式
            let fmt = 'yyyy.mm.dd';

            if (/(y+)/.test(fmt)) {    //年
                let year = date.getFullYear().toString();
                // RegExp.$1 === /(y+)/ === yyyy
                fmt = fmt.replace(RegExp.$1, year);  // fmt = 2021.mm.dd
                // console.log(fmt);
            }
            if (/(m+)/.test(fmt)) {   //月
                let mouth = date.getMonth() + 1;
                if (mouth < 10) {
                    mouth = '0' + mouth;
                }
                fmt = fmt.replace(RegExp.$1, mouth);
            }
            if (/(d+)/.test(fmt)) {   //日
                let mydate = date.getDate();
                if (mydate < 10) {
                    mydate = '0' +mydate;
                }
                fmt = fmt.replace(RegExp.$1, mydate);
            }
            return fmt;
        },
        //正則表達式
        commentStr(content){
            const rel = /#[^#]+#/g;

            return content.replace(rel, '<i>$&</i>')
        }
    },
    computed: {
        selectComments(){
            if (this.selectType == All) {
                return this.ratings.comments;
            }else if (this.selectType == Picture) {
                const array = [];
                this.ratings.comments.forEach( traverseComments => {
                    if (traverseComments.comment_pics.length) {
                        array.push(traverseComments);
                    }
                });
                return array;
            }else {
                return this.ratings.comments_dp.comments;
            }
        }
    },
    components: {
        //註冊組件
        mystar,
        septalLine,
        BScroll
    },
}
</script>

<style>
/* 導入css樣式 */
/* @import url("Ratings.css"); */

.ratings{
    position: absolute;
    left: 0;
    top: 190px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
}

.ratings .ratings-wrapper .overView{
    padding: 20px 0 18px 0;
    display: flex;
}

.ratings .ratings-wrapper .overView .overView-left{
    flex: 1;
    padding-left: 26px;
}

.ratings .ratings-wrapper .overView .overView-left .comment-score{
    float: left;
    width: 48px;
    text-align: center;
    margin-right: 26px;
}

.ratings .ratings-wrapper .overView .overView-left .comment-score .score{
    font-size: 23px;
    font-weight: 800;
    color: #ffb000;
    margin-bottom: 9px;
}

.ratings .ratings-wrapper .overView .overView-left .comment-score .text{
    font-size: 11px;
    color: #666666;
}

.ratings .ratings-wrapper .overView .overView-left .other-score{
    float: left;
    margin-top: 3px;
    margin-left: 14px;
}

.ratings .ratings-wrapper .overView .overView-left .other-score .taste-score{
    margin-bottom: 14px;
}

.ratings .ratings-wrapper .overView .overView-left .other-score .item{
    height: 11px;
}

.ratings .ratings-wrapper .overView .overView-left .other-score .taste-text{
    font-size: 11px;
    color: #666666;
    margin-right: 11px;
    float: left;
}

.ratings .ratings-wrapper .overView .overView-left .other-score .ratings-star{
    float: left;
    margin-right: 11px;
}

.ratings .ratings-wrapper .overView .overView-left .other-score .star-num{
    font-size: 11px;
    color: #ffb000;
    float: left;
}

.ratings .ratings-wrapper .overView .overView-right{
    flex: 0 0 100px;
    text-align: center;
    border-left: 1px solid #f4f4f4;
    margin-right: 15px;
}

.ratings .ratings-wrapper .overView .overView-right .delivery-score{
    margin-left: 15px;
}

.ratings .ratings-wrapper .overView .overView-right .delivery-score .num{
    font-size: 19px;
    font-weight: 500;
    color: #999999;
    margin-bottom: 10px;
    margin-top: 3px;
}

.ratings .ratings-wrapper .overView .overView-right .delivery-score .delivery-text{
    font-size: 11px;
    color: #999999;
}

.ratings .ratings-wrapper .ratings-content{
    padding: 16px;
}

.ratings .ratings-wrapper .ratings-content .ratings-select{
    width: 100%;
    box-sizing: border-box;
    font-size: 0;
    border: 1px solid #ffb000;
    margin-bottom: 11px;
    border-radius: 3px;
}

.ratings .ratings-wrapper .ratings-content .ratings-select .list{
    width: 33.3%;    /* 三等份 */
    display: inline-block;
    height: 33px;
    line-height: 33px;
    font-size: 14px;
    text-align: center;
    border-right: 1px solid #ffb000;
    box-sizing: border-box;
    color: #ffb000;
}

.ratings .ratings-wrapper .ratings-content .ratings-select .list:last-child{
    border-right: 0;
}

.ratings .ratings-wrapper .ratings-content .ratings-select .list:last-child img{
    height: 14px;
    vertical-align: middle;
}

.ratings .ratings-wrapper .ratings-content .ratings-select .active{
    background: #ffb000;
    color: black;
}

.ratings .ratings-wrapper .ratings-content .labels-view .labels-items{
    display: inline-block;
    height: 27px;
    line-height: 27px;
    padding: 0 10px;
    font-size: 12px;
    background: #f4f4f4;
    margin-right: 6px;
    margin-bottom: 6px;
    border-radius: 3px;
    color: #999999;
}

.ratings .ratings-wrapper .ratings-content .labels-view .highligh{
    color: #656565;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item{
    padding: 16px 16px 16px 0;
    border-bottom: 1px solid #f4f4f4;
    width: 100%;
    box-sizing: border-box;
    display: flex;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item .comment-header{
    flex: 0 0 35px;
    margin-right: 11px;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item img{
    width: 35px;
    height: 35px;
    border-radius: 50%;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item .comment-main{
    flex: 1;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .user{
    width: 50%;
    float: left;
    font-size: 11px;
    color: #333333;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .time{
    width: 50%;
    float: right;
    text-align: right;
    font-size: 9px;
    color: #666666;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .star-wrapper{
    float: left;
    margin-top: 12px;
    margin-bottom: 15px;
    width: 100%;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .star-wrapper .starText{
    color: #999999;
    font-size: 11px;
    float: left;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .star-wrapper .Mystar{
    float: left;
    margin-left: 7px;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .content{
    font-size: 13px;
    line-height: 19px;
    float: left;
    width: 100%;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .content i{
    color: #576b95;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .img-wrapper{
    margin-top: 9px;
    float: left;
}

.ratings .ratings-wrapper .ratings-content .ratings-detailed-comments .comment-item  .comment-main .img-wrapper img{
    width: 175px;
    height: 175px;
    border-radius: 0;
}
</style>