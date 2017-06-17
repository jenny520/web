var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
	uid: Number,
	username:{
		type: String,
		default: 'new user',
		trim: true
	},
	blog: {
		type: String,
		set: function(url){
			if(!url){
				return url;
			}
			if(url.indexOf('http://') < 0 && url.indexOf('https://') < 0){
				url = 'http://' + url;
			}
			return url;
		}
	},
	firstName: String,
	lastName: String
});
UserSchema.set('toJSON',{getters:true,virtual:true});

UserSchema.virtual('fullname').get(function(){
	return this.firstName + this.lastName;
})
mongoose.model('User',UserSchema);
