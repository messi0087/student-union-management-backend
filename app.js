const config = require('./config/default')
//引入数据库配置
const sequelize = require('./data-base/index');
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//引入passport
const passport = require("passport");
//引入API
const activityAPI = require('./routes/api/activity');
const userAPI = require('./routes/api/user')
const announcementAPI = require('./routes/api/announcement')
const meetingAPI = require('./routes/api/meeting')
//使用查询报文body的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
//使用cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser(config.secretOrKey))


app.use(passport.initialize());     //passport初始化
require("./utils/passport")(passport);


// 拦截器
// 配置跨域
app.use((req, res, next) => {
    // 设置是否运行客户端设置 withCredentials
    // 即在不同域名下发出的请求也可以携带 cookie
    res.header("Access-Control-Allow-Credentials",true)
    // 第二个参数表示允许跨域的域名，* 代表所有域名
    // res.header('Access-Control-Allow-Origin', 'http://192.168.101.6:3000/')
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS') // 允许的 http 请求的方法
    // // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization , Content-Length, X-Requested-With')
    next()
})



app.use('/user',userAPI)
app.use('/announcement',announcementAPI)
app.use('/activity',activityAPI)
app.use('/meeting',meetingAPI)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//确认数据库是否成功
// //执行连接数据库
// sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('The Database is connected , database is ' + config.database.Database);
//   })
//   .catch(function (err) {
//     console.log('Unable to connect to the database:', err);
//   });
//
// setTimeout(()=>sequelize.close((res)=>console.log(res)),5000)


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message',msg);
    });

    socket.on('aaa',function(msg){
        console.log(msg)
        io.emit('aaa','我是后端的推给你');
    })
});

http.listen(config.port, () => console.log(`服务将会启动在port ${config.port}!`))
