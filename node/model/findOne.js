var mongoose = require('mongoose');
require('./model');
var Book = mongoose.model('Book');
Book.findOne({'author':'Green'},function(err,doc){
	if(err){
		console.log('err',err);
	}
	doc.author = 'Jim';
	doc.save();
	console.log('result:',doc);
})