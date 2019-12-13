const config = require('./config/default')
//引入数据库配置
const sequelize = require('./data-base/index');
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// const Activity = require('./models/Activity');
const userAPI = require('./routes/api/user')
//使用查询报文body的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


app.use('/user',userAPI)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//确认数据库是否成功
// //执行连接数据库
sequelize
  .authenticate()
  .then(function(err) {
    console.log('The Database is connected , database is ' + config.database.Database);
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message',msg);
    });
});

http.listen(config.port, () => console.log(`服务将会启动在port ${config.port}!`))
