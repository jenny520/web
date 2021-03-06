'use strict'

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var db = 'mongodb://localhost/imoocApp';

mongoose.Promise = require('bluebird');
mongoose.connect(db);

var models_path = path.join(__dirname,'/app/models');
var walk = function(modelPath){
	fs
	  .readdirSync(modelPath)
	  .forEach(function(file){
	  	var filePath = path.join(modelPath,'/'+file);
	  	var stat = fs.statSync(filePath);

	  	if(stat.isFile()){
  			if(/(.*)\.(js|coffee)/.test(file)){
  				require(filePath)
  			}
	  	}else if (stat.isDirectory()) {
        	walk(filePath)
      	}
	  })
}

var koa = require('koa');
var logger = require('koa-logger');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var app = koa();
app.keys = ['secret', 'key']
app.use(logger())
app.use(session(app))
app.use(bodyParser())
var router = require('./config/routes')()
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(12345)
