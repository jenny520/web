var mongoose = require('mongoose');
require('./model');

var Book = mongoose.model('Book');
var cond = {
	$or:[
		{author: 'Green'},
		{author: 'Jim'}
	]
};
Book.find(cond,function(err,docs){
	if(err){
		console.log('err',err);
	}
	console.log('result',docs);
})
