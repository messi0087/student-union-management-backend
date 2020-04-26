//引入 User模型
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getMeetingPeople = {
  async MeetingPeople(data) {
    let result =[]
    let {departments,position,id} = data

    if( (departments ==='体育部' || departments ==='体育部') && position ===4 ){
      await  User.findAll({
        where: {
          user_departments: '文体中心',
        }
      })
        .then(res => {
        result.push(...res)
      })
        .catch(error => console.log(error.message));
      result =array
    }

    else if( (departments ==='记者部' || departments ==='宣传部') && position ===4 ){
      await  User.findAll({
        where: {
          user_departments: '新闻中心',
        }
      })
        .then(res => {
          result.push(...res)
        })
        .catch(error => console.log(error.message));
    }

    else if( (departments ==='办公室' || departments ==='外联部') && position ===4 ){
      await  User.findAll({
        where: {
          user_departments: '学办中心',
        }
      })
        .then(res => {
          result.push(...res)
        })
        .catch(error => console.log(error.message));
    }

    else if( (departments ==='组织部' || departments ==='青年志愿者协会') && position ===4 ){
      await  User.findAll({
        where: {
          user_departments: '团学中心',
        }
      })
        .then(res => {
          result.push(...res)
        })
        .catch(error => console.log(error.message));
    }

    else if( (departments ==='科竞部' || departments ==='创业部') && position ===4 ){
      await  User.findAll({
        where: {
          user_departments: '科创中心',
        }
      })
        .then(res => {
          result.push(...res)
        })
        .catch(error => console.log(error.message));
    }

    else if( (departments ==='文体中心' || departments ==='新闻中心' || departments ==='学办中心' ||
      departments ==='团学中心' || departments ==='科创中心') && position ===2 ){
      await  User.findAll({
        where: {
          user_authority: 1,
        }
      })
        .then(res => {
          result.push(...res)
        })
        .catch(error => console.log(error.message));
    }

    else if( position ===1 ){
      await  User.findAll({
        where: {
          user_authority: 0,
        }
      })
        .then(res => {
          result.push(...res)
        })
        .catch(error => console.log(error.message));
    }

    else {
      const findResult = await User.findAll({
        where: {
          user_id: {
            [Op.ne]: id,
          },
          user_departments: departments,
          user_authority: {
            [Op.lt]: position
          }
        }
      })
        .catch(error => console.log(error.message))

      result.push(...findResult)
    }
    return result
  }
}

module.exports = getMeetingPeople
