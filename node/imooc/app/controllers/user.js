var User = require("../models/user");

// 展示登录页面
exports.showSignin = function(req,res){
	res.render('signin',{
		title: '登录页面'
	})
}
// 展示注册页面
exports.showSignup = function(req,res){
	res.render('signup',{
		title: '注册页面'
	})
}
//用户注册页面的路由
exports.signup = function(req,res){
	var _user = req.body.user
    User.findOne({name: _user.name},function(err,user){
        if(err){
            console.log(err)
        }else if(user){
            res.redirect('/signin')
        }else{
            user = new User(_user)    //初始化数据模型
            user.save(function(err,user){
                if(err){
                    console.log(err)
                }
                res.redirect('/')
            })
        }
    })
}
// 用户注册列表页面的路由
exports.userlist = function(req,res){
	//查询该数据库下所有记录
    User.fetch(function(err, users){
        if(err){
            console.log(err);
        }
        res.render('userlist', {
            title: 'user 列表页',
            users: users
        })
    })
}	
// 用户登录路由
exports.signin = function(req,res){
	var _user = req.body.user
    var _name = _user.name
    var _password = _user.password
    User.findOne({name: _name},function(err,user){
        if(err){
            console.log(err)
        }else if(!user){
            res.redirect('/signup')
        }else{
            user.comparePassword(_password,function(err,isMatch){
                if(err){
                    console.log(err)
                }else if(isMatch){
                    console.log('Password is Matched')
                    req.session.user = user
                    return res.redirect('/')
                }else{
                    res.redirect('/signin')
                }
            })
        }
    })
}
// 用户退出登录
exports.logout = function(req,res){
	delete req.session.user
    res.redirect("/")
}

// middleware for user
exports.signinRequired = function(req,res,next){
    var user = req.session.user
    if(!user){
        return res.redirect('/signin')
    }
    next()
}
exports.adminRequired = function(req,res,next){
    var user = req.session.user
    if(user.role <= 10){
        return res.redirect('/signin')
    }
    next()
}