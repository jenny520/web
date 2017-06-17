'use strict';
var qiniu = require('qiniu');
var Config = require('../../config/config');
var sha1 = require('sha1');
var uuid = require('uuid');
var cloudinary = require('cloudinary');
var Promise = require('bluebird');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = Config.qiniu.AK;
qiniu.conf.SECRET_KEY = Config.qiniu.SK;
cloudinary.config(Config.cloudinary)

//要上传的空间
// var bucket = 'gougouavatar';
//构建上传策略函数
// function uptoken(bucket, key) {
//   var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
//   return putPolicy.token();
// }
exports.getQiniuToken = function(body){
	var type = body.type;
	var key = uuid.v4();
	var putPolicy;
	var options = {
		persistentNotifyUrl: Config.notify
	}
	if(type == 'avatar'){
		key += '.jpeg';
		putPolicy = new qiniu.rs.PutPolicy('gougouavatar:'+key);
	}else if(type == 'video'){
		key += '.mp4';
		options.scope = 'gougouvideo:' + key;
		options.persistentOps = 'avthumb/mp4/an/1';
		putPolicy = new qiniu.rs.PutPolicy2(options);
	}else if(type == 'audio'){

	}
	var token = putPolicy.token();
	return {
		key: key,
		token: token
	};
}
exports.getCloudinaryToken = function(body){
	var type = body.type
	var timestamp = body.timestamp
	var folder
	var tags

  if (type === 'avatar') {
    folder = 'avatar'
    tags = 'app,avatar'
  }
  else if (type === 'video') {
    folder = 'video'
    tags = 'app,video'
  }
  else if (type === 'audio') {
    folder = 'audio'
    tags = 'app,audio'
  }
  console.log('===>'+'getCloudinaryToken')
  // data.data
  var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + Config.cloudinary.api_secret
  var key = uuid.v4()

  signature = sha1(signature)

  return {
    token: signature,
    key: key
  }
}
exports.uploadToCloudinary = function(url){
	return new Promise(function(resolve, reject) {
	    cloudinary.uploader.upload(url, function(result) {
		    if (result && result.public_id) {
		        resolve(result)
		    }
		    else {
		        reject(result)
		    }
	    },{
	        resource_type: 'video',
	        folder: 'video'
	    })
    })
}
exports.saveToQiniu = function(url,key){
	var client = new qiniu.rs.Client()
	return new Promise(function(resolve,reject){
		client.fetch(url,'gougouvideo',key,function(err,ret){
			if(err){

				reject(err)
			}else{
				resolve(ret)
			}
		})
	})
}
