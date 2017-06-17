var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/user.server.model.js');
var User = mongoose.model('User');
router.param('id', function (req, res, next, id) {
	req.id = id;
	next();
})
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/book/:id',function(req,res,next){
	res.end('id:'+req.id);
})
router.get('/test',function(req,res,next){
	var user = new User({
		uid: 1,
		username: '  text',
		blog: 'chensd.com',
		firstName: 'Sid',
		lastName: 'chen'
	})
	console.log(JSON.stringify(user));
	user.save(function(err){
		if(err){
			res.end('error');
			return next();
		}

		User.find({},function(err,docs){
			if(err){
				res.end('error');
				return next();
			}
			res.json(docs);
		})
	})
})
module.exports = router;
