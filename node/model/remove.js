var mongoose = require('mongoose');
require('./model');

var Book = mongoose.model('Book');

Book.findOne({'author':'Green'},function(err,doc){
	if(err){
		console.log(err);
		return ;
	}
	if(doc){
		console.log(doc);
		doc.remove();
	}
})