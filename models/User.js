const Sequelize = require('sequelize');
const Model =Sequelize.Model;
const sequelize = require('../data-base/index');


//实例化数据模板
class User extends Model{}
User.init({
  // attributes
  user_id:{
    type:Sequelize.INTEGER,
    primaryKey:true,            //主键
    allowNull:false,            //不允许空
    autoIncrement: true,        //自增
    unique: true                //要求不能重复
    // defaultValue:Sequelize.UUIDV1
  },
  user_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  user_email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_authority:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user_departments:{
    type: Sequelize.STRING,
    allowNull: true
  },
  user_phone_number:{
    type: Sequelize.STRING,
    allowNull: true
  },
  user_avatar:{
    type: Sequelize.STRING,
    allowNull: true
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
  modelName:'User',
  freezeTableName:true,
  timestamps: true,
  // 定义表的名称
  tableName: 'user_table',
  //options
});



module.exports =User;
