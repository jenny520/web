var mongoose = require('mongoose');
require('./model');

var Book = mongoose.model('Book');

Book.find({},function(error,docs){
	if(error){
		console.log('error:',error);
		return;
	}
	console.log(docs);
})