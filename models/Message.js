const Sequelize = require('sequelize');
const Model =Sequelize.Model;
const sequelize = require('../data-base/index');


//实例化数据模板
class Message extends Model{}
Message.init({
  // attributes
  message_id:{
    type:Sequelize.INTEGER,
    primaryKey:true,            //主键
    allowNull:false,            //不允许空
    autoIncrement: true,        //自增
    unique: true                //要求不能重复
    // defaultValue:Sequelize.UUIDV1
  },
  message_theme: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message_content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message_start_time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message_push_people: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  message_type: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue:Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue:Sequelize.NOW
  }
},{
  //实例连接
  sequelize,
  //模型名称
  modelName:'Message',
  freezeTableName:true,
  timestamps: true,
  // 定义表的名称
  tableName: 'message_table',
  //options
});
//

// Message.sync({force: true}).then(() => console.log('SUCCESS CREATE TABLE Message')).catch(err => console.log(err));

module.exports =Message;
