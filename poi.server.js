const express = require('express');
const port = 8088;

const app = express();

const router = express.Router();
router.get('/', (req,res,next) =>{
    request.url = '/index.html';
    next();
});

app.use(router);

//數據街口
// 1、讀取json數據
const goods = require('./data/ProductPageMenu.json');
const ratings = require('./data/ProductPageEvaluation.json');
const seller = require('./data/ProductPageMerchant.json');

// 2、路由
var routes = express.Router();

// 3、编写接口
routes.get('/goods', (req,res) => {
	// 返回数据给客户端，返回json数据
	res.json(goods);
});
routes.get('/ratings', (req,res) => {
	// 返回数据给客户端，返回json数据
	res.json(ratings);
});

routes.get('/seller', (req,res) => {
	// 返回数据给客户端，返回json数据
	res.json(seller);
});

// 4、中间件
app.use('/api',routes);


// 定义static目录，指向./dist目录
app.use(express.static('./dist'));


// 启动express
module.express = app.listen(port, function(err){
	if(err){
		console.log(err);
		return;
	}
	
	console.log('http://localhost:' + port + '\n');
});