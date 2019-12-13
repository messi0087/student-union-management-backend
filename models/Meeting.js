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
  meeting_time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_content: {
    type: Sequelize.STRING,
    allowNull: true
  },
  meeting_department:{
    type: Sequelize.STRING,
    allowNull: false
  },
  meeting_reviewer:{
    type: Sequelize.INTEGER,
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
  modelName:'Meeting',
  freezeTableName:true,
  timestamps: true,
  // 定义表的名称
  tableName: 'meeting_table',
  //options
});
//

Meeting.sync({force: true}).then(() => console.log('SUCCESS CREATE TABLE Meeting')).catch(err => console.log(err));

// // 创建关联增加数据
// User.sync({ force: true }).then(() => {
//     // Now the `users` table in the database corresponds to the model definition
//     return User.create({
//         name: 'Johsns',
//         email: 'Hancoscks@123',
//         password:'a11s2',
//     });
// });


module.exports =Meeting;
