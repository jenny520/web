'use strict'
var mongoose = require('mongoose');
var User = require('../models/user');
var robot = require('../service/robot');
var uuid = require('uuid');

exports.signature = function *(next){
	var body = this.request.body;
	var cloud = body.cloud;
	var data;
	if(cloud === 'qiniu'){
		data = robot.getQiniuToken(body);
	}else{
		data = robot.getCloudinaryToken(body)
	}
	this.body = {
		success: true,
		data: data
	}
}
exports.hasBody = function *(next){
	var body = this.request.body || {};
	console.log(body);
	if(Object.keys(body).length === 0){
		this.body = {
			success: false,
			error: '是不是漏掉什么了'
		}
		return next;
	}
	yield next
}
exports.hasToken = function *(next){
	var accessToken = this.query.accessToken;
	if(!accessToken){
		accessToken = this.request.body.accessToken;
	}
	if(!accessToken){
		this.body = {
			success: false,
			error: '钥匙丢了'
		}
		return next;
	}
	var user = yield User.findOne({
		accessToken: accessToken
	}).exec()
	if(!user){
		this.body = {
			success: false,
			error: '没有登录'
		}
		return next;
	}
	this.session = this.session || {};
	this.session.user = user;
	yield next
}