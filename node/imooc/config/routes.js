var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
module.exports = function(app){
	// 使用应用级中间件，任何请求都会执行这个中间件
	app.use(function(req,res,next){
	    var _user = req.session.user;
	    app.locals.user = _user;
	    return next();
	})

	// index page
	app.get('/', Index.index)

	// movie page
	app.get('/movie/:id',Movie.detail)
	app.get('/admin/movie/new',User.signinRequired, User.adminRequired,Movie.new)
	app.get('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.list)
	app.post('/admin/movie',User.signinRequired, User.adminRequired,Movie.savePoster,Movie.save)
	app.delete('/admin/movie/list',User.signinRequired, User.adminRequired,Movie.del)
	app.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired,Movie.update)

	//user page
	app.post('/user/signup',User.signup)
	app.get('/admin/user/list',User.signinRequired, User.adminRequired, User.userlist)
	app.post('/user/signin',User.signin)
	app.get('/signin',User.showSignin)
	app.get('/signup',User.showSignup)
	app.get('/logout',User.logout)

	// comment page
	app.post('/user/comment', User.signinRequired, Comment.save)

	// category page
	app.get('/admin/category/new',User.signinRequired, User.adminRequired,Category.new)
	app.post('/admin/category',User.signinRequired, User.adminRequired,Category.save)
	app.get('/admin/category/list',User.signinRequired, User.adminRequired,Category.list)
	app.get('/admin/category/update/:id',User.signinRequired, User.adminRequired,Category.update)

	// results page
	app.get('/results',Index.search)
}