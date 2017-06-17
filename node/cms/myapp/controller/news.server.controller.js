var mongoose = require('mongoose');
//导入数据模型页面
require('../models/news.server.model');
var News = mongoose.model('News'); //获取名为News的数据模型
//用于导出的各种方法
module.exports = {
	create: function(req,res,next){
		var news = new News({
			title: 'test-title',
			content: 'test-content'
		});
		//保存数据
		news.save(function(err){
			if(err){
				return next(err);
			}
			return res.json(news);
		})
	},
	list: function(req,res,next){
		var pageSize = parseInt(req.query.pageSize,10) || 10;
		var pageStart = parseInt(req.query.pageStart,10) || 1;

		News.find()
			.skip((pageStart - 1) * pageSize)
			.limit(pageSize)
			.exec(function(err,docs){
				if(err){
					return next(err);
				}
				return res.json(docs);
			})
	},
	getById:function(req,res,next,id){
		if(!id){
			return next(new Error('News no find'));
		}
		News.findOne({id:id})
			.exec(function(err,doc){
				if(err){
					return next(err)
				}
				if(!doc){
					return next(new Error('News no find'))
				}
				req.news = id;
				return next();
			})
	},
	get:function(req,res,next){
		return res.json(req.news);
	}
}
