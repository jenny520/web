'use strict'

var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	phoneNumber: {
		unique: true,
		type: String
	},
	areaCode: String,
	verified: {
		type: Boolean,
		default: false
	},
	verifyCode: String,
	accessToken: String,
	nickname: String,
	gender: String,
	age: String,
	breed: String,
	avatar: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});
UserSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

module.exports = mongoose.model('User', UserSchema)
