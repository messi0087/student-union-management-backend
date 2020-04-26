const Sequelize = require('sequelize');
const config = require('../config/default');


//定义连接数据库的参数
const sequelize = new Sequelize(config.database.Database, config.database.User, config.database.Password, {
  host: config.database.Host,
  dialect: config.dialect,

  //不展示进行SQL语句的查询
  logging: false,

  //配置连接池
  pool: config.pool,

  //东八时区,数据库的时间设置
  timezone: config.timezone ,

});

module.exports =sequelize;

