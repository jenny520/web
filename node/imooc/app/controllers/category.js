var Category = require("../models/category");
var _ = require("underscore")

// category后台的录入页面
exports.new = function(req,res){
	res.render('category_admin',{
		title: 'imooc后台录入页',
		category: {
			name: ''
		}
	})
}

exports.save = function(req,res){
	var id = req.body.category._id
	var _category = req.body.category
	var categoryObj
	if(id){
		Category.findById(id,function(err,category){
			if(err){
				console.log(err)
			}
			categoryObj = _.extend(category,_category)
			categoryObj.save(function(err,category){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/category/list')
			})
		})
	}else{
		var category = new Category(_category)
		category.save(function(err,category){
			if(err){
				console.log(err)
			}
			res.redirect('/admin/category/list')
		})
	}
}

exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		res.render('category_list',{
			title: 'imooc后台录入列表',
			categories: categories
		})
	})
}

exports.update = function(req,res){
	var id = req.params.id
	if(id){
		Category.findById(id,function(err,category){
			if(err){
				console.log(err)
			}
			res.render('category_admin',{
				title: 'imooc后台录入页',
				category: category
			})
		})
	}
}
