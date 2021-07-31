<template>
  <div class="goods">

    <!-- 1.左側商品分類 -->
    <div class="menu-wrapper" ref="menuScroll">     <!-- 因為想取得該區塊的高度，所以在該區塊上設置ref屬性並添加屬性名 -->
        <ul>
            <!-- 專場分類、圖標 --> 
            <!-- ⓔ調用currentIndex方法，判斷如果滾動的y值為當前對應的li索引值，則添加current樣式，用來連接左右側的區塊位置 -->
            <!-- ⓖ綁定click事件，並調用selectMenu方法 -->
            <li class="menu-list" :class="{current:currentIndex === 0}" @click="selectMenu(0)">
                <p class="text">
                    <!-- v-if:控制模塊顯示隱藏（若資料不存在情況下則不顯示，系統才不會報錯） -->
                    <img class="icon" :src="container.tag_icon" v-if="container.tag_icon">
                    {{container.tag_name}}       <!-- 雙向資料綁定 -->
                </p>
            </li>

            <!-- 熱銷分類、圖標及含熱銷以下分類 -->
            <!-- v-for:將food(key)該陣列中的資料進行遍歷並取出來，賦值給foodItem --> 
            <!-- ⓔ取得foodItem該陣列元素的index，調用currentIndex方法，判斷如果滾動的y值為當前對應的li索引值，則添加current樣式，用來連接左右側的區塊位置 -->
            <!-- ⓖ綁定click事件，並調用selectMenu方法 -->
            <li class="menu-list" v-for="(foodItem, index) in food" :class="{current:currentIndex === index+1}" @click="selectMenu(index+1)">
                <p class="text">
                    <img :src="foodItem.icon" v-if="foodItem.icon" class="icon">
                    {{foodItem.name}}         <!-- 雙向資料綁定 -->
                </p>
                <!-- 選擇商品個數顯示 --> 
                <i class="num" v-show="calculateCount(foodItem.spus)">{{calculateCount(foodItem.spus)}}</i>
            </li>
        </ul>
    </div>

    <!-- 2.右側商品資訊 --> 
    <div class="foods-wrapper" ref="foodsScroll">     <!-- 因為想取得該區塊的高度，所以在該區塊上設置ref屬性並添加屬性名 -->
        <ul>
            <!-- 兩張圖片 -->
            <li class="container-data foodListHook">
                <div v-for="containerItem in container.operation_source_list">
                    <img :src="containerItem.pic_url">
                </div>
            </li>

            <!-- 熱銷標題 -->
            <li class="foods-data foodListHook" v-for="foodItem in food">
                <h3 class="foods-title">{{foodItem.name}}</h3>      <!-- 雙向資料綁定 --> 
                <ul>
                    <!-- v-for:將foodItem(key)中的spus資料進行遍歷並取出來，賦值給goodsDetails -->
                    <li class="foods-details" v-for="goodsDetails in foodItem.spus" @click="showSpecification(goodsDetails)">
                        <div class="foods-icon" :style="foods_big_icon(goodsDetails.picture)">    <!-- 透過v-bind樣式綁定，調用methods選項中的foods_big_icon函式，並帶入參數，透過參數獲取picture資料 -->
                        </div>

                        <div class="foods-content">
                            <h3 class="foods-name">{{goodsDetails.name}}</h3>

                            <!-- v-if:控制模塊顯示隱藏（若資料不存在情況下則不顯示，系統才不會報錯） -->
                            <p class="foods-description" v-if="goodsDetails.description">{{goodsDetails.description}}</p>

                            <div class="foods-other"> 
                                <span class="monthly-saled">{{goodsDetails.month_saled_content}}</span>
                                <span class="likes">{{goodsDetails.praise_content}}</span>
                            </div>

                            <img class="products-featured" :src="goodsDetails.product_label_picture">

                            <p class="products-information">
                                <span class="price">¥{{goodsDetails.min_price}}</span>
                                <span class="unit">/{{goodsDetails.unit}}</span>
                            </p> 
                        </div>

                        <div class="cartcontrol-wrapper">
                            <!-- 組件使用(商品遞增／遞減) --> 
                            <cartcontrol :commodity="goodsDetails"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <!-- 組件使用(購物車) -->
    <!-- 透過props父子組件傳值的方式綁定poiInfo屬性 & settle_accounts -->
    <shopcart :poiInfo="poiInfo" :settle_accounts="selectGoods"></shopcart>

    <!-- 組件使用(商品規格) -->
    <goodsSpecification :specification="selectSpecification" ref="showGoods"></goodsSpecification>
  </div>
</template>

<script>
//①導入better-scroll插件
import BScroll from 'better-scroll';
//導入Shopcart.vue組件
import shopcart from 'components/shopcart/Shopcart';
//導入Cartcontrol.vue組件
import cartcontrol from 'components/cartcontrol/Cartcontrol';
//導入GoodsSpecification.vue組件
import goodsSpecification from 'components/goodsSpecification/GoodsSpecification';

//導出
export default {
    data() {     //資料選項
        return {
            container: {},   //定義空物件，用來儲存JSON資料
            food: [],        //定義空陣列，用來儲存JSON資料
            poiInfo: {},     
            listHeight: [],   //定義空陣列，用來儲存區塊間隔的高度
            scrollY: 0,       //定義滾動初始值
            menuScrollY: {},   //用來儲存滾動對象
            foodsScrollY: {},   //用來儲存滾動對象
            selectSpecification: {}
        }
    },
    created() {     //在完成創建實例此步驟，發起異步請求，獲取數據
        const that = this;      //將this儲存在變數中
        this.$axios.get("/api/goods")       //this指向Vue，通過axios發起get請求來獲取數據

            //axios回傳的物件是Promise(完成狀態)，所以我們可以用.then和.catch去處理成功和失敗結果
            .then(function (response) {      //成功。獲取到數據之後的處理
                // console.log(response);      //輸出響應數據
                const dataSource = response.data;   //將回應數據中的data資料儲存在變數中
                // console.log(dataSource);     //確認是否有獲取到data資料
                if (dataSource.code == 0) {     //判斷條件:如果數據獲取成功
                    that.container = dataSource.data.container_operation_source;    //將data資料中的container_operation_source賦值給container空物件
                    that.food = dataSource.data.food_spu_tags;      //將data資料中的food_spu_tags賦值給food空陣列
                    that.poiInfo = dataSource.data.poi_info;
                    // console.log(that.container);     //確認是否有獲取到data中的container_operation_source資料
                    // console.log(that.food);     //確認是否有獲取到data中的food_spu_tags資料

                    //因created()為創建實體，該階段還未掛載至DOM元素，因此DOM元素未進行渲染狀態，即高度獲取不到
                    //所以應該在獲取到數據之後，並且渲染DOM元素的情況下，才調用滾動初始化的方法
                    //this.$nextTick(): 即在DOM渲染之後觸發的函式
                    that.$nextTick( () =>{
                        that.initScroll();   //③調用滾動初始化的方法

                        //ⓑ調用右側商品資訊的計算區塊間隔高度的方法
                        that.calculateHeight();
                    });
                }
            })
            .catch(function (error) {     //失敗。出錯處理
                console.log(error);
            });
    },
    methods: {       //方法選項
        foods_big_icon(imgName){
            return "background-image: url(" + imgName + ");"
        },
        //②滾動初始化
        initScroll(){
            //通過new方式實例化了一個對象
            //(傳入對象):通過this.$refs呼叫ref綁定的DOM元素，用來取得該區塊的高度
            this.menuScrollY = new BScroll(this.$refs.menuScroll, {click: true});    //設置click為true。(因better-scroll預設會阻止瀏覽器的原生click事件)
            this.foodsScrollY = new BScroll(this.$refs.foodsScroll, {
                probeType: 3,       //通過probeType選項值來改變scroll事件的觸發時機以及滾動位置，值為3表示滚動事件被觸發時除了滾動包括監聽彈性事件
                click: true
                });      

            //ⓒ添加滾動監聽事件 scroll:滾動時觸發
            this.foodsScrollY.on('scroll', (pos) => {       //監聽右側商品資訊的滾動y值

                //Math.abs()傳回絕對值; Math.round()回傳四捨五入後的近似值
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        //ⓐ計算右側商品資訊的區塊間隔高度
        calculateHeight(){     
            //通過this.$refs獲取到(右側商品資訊)的對應元素 ==>漸階式獲取元素
            const foodsList = this.$refs.foodsScroll.getElementsByClassName('foodListHook');

            //將區塊間隔高度添加到空陣列
            let height = 0;
            this.listHeight.push(height);     //將height初始值傳進listHeight空陣列裡
            for (let i = 0; i < foodsList.length; i++) {

                //獲取元素的視窗高度並且累加
                //區塊一:0=0+242, 區塊二:242=242+1185, 區塊三:1427=1427+1148,....
                height += foodsList[i].clientHeight;      //height += foodsList的第i個元素的視窗高度

                this.listHeight.push(height);    //將累加之後的height傳進listHeight空陣列裡
            }
        },
        //ⓕ根據索引下標，滾動到相對應元素的區塊位置
        selectMenu(index){

            //通過this.$refs獲取到(右側商品資訊)的對應元素 ==>漸階式獲取元素
            const foodsList = this.$refs.foodsScroll.getElementsByClassName('foodListHook');

            //當我點擊哪個分類選項時，即滾動到對應元素的區塊位置
            let el = foodsList[index];      

            //scrollToElement(滾動到對應元素的區塊位置,滾動畫面執行的時長(ms))
            this.foodsScrollY.scrollToElement(el,400);
        },
        //遍歷spus該陣列，判斷如果count(key)>0，進行個數累加，最後返回count
        calculateCount(spus){
            let count = 0;   //宣告count初始值為0
            spus.forEach( data => {
                if (data.count > 0) {
                    //個數累加
                    count += data.count;   //count += spus裡的count資料
                }
            });
            return count;
        },
        //當我觸發此函式時，
        showSpecification(goodsDetails){
            //1.將當前點擊li的商品資料(spus物件)傳遞過來，並賦值給selectSpecification空物件
            this.selectSpecification = goodsDetails;

            //2.顯示商品規格頁面
            this.$refs.showGoods.showView();
        }
    },
    computed: {    //計算屬性(方法)
        //ⓓ根據右側商品資訊的高度位置，計算當前滾動的y值所對應的索引下標
        currentIndex(){
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];     //宣告且初始化height1為listHeight的第i個元素
                let height2 = this.listHeight[i+1];   //宣告且初始化height2為listHeight的第i個元素+1

                //判斷如果滾動y值>=height1並且<height2時
                if (this.scrollY >= height1 && this.scrollY < height2) {
                    // console.log(i);
                    return i;    //輸出i
                }
            }
        },
        //(當選擇的商品個數發生改變時，將會重新計算求值)遍歷food裡的spus該陣列，並且判斷如果count(key)>0，即push到空陣列，最後返回goods陣列
        selectGoods(){
            let goods = [];
            //遍歷food該陣列元素
            this.food.forEach( foods => {
                //遍歷spus該陣列元素
                foods.spus.forEach( good => {      //立即函式傳遞變數
                    if (good.count > 0) {     //判斷如果good變數裡的count >0時
                        goods.push(good);    //將good傳進goods空陣列裡
                    }
                });
            });
            return goods;   
        }
    },
    components: {   //註冊組件
        BScroll,
        shopcart,
        cartcontrol,
        goodsSpecification
    }
}
</script>

<style>
/* 導入css樣式 */
/* @import url("Goods.css"); */

.goods{
    display: flex;

    position: absolute;
    top: 190px;
    bottom: 51px;

    overflow: hidden;
    width: 100%;
}

/*    flex空間分配上的三個重要屬性：
-flex-grow: 定義「伸展」比例，預設值為0，依照設定比例分配剩餘空間(尚未進行設定時，不會將剩餘空間分配給子元素做長度「伸展」，則設定為1長度會進行彈性變化);
-flex-shrink: 定義「壓縮」比例，預設值為１，表示空間不夠時的壓縮比例(尚未進行設定時，會按照數字「壓縮」比例分配。如果不想要被壓縮的話，可以設定數值為0);
-flex-basis: 預設值為auto，表示其預設分配到的空間，與width很像，但優先程度較高，flex-basis會覆蓋width(在分配多餘空間之前，子元素佔據的主軸空間(瀏覽器)會根據這個屬性，計算佔據是否有多餘空間);
*/
.goods .menu-wrapper{
    flex: 0 0 85px;      /* flex: 伸展比例 壓縮比例 85px; 屏幕發生改變時，寬度是固定的 */
    background: #f4f4f4;
}

.goods .menu-wrapper .menu-list{
    padding: 16px 23px 15px 10px;
    border-bottom: 1px solid #e4e4e4;
    position: relative;
}

.goods .menu-wrapper .current{
    background: white;
    font-weight: bold;
    margin-top: -1px;
}

.goods .menu-wrapper .menu-list .text{
    font-size: 13px;
    color: #333333;
    line-height: 17px;
    vertical-align: middle;     /* 垂直居中 */ 

    /* 超出部分顯示省略號(...)，webkit適用於瀏覽器以及移動端 */
    -webkit-line-clamp: 2;     /* 用來定義塊元素顯示文本行數 */
    display: -webkit-box;     /* 將對象作為彈性伸縮盒子模型顯示 */
    -webkit-box-orient: vertical;     /* 設置或檢索伸縮盒子的子元素排列方式 */

    overflow: hidden;   /* 超出文字隱藏 */
}

.goods .menu-wrapper .menu-list .text .icon{
    width: 15px;
    height: 15px;
    vertical-align: middle;     /* 垂直居中 */ 
}

.goods .menu-wrapper .menu-list .num{
    position: absolute;
    right: 5px;
    top: 5px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    color: white;
    background: red;
    text-align: center;
    font-size: 7px;
    line-height: 13px;
}

.goods .foods-wrapper{
    flex: 1;             /* 只填一個數值時，預設為flex-grow; 屏幕發生改變時，寬度會隨著改變 */
    /* background: blue; */
}

.goods .foods-wrapper .container-data{
    padding: 11px 11px 0 11px;
    border-bottom: 1px solid #e4e4e4;
}

.goods .foods-wrapper .container-data img{     
    width: 100%;
    margin-bottom: 11px;
    border-radius: 5px;
}

.goods .foods-wrapper .foods-data{
    padding: 11px;
}

.goods .foods-wrapper .foods-data .foods-title{
    height: 13px;
    font-size: 13px;
    background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left center;
    background-size: 2px 10px;
    padding-left: 7px;
    margin-bottom: 12px;
}

.goods .foods-wrapper .foods-data .foods-details{
    display: flex;
    margin-bottom: 25px;
    position: relative;
}

.goods .foods-wrapper .foods-data .foods-details .foods-icon{
    flex: 0 0 63px;
    background-position: center;
    background-size: 120% 100%;
    background-repeat: no-repeat;
    margin-right: 11px;
    height: 75px;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content{
    flex: 1;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .foods-name{
    font-size: 16px;
    line-height: 21px;
    color: #333333;
    margin-bottom: 10px;
    padding-right: 27px;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .foods-description{
    font-size: 10px;
    line-height: 19px;
    color: #bfbfbf;
    margin-bottom: 8px;

    /* 超出部分顯示省略號(...)，webkit適用於瀏覽器以及移動端 */
    -webkit-line-clamp: 1;     /* 用來定義塊元素顯示文本行數 */
    display: -webkit-box;     /* 將對象作為彈性伸縮盒子模型顯示 */
    -webkit-box-orient: vertical;     /* 設置或檢索伸縮盒子的子元素排列方式 */

    overflow: hidden;   /* 超出文字隱藏 */
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .foods-other{
    font-size: 10px;
    color: #bfbfbf;
    margin-bottom: 7px;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .foods-other .monthly-saled{
    margin-right: 14px;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .products-featured{
    height: 15px;
    margin-bottom: 6px;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .products-information{
    font-size: 0;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .products-information .price{
    font-size: 14px;
    color: #fb4e44;
}

.goods .foods-wrapper .foods-data .foods-details .foods-content .products-information .unit{
    font-size: 12px;
    color: #bfbfbf;
}

.goods .foods-wrapper .foods-data .foods-details .cartcontrol-wrapper{
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
