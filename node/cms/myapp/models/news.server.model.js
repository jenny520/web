var mongoose = require('mongoose');
/*
	设置新闻页的数据模式
*/
var NewsSchema = mongoose.Schema({
	title: String,
	content: String,
	createTime: {
		type: Date,
		default: Date.now
	}
})

//设置导入数据模型
var News = mongoose.model('News',NewsSchema);