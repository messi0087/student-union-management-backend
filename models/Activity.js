const Sequelize = require('sequelize');
const Model =Sequelize.Model;
const sequelize = require('../data-base/index');


//实例化数据模板
class Activity extends Model{}
Activity.init({
  // attributes
  activity_id:{
    type:Sequelize.INTEGER,
    primaryKey:true,            //主键
    allowNull:false,            //不允许空
    autoIncrement: true,        //自增
    unique: true                //要求不能重复
    // defaultValue:Sequelize.UUIDV1
  },
  activity_theme: {
    type: Sequelize.STRING,
    allowNull: false
  },
  activity_address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  activity_content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  activity_charge: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  activity_time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  activity_situation: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  activity_reviewer_department:{
    type: Sequelize.STRING,
    allowNull: true
  },
  activity_reviewer:{
    type: Sequelize.STRING,
    allowNull: true
  },
  activity_reviewer_position:{
    type: Sequelize.INTEGER,
    allowNull: true
  },
  activity_originator_department:{
    type: Sequelize.STRING,
    allowNull: false
  },
  activity_originator:{
    type: Sequelize.STRING,
    allowNull: false
  },
  activity_originator_position:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  activity_originator_id:{
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
  modelName:'Activity',
  freezeTableName:true,
  timestamps: true,
  // 定义表的名称
  tableName: 'activity_table',
  //options
});
//

// Activity.sync({force: true}).then(() => console.log('SUCCESS CREATE TABLE Activity')).catch(err => console.log(err));

// // 创建关联增加数据
// User.sync({ force: true }).then(() => {
//     // Now the `users` table in the database corresponds to the model definition
//     return User.create({
//         name: 'Johsns',
//         email: 'Hancoscks@123',
//         password:'a11s2',
//     });
// });


module.exports =Activity;
