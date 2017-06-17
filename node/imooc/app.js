var express = require('express')//minimalist web framework package
var mongoose = require('mongoose')//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var path = require('path')      //This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
var bodyParser = require('body-parser')//URL-encoded form body parser. code: bodyParser.urlencoded(options)
var cookieParser = require('cookie-parser')
var session = require('express-session') //如果要使用session，需要单独包含这个模块
var mongoStore = require('connect-mongo')(session) //将session数据存入mongodb数据库
var logger = require('morgan');
var serveStatic = require('serve-static')
var multipart = require('connect-multiparty')
/**
* process.env#
* An object containing the user environment.
    An example of this object looks like:
    { TERM: 'xterm-256color',
      SHELL: '/usr/local/bin/bash',
      USER: 'maciej',
      PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
      PWD: '/Users/maciej',
      EDITOR: 'vim',
      SHLVL: '1',
      HOME: '/Users/maciej',
      LOGNAME: 'maciej',
      _: '/usr/local/bin/node'
    }
*/
//console.log(process.env.PORT);//undefined
var port = process.env.PORT || 3010

//Creates an Express application 'app'
var app = express();
app.locals.moment = require('moment');
var dbUrl = 'mongodb://localhost/imooc'
//connect imooc db
mongoose.connect(dbUrl)
//设置view映射路径   A directory or an array of directories for the application's views.
app.set('views', "./app/views/pages/")

//The default engine extension to use when omitted.
app.set('view engine', 'jade')

//Mounts the specified middleware function or functions at the specified path. If path is not specified, it defaults to “/”.
app.use(serveStatic(path.join(__dirname, "public")))
//more info to http://expressjs.com/en/4x/api.html#app.settings.table
// for parsing application/json
app.use(bodyParser.json())

app.use(multipart())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//使用cookie解析
app.use(cookieParser())
// 使用session存储会话
app.use(session({
    secret: "imooc",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        url: dbUrl,
        auto_reconnect: true,//issue 推荐解决方法
        collection: "sessions"
    })
}))
// 用于判断是否是开发环境
var env = process.env.NODE_ENV || 'development';
if("development" === env){
    app.set("showStackError",true);
    app.use(logger(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set("debug",true);
}
//Binds and listens for connections on the specified host and port. This method is identical to Node’s http.Server.listen().
app.listen(port)

console.log("node server started on port " + port)
require("./config/routes")(app);
//Routes HTTP GET requests to the specified path with the specified callback functions.
//index page rout
