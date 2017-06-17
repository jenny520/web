var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10
    //define schema MovieSchema
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createdAt:{
            type: Date,
            default: Date.now()
        },
        updatedAt:{
            type: Date,
            default: Date.now()
        }
    }
})
//每次保存前都会做的事情
UserSchema.pre('save',function(next){
    var user = this
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    }
    else{
        this.meta.updatedAt = Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err)
        }

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
            return next(err)
        }

        user.password = hash
        next()
    })
  })
})
// schema的实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}
//schema的静态方法
UserSchema.statics = {
    fetch: function( cb ){
        return this
            .find({})
            .sort('meta.updatedAt')
            .exec(cb)
    },
    findById: function( id, cb ){
        return this
            .findOne({"_id":id})
            .exec(cb)
    }
}
module.exports = UserSchema;