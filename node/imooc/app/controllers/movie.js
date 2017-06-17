var Movie = require("../models/movie")
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require("underscore")
var path = require('path')
var fs = require('fs')
//detail page
exports.detail = function(req,res){
	var id = req.params.id
	//schema movie object custom method
	// 根据记录id，查询一条记录
    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
        if (err) {
        	console.log(err)
        }
    })
	Movie.findById(id,function(err,movie){
		Comment.find({movie: id})
		.populate('from', 'name')
      	.populate('reply.from reply.to', 'name')
		.exec(function(err,comments){
			res.render('detail', {
			    title: 'imooc 详情页',
			    movie: movie,
			    comments: comments
			})
		})
	})
}
//admin page
exports.new = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		res.render('admin', {
		    title: 'imooc 后台录入页',
		    categories: categories,
		    movie: {
		        director: "",
		        country: "",
		        title: "",
		        year: '',
		        poster: "",
		        language: "",
		        flash: "",
		        summary: ""
		    }
		})
	})
}
//list page
exports.list = function(req,res){
	//schema movie's method
    //查询该数据库下所有记录
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
}

// poster upload
exports.savePoster = function(req, res, next) {
    var posterData = req.files.movie.uploadPoster
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

    if (originalFilename) {
	    fs.readFile(filePath, function(err, data) {
	        var timestamp = Date.now()
	        var type = posterData.type.split('/')[1]
	        var poster = timestamp + '.' + type
	        var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

		    fs.writeFile(newPath, data, function(err) {
		        req.poster = poster
		        next()
		    })
	    })
    }
    else {
    	next()
    }
}
//admin post movie
exports.save = function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if(req.poster){
		movieObj.poster = req.poster
	}
	if(id){
	    Movie.findById(id, function(err, movie){
	        if(err){
	            console.log(err);
	        }
	        _movie = _.extend(movie,movieObj)
	        _movie.save(function(err, movie){
	            if(err){
	                console.log(err);
	            }
	            res.redirect('/movie/' + movie._id)
	        })
	    })
	}
	else{
	    _movie = new Movie(movieObj)
    	var categoryId = movieObj.category
    	var categoryName = movieObj.categoryName
	    _movie.save(function(err, movie){
	        console.log("new submit movie "+movie)
	        if(err){
	            console.log(err);
	        }
	        if(categoryId){
	        	Category.findById(categoryId,function(err,category){
	        		category.movies.push(movie.id)
	        		category.save(function(err,category){
	        			res.redirect('/movie/' + movie._id)
	        		})
	        	})
	        }else if(categoryName){
	        	var _category = new Category({
	        		name: categoryName,
	        		movies: [movie._id]
	        	})
	        	_category.save(function(err,category){
	        		movie.category = category._id
	        		movie.save(function(err,movie){
	        			console.log(movie)
	        			if(err){
	        				console.log(err)
	        			}
	        			res.redirect('/movie/' + movie._id)
	        		})
	        	})
	        }
	    })
	}
}
//admin list remove
exports.del = function(req,res){
	var id = req.query.id
	if(id){
	    Movie.remove({_id:id},function(err,movie){
	        if(err){
	            console.log(err)
	        }
	        else{
	            res.json({success:1})
	        }
	    })
	}
}
//admin update movie
exports.update = function(req,res){
	var id = req.params.id
	if(id){
	    Movie.findById(id, function(err, movie){
	    	Category.find({},function(err,categories){
	    		if(err){
	    		    console.log(err);
	    		}
	    		res.render('admin',{
	    		    title:"imooc 后台更新页",
	    		    movie:movie,
	    		    categories: categories
	    		})
	    	})
	    })
	}
}