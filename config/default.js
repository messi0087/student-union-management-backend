// default.js


// 设置配置文件
config = {
  // 启动端口
  port: 5000,

  // 数据库配置
  database: {
    Host:'localhost',
    User:'root',
    Password : '123456',
    Database : 'union'
  },

  //配置需要连接的数据库类型
  dialect:'mysql',

  //配置token的名称
  secretOrKey:'secret',

  //时区配置
  timezone: '+08:00' ,

  //连接池配置
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // 连接超时时间，默认 30000，ms
    idle: 10000 // 最大闲置时间，默认 10000，ms
  },

};

module.exports = config
