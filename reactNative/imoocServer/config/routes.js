'use strict'

var Router = require('koa-router');
var User = require('../app/controllers/user');
var App = require('../app/controllers/app');
var Creation = require('../app/controllers/creation')
var Comment = require('../app/controllers/comment')

module.exports = function(){
	var router = new Router({
		prefix: '/api'
	})
	//user
	router.post('/user/signup',App.hasBody,User.signup)
	router.post('/user/verify',App.hasBody,User.verify)
	router.post('/user/update',App.hasBody,App.hasToken,User.update)

	//app
	router.post('/signature',App.signature)

	//creation
	router.get('/creations',App.hasToken,Creation.find)
	router.post('/creations',App.hasBody,App.hasToken,Creation.save)
	router.post('/creations/video',App.hasBody,App.hasToken,Creation.video)
	router.post('/creations/audio',App.hasBody,App.hasToken,Creation.audio)

	//comment
	router.get('/comments',App.hasToken,Comment.find)
	router.post('/comments',App.hasBody,App.hasToken,Comment.save)

	//votes
	router.post('/up',App.hasBody,App.hasToken,Creation.up)
	return router
}