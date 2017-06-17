'use strict'

var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');
var xss = require('xss');
var Video = require('../models/video');
var robot = require('../service/robot');
var Config = require('../../config/config');
var Audio = require('../models/audio');
var User = require('../models/user')
var Creation = require('../models/creation')

exports.up = function *(next){
    var body = this.request.body;
    var user = this.session.user;
    var creation = yield Creation.findOne({
        _id: body.id
    }).exec()
    if(!creation){
        this.body = {
            success: false,
            err: '视频找不着啦'
        }
        return next
    }
    if(body.up == 'yes'){
        creation.votes.push(String(user._id))
    }else{
        creation.votes = _.without(creation.votes,String(user._id))
    }
    creation.up = creation.votes.length;
    yield creation.save()
    this.body = {
        success: true
    }
}
var userFields = [
    'avatar',
    'nickname',
    'gender',
    'age',
    'breed'
]
exports.find = function *(next){
    var page = parseInt(this.query.page,10) || 1;
    var count = 5
    var offset = (page - 1) * count;
    var queryArray = [
        Creation
            .find({finish: 100})
            .sort({'meta.createAt': -1})
            .skip(offset)
            .limit(count)
            .populate('author',userFields.join( ))
            .exec(),
        Creation.count({finish: 100}).exec()
    ]
    var data = yield queryArray;
    console.log(data[0],data[0].length)
    this.body = {
        success: true,
        data: data[0],
        total: data[1]
    }
}
function asyncMedia(videoId,audioId){
    if(!videoId){
        return
    }
    var query = {
        _id: audioId
    }
    if(!audioId){
        query = {
            video: videoId
        }
    }
    Promise.all([
        Video.findOne({
            _id: videoId
        }).exec(),
        Audio.findOne(query).exec()
    ])
    .then(function(data){
        var video = data[0];
        var audio = data[1];
        console.log('检查数据有效性')
        if(!video || !video.public_id || !audio || !audio.public_id){
            return 
        }
        console.log('开始同步音频、视频')
        var video_public_id = video.public_id;
        var audio_public_id = audio.public_id.replace(/\//g,':');
        var videoName = video_public_id.replace(/\//g,'')+'.mp4';
        var videoURL = 'http://res.cloudinary.com/dbbkrk44p/video/upload/e_volume:-100/e_volume:400,l_video:' + 
                    audio_public_id + '/' + video_public_id + '.mp4';
        var thumbName = video_public_id.replace(/\//g,'_')+'jpeg';
        var thumbURL = 'http://res.cloudinary.com/dbbkrk44p/video/upload/'+video_public_id+'.jpg';
        console.log('同步视频到七牛');
        robot.saveToQiniu(videoURL,videoName)
            .catch(function(err){
                console.log(err)
            })
            .then(function(response){
                if(response && response.key){
                    audio.qiniu_video = response.key;
                    audio.save().then(function(_audio){
                        console.log(_audio)
                        Creation.findOne({
                            video: video._id,
                            audio: audio._id
                        }).exec()
                        .then(function(_creation){
                            if(_creation){
                                if(!_creation.qiniu_video){
                                    _creation.qiniu_video = _audio.qiniu_video
                                    _creation.finish += 30
                                    _creation.save()
                                }
                            }
                        })
                    });
                    console.log('同步视频成功')
                }
            })
        robot.saveToQiniu(thumbURL,thumbName)
            .catch(function(err){
                console.log(err)
            })
            .then(function(response){
                if(response && response.key){
                    audio.qiniu_thumb = response.key;
                    audio.save().then(function(_audio){
                        console.log(_audio)
                        Creation.findOne({
                            video: video._id,
                            audio: audio._id
                        }).exec()
                        .then(function(_creation){
                            if(_creation){
                                if(!_creation.qiniu_video){
                                    _creation.qiniu_thumb = _audio.qiniu_thumb
                                    _creation.finish += 30
                                    _creation.save()
                                }
                            }
                        })
                    });
                    console.log('同步封面成功')
                }
            })
    })
}
exports.video = function *(next) {
    var user = this.session.user;
    var body = this.request.body
    var videoData = body.video
    if (!videoData || !videoData.key) {
	    this.body = {
	      success: false,
	      err: '视频没有上传成功！'
	    }

	    return next
    }

	var video = yield Video.findOne({
	    qiniu_key: videoData.key
	}).exec()
    if (!video) {
	    video = new Video({
	      author: user._id,
	      qiniu_key: videoData.key,
	      persistentId: videoData.persistentId
	    })
    	video = yield video.save()
  	}
    var url = Config.qiniu.video + video.qiniu_key

    robot
	    .uploadToCloudinary(url)
	    .then(function(data) {
            console.log('video====>'+data)
	      if (data && data.public_id) {
	        video.public_id = data.public_id
	        video.detail = data
	        video.save().then(function(_video){
                asyncMedia(_video._id)
            })
	    }
    })

	this.body = {
	    success: true,
	    data: video._id
	}
}
exports.audio = function *(next){
    var user = this.session.user;
	var body = this.request.body
    var audioData = body.audio
    var videoId = body.videoId
    if(!audioData || !audioData.public_id){
    	this.body = {
	      success: false,
	      err: '音频没有上传成功！'
	    }
	    return next
    }
    var audio = yield Audio.findOne({
    	public_id: audioData.public_id
    }).exec()
    var video = yield Video.findOne({
    	_id: videoId
    }).exec()
    if(!audio){
    	var _audio = {
    		author: user._id,
    		public_id: audioData.public_id,
    		detail: audioData
    	}
    	if(video){
    		_audio.video = video._id
    	}
    	audio = new Audio(_audio)
    	audio = yield audio.save()
    }
    // 异步操作
    asyncMedia(video._id, audio._id)

    this.body = {
    	success: true,
    	data: audio._id
    }
}
exports.save = function *(next){
    var body = this.request.body;
    var user = this.session.user;
    var videoId = body.videoId;
    var audioId = body.audioId;
    var title = body.title;
    var video = yield Video.findOne({
        _id: videoId
    }).exec()
    var audio = yield Audio.findOne({
        _id: audioId
    }).exec()
    if(!video || !audio){
        this.body = {
            success: false,
            err: '音频或者视频素材不能为空'
        }
        return next
    }
    var creation = yield Creation.findOne({
        video: video,
        audio: audio
    }).exec()
    if(!creation){
        var creationData = {
            author: user._id,
            title: xss(title),
            video: videoId,
            audio: audioId,
            finish: 20,
        }
        var video_public_id = video.public_id;
        var audio_public_id = audio.public_id;
        if(video_public_id && audio_public_id){
            creationData.cloudinary_thumb = 'http://res.cloudinary.com/dbbkrk44p/video/upload/'+video_public_id+'.jpg';
            creationData.cloudinary_video = 'http://res.cloudinary.com/dbbkrk44p/video/upload/e_volume:-100/e_volume:400,l_video:' + 
                    audio_public_id.replace(/\//g,':') + '/' + video_public_id + '.mp4';
            creationData.finish += 20
        }
        if(audio.qiniu_thumb){
            creationData.qiniu_thumb = audio.qiniu_thumb;
            creationData.finish += 30
        }
        if(audio.qiniu_video){
            creationData.qiniu_video = audio.qiniu_video;
            creationData.finish += 30
        }
        creation = new Creation(creationData)
    }
    creation = yield creation.save()
    this.body = {
        success: true,
        data: {
            id: creation._id,
            finish: creation.finish,
            title: creation.title,
            qiniu_thumb: creation.qiniu_thumb,
            qiniu_video: creation.qiniu_video,
            author: {
                avatar: user.avatar,
                nickname: user.nickname,
                gender: user.gender,
                breed: user.breed,
                _id: user._id
            }
        }
    }
}
