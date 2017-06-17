var mongoose = require('mongoose');
require('./model');

var Book = mongoose.model('Book');
var book = new Book({
    name: 'NAME Web Develpoment',
    author: 'Green',
    publishTime: new Date()
});

book.save(function(error){
    console.log('save status:', error ? 'falied':'success');
})