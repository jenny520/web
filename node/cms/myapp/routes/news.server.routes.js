var NewsController = require('../controller/news.server.controller');
var express = require('express');
var router = express.Router();
module.exports = function(app){
	app.route('/news')
		.get(NewsController.list)
		.post(NewsController.create);
	app.route('/news/:nid')
		.get(NewsController.get);
	router.param('nid',NewsController.getById);
}