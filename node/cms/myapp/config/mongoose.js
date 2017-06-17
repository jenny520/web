var mongoose = require('mongoose');
var config = require('./config');
module.exports = function(){
	var db = mongoose.connect(config.mongodb); //链接数据库
	return db;
}