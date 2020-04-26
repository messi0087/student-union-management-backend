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
const messageAPI = require('./routes/api/message')
//使用查询报文body的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
//使用cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser(config.secretOrKey))

//引入工具包
const getMeetingPeople = require('./utils/get-meeting-people')
const getActivityPeople = require('./utils/get-activity-people')
const getPosition = require('./utils/get_position')


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
app.use('/message',messageAPI)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


const userInformationTable=[]

io.on('connection', function(socket){
    // console.log('a user connected',socket.id);

    // socket.on('disconnect', function(socket){
    //     console.log('user disconnected',socket);
    // });

    socket.on('loginOut', function(msg){
        let condition = userInformationTable.findIndex(item => item.id === msg.id)
        if(condition !==-1){
            userInformationTable.splice(condition,1)
        }
    });

    //广播向所有socket连接

    socket.on('chat message', function(msg){
        io.emit('chat message',msg);
    });

    socket.on('successAnnouncement',function(msg){
        socket.broadcast.emit('messageAnnouncement',{
            id:msg.id,
            msg:`有一条来自部门是${msg.departments},${msg.name}${msg.position}新的公告,请您查看`
        });
    })

    socket.on('successMeeting',async function(msg){
        let people = (await getMeetingPeople.MeetingPeople(msg)).map(item =>{
            return item.user_id
        })

        socket.broadcast.emit('messageMeeting',{
            id:people,
            msg:`有一条来自部门是${msg.departments},${msg.name}${getPosition.Position(msg.position)}新的会议申请,请您查看`
        });
    })

    socket.on('successActivity',async function(msg){
        let people = (await getActivityPeople.ActivityPeople(msg)).map(item =>{
            return item.user_id
        })

        socket.broadcast.emit('messageActivity',{
            id:people,
            msg:`有一条来自部门是${msg.departments},${msg.name}${getPosition.Position(msg.position)}新的活动申请,请您查看`
        });
    })

    socket.on('login', function(msg){
        let condition = userInformationTable.findIndex(item => item.id === msg.id)
        if(condition ===-1){
            userInformationTable.push({
                socket_id:socket.id,
                id:msg.id,
                name:msg.name
            })
        }else {
            userInformationTable[condition].socket_id = socket.id
        }
        io.emit('loginSuccess',msg);
    });

    socket.on('chat', function(msg){
        let result = userInformationTable.find(item => item.id === Number(msg.id))
        if(result) {
            msg.situation = 1
            socket.broadcast.to(result.socket_id).emit('chatSuccess', msg);
        }else {
            const newMessage = {
                message_theme: `${msg.sendName}：想要跟你聊天`,
                message_content: msg.sendId+'/'+msg.sendName,
                message_start_time: String(new Date()),
                message_push_people:msg.id,
                message_type: 3
            }
            const Message = require('./models/Message');
            Message.create({...newMessage})
              .then(()=>{
                  socket.broadcast.emit('messageTalk',{
                      id:msg.id,
                      msg:`${msg.sendName}：想要跟你聊天，发送了消息，请您查看`
                  });
              })
              .catch(error=>console.log(error.message))
        }
    });
});

http.listen(config.port, () => console.log(`服务将会启动在port ${config.port}!`))
