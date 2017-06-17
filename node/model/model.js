var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/part9');

var BookSchema = mongoose.Schema({
    name: String,
    author: String,
    publishTime: Date
});
mongoose.model('Book',BookSchema);
