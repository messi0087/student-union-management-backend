const Sequelize = require('sequelize');
const Model =Sequelize.Model;
const sequelize = require('../data-base/index');


//实例化数据模板
class Meeting extends Model{}
Meeting.init({
  // attributes
  meeting_id:{
    type:Sequelize.INTEGER,
    primaryKey:true,            //主键
    allowNull:false,            //不允许空
    autoIncrement: true,        //自增
    unique: true                //要求不能重复
    // defaultValue:Sequelize.UUIDV1
  },
  meeting_theme: {
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_start_time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_end_time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_situation: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  meeting_reviewer_department:{
    type: Sequelize.STRING,
    allowNull: true
  },
  meeting_reviewer:{
    type: Sequelize.STRING,
    allowNull: true
  },
  meeting_reviewer_position:{
    type: Sequelize.INTEGER,
    allowNull: true
  },
  meeting_originator_department:{
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_originator:{
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_originator_position:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  meeting_originator_id:{
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
  modelName:'Meeting',
  freezeTableName:true,
  timestamps: true,
  // 定义表的名称
  tableName: 'meeting_table',
  //options
});
//

// Meeting.sync({force: true}).then(() => console.log('SUCCESS CREATE TABLE Meeting')).catch(err => console.log(err));

module.exports =Meeting;
