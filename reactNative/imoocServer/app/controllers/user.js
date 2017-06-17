'use strict'

var xss = require('xss');
var mongoose = require('mongoose');
var User = require('../models/user');
var uuid = require('uuid');
var sms = require('../service/sms')

exports.signup = function *(next){
	var phoneNumber = xss(this.request.body.phoneNumber.trim())
	var user = yield User.findOne(function(){
		phoneNumber: phoneNumber
	}).exec();

	var verifyCode = sms.getCode();

	if(!user){
		var token = uuid.v4();  // 生成字符串的token值
		user = new User({
			nickname: '小狗宝',
			avatar: 'http://res.cloudinary.com/gougou/image/upload/mooc1.png',
			phoneNumber: xss(phoneNumber), // 用于过滤电话号码
			verifyCode: verifyCode,
			accessToken: token
		})
	}else{
		user.verifyCode = verifyCode
	}
	try{
		user = yield user.save()
	}catch(error){
		this.body = {
			success: false
		}
		return next
	}
	var msg = '你的注册验证码是：' + user.verifyCode;
	try{
		sms.send(user.phoneNumber,msg)
	}catch(error){
		console.log(error);
		this.body = {
			success: false,
			error: '短信服务异常'
		}
	}
	this.body = {
		success: this.request
	}
}

exports.verify = function *(next){
	var verifyCode = this.request.body.verifyCode;
	var phoneNumber = this.request.body.phoneNumber;
	if(!verifyCode || !phoneNumber){
		this.body = {
			success: false,
			error: '验证没通过'
		}
		return next
	}
	var user = yield User.findOne({
	    phoneNumber: phoneNumber,
	    verifyCode: verifyCode
	}).exec()
	if (user) {
    	user.verified = true
    	user = yield user.save()
	    this.body = {
	      	success: true,
	      	data: {
		        nickname: user.nickname,
		        accessToken: user.accessToken,
		        avatar: user.avatar,
	      	}
	    }
  	}else{
  		this.body = {
  		  	success: false,
  		  	err: '验证未通过'
  		}
  	}
}

exports.update = function *(next){
	var body = this.request.body;
	var user = this.session.user;
    
	var fields = 'avatar,gender,age,nickname,breed'.split(',');
	fields.forEach(function(field){
		if(body[field]){
			user[field] = xss(body[field].trim());
		}
	})
	user = yield user.save();
	this.body = {
	  	success: true,
	  	data: {
	  		nickname: user.nickname,
	        accessToken: user.accessToken,
	        avatar: user.avatar,
	        age: user.age,
	        breed: user.breed,
	        gender: user.gender
	  	}
	}

}