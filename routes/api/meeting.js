const express = require('express')
const router = express.Router()
//引入 Meeting模型
const Meeting = require('../../models/Meeting');
const getPosition = require('../../utils/get_position')
//引入 Message模型
const Message = require('../../models/Message');
//引入 User模型
const User = require('../../models/User');

const passport =require('passport');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;





/**
 * @route GET api/meeting/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get("/test", async (req, res) => {
  res.send({
    'username': 'john',
    'sex': 'man',
    'address': '上海'
  })

})


/**
 * @route POST api/meeting/increaseMeeting
 * @desc 增加会议申请
 * @access 接口是私密的
 */
router.post('/increaseMeeting',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority,user_name,user_id } =req.user[0].dataValues


  console.log(user_authority)
  if( user_authority === 6 ){
    res.send({
      status: 400,
      msg: '增加失败，您无增加会议申请的权限',
    })

    return 0
  }


  const newMeeting = {
    meeting_theme: req.body.theme,
    meeting_address: req.body.address,
    meeting_content: req.body.content,
    meeting_start_time:  req.body.startTime,
    meeting_end_time:  req.body.endTime,
    meeting_situation: 0,
    meeting_originator_department: user_departments,
    meeting_originator: user_name,
    meeting_originator_position: user_authority,
    meeting_originator_id: user_id,
  }

  Meeting.create({...newMeeting})
    .then( (item) =>{

      if( (user_departments ==='体育部' || user_departments ==='体育部') && user_authority ===4 ){
        User.findAll({
          where: {
            user_departments: '文体中心',
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else if( (user_departments ==='记者部' || user_departments ==='宣传部') && user_authority ===4 ){
        User.findAll({
          where: {
            user_departments: '新闻中心',
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else if( (user_departments ==='办公室' || user_departments ==='外联部') && user_authority ===4 ){
        User.findAll({
          where: {
            user_departments: '学办中心',
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '活动会议通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else if( (user_departments ==='组织部' || user_departments ==='青年志愿者协会') && user_authority ===4 ){
        User.findAll({
          where: {
            user_departments: '团学中心',
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else if( (user_departments ==='科竞部' || user_departments ==='创业部') && user_authority ===4 ){
        User.findAll({
          where: {
            user_departments: '科创中心',
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else if( (user_departments ==='文体中心' || user_departments ==='新闻中心' || user_departments ==='学办中心' ||
        user_departments ==='团学中心' || user_departments ==='科创中心') && user_authority ===2 ){
        User.findAll({
          where: {
            user_authority: 1,
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else if( user_authority ===1 ){
        User.findAll({
          where: {
            user_authority: 0,
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      else {
        User.findAll({
          where: {
            user_id: {
              [Op.ne]: user_id,
            },
            user_departments: user_departments,
            user_authority: {
              [Op.lt]: user_authority
            }
          }
        })
          .then(res => {
            for (let people of res) {
              const newMessage = {
                message_theme: '会议申请通知',
                message_content: `${user_name}${getPosition.Position(user_authority)}新增一条会议申请，请您查看`,
                message_start_time:item.createdAt.toString(),
                message_push_people:people.user_id,
                message_type:2
              }
              Message.create({...newMessage})
                .catch(error=>console.log(error.message))
            }
          })
          .catch(error => console.log(error.message));
      }

      res.send({
        status :200,
        msg :'增加会议申请成功',
      })
    })
    .catch(err => {
      console.log(err.message)
      res.send({
        msg :'增加失败',
        status :400
      })
    })
});


/**
 * @route GET api/meeting/getMyMeeting
 * @desc 获取我的会议申请
 * @access 接口是私密的
 */
router.get('/getMyMeeting',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_id } =req.user[0].dataValues

  const findResult = await Meeting.findAll({
    where: {
      meeting_originator_id:user_id
    }
  })
    .catch(error=>console.log(error.message));

  if(findResult && findResult.length !== 0) {
    res.send({
      status: 200,
      msg: '查询成功',
      meetingData: findResult.map((item) =>{
        return {
          id: item.meeting_id,
          situation: item.meeting_situation,
          startTime: item.meeting_start_time,
          endTime: item.meeting_end_time,
          theme: item.meeting_theme,
          address: item.meeting_address,
          content: item.meeting_content,
          reviewerDepartment: item.meeting_reviewer_department,
          reviewer: item.meeting_reviewer,
          reviewerPosition: item.meeting_reviewer_position,
          originatorDepartment: item.meeting_originator_department,
          Originator: item.meeting_originator,
          OriginatorPosition: item.meeting_originator_position
        }
      }).reverse()
    })
  }else {
    res.send({
      status: 400,
      msg: '暂无会议申请'
    })
  }
})


/**
 * @route GET api/meeting/getAllMeeting
 * @desc 获取所有的审核过的会议申请
 * @access 接口是公开的的
 */
// router.get('/getAllActivity',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
router.get('/getAllMeeting',async (req, res)=>{
  const findResult = await Meeting.findAll({
    where: {
      meeting_situation: 1
    }
  })
    .catch(error=>console.log(error.message));

  if(findResult && findResult.length !== 0) {
    res.send({
      status: 200,
      msg: '查询成功',
      meetingData: findResult.map((item) =>{
        return {
          id: item.meeting_id,
          situation: item.meeting_situation,
          startTime: item.meeting_start_time,
          endTime: item.meeting_end_time,
          theme: item.meeting_theme,
          address: item.meeting_address,
          content: item.meeting_content,
          reviewerDepartment: item.meeting_reviewer_department,
          reviewer: item.meeting_reviewer,
          reviewerPosition: item.meeting_reviewer_position,
          originatorDepartment: item.meeting_originator_department,
          Originator: item.meeting_originator,
          OriginatorPosition: item.meeting_originator_position
        }
      }).reverse()
    })
  }else {
    res.send({
      status: 400,
      msg: '暂无审核过的会议申请'
    })
  }
})

/**
 * @route GET api/meeting/getVerifyMeeting
 * @desc 获取需要我审核的会议申请
 * @access 接口是公开的的
 */
router.get('/getVerifyMeeting',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority } =req.user[0].dataValues
  let meetingData =[]

  const findResult = await Meeting.findAll({
    where: {
      meeting_originator_department : user_departments,
      meeting_situation : 0,
      meeting_originator_position:{
        [Op.gt]: user_authority
      }
    }
  })
    .catch(error=>console.log(error.message));

  if(findResult && findResult.length !== 0) {
    meetingData.push(...findResult.reverse())
  }

  //越级查询
  if(user_departments==='文体中心'){
    let defaultDepartment1 = '体育部'
    let defaultDepartment2 = '文艺部'
    const findResult = await Meeting.findAll({
      where: {
        [Op.or]:
          [
            {meeting_originator_department: defaultDepartment1},
            {meeting_originator_department: defaultDepartment2}
          ],
        meeting_originator_position : 4,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }

  else if(user_departments==='新闻中心'){
    let defaultDepartment1 = '记者部'
    let defaultDepartment2 = '宣传部'
    const findResult = await Meeting.findAll({
      where: {
        [Op.or]:
          [
            {meeting_originator_department: defaultDepartment1},
            {meeting_originator_department: defaultDepartment2}
          ],
        meeting_originator_position : 4,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }

  else if(user_departments==='学办中心'){
    let defaultDepartment1 = '办公室'
    let defaultDepartment2 = '外联部'
    const findResult = await Meeting.findAll({
      where: {
        [Op.or]:
          [
            {meeting_originator_department: defaultDepartment1},
            {meeting_originator_department: defaultDepartment2}
          ],
        meeting_originator_position : 4,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }

  else if(user_departments==='团学中心'){
    let defaultDepartment1 = '组织部'
    let defaultDepartment2 = '青年志愿者协会'
    const findResult = await Meeting.findAll({
      where: {
        [Op.or]:
          [
            {meeting_originator_department: defaultDepartment1},
            {meeting_originator_department: defaultDepartment2}
          ],
        meeting_originator_position : 4,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }

  else if(user_departments==='科创中心'){
    let defaultDepartment1 = '科竞部'
    let defaultDepartment2 = '创业部'
    const findResult = await Meeting.findAll({
      where: {
        [Op.or]:
          [
            {meeting_originator_department: defaultDepartment1},
            {meeting_originator_department: defaultDepartment2}
          ],
        meeting_originator_position : 4,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }

  else if(user_departments==='主席团'){
    let defaultDepartment1 = '文体中心'
    let defaultDepartment2 = '新闻中心'
    let defaultDepartment3 = '学办中心'
    let defaultDepartment4 = '团学中心'
    let defaultDepartment5 = '科创中心'
    const findResult = await Meeting.findAll({
      where: {
        [Op.or]:
          [
            {meeting_originator_department: defaultDepartment1},
            {meeting_originator_department: defaultDepartment2},
            {meeting_originator_department: defaultDepartment3},
            {meeting_originator_department: defaultDepartment4},
            {meeting_originator_department: defaultDepartment5}
          ],
        meeting_originator_position : 2,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }

  else if(user_departments==='老师'){
    let defaultDepartment = '主席团'
    const findResult = await Meeting.findAll({
      where: {
        meeting_originator_department: defaultDepartment,
        meeting_originator_position : 1,
        meeting_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      meetingData.push(...findResult.reverse())
    }
  }


  //检测查询情况
  if(meetingData.length !==0){
    res.send({
      status: 200,
      msg: '查询成功',
      meetingData: meetingData.map((item) =>{
        return {
          id: item.meeting_id,
          situation: item.meeting_situation,
          startTime: item.meeting_start_time,
          endTime: item.meeting_end_time,
          theme: item.meeting_theme,
          address: item.meeting_address,
          content: item.meeting_content,
          reviewerDepartment: item.meeting_reviewer_department,
          reviewer: item.meeting_reviewer,
          reviewerPosition: item.meeting_reviewer_position,
          originatorDepartment: item.meeting_originator_department,
          Originator: item.meeting_originator,
          OriginatorPosition: item.meeting_originator_position
        }
      }).reverse()
    })
  }else {
    res.send({
      status: 400,
      msg: '查询失败，暂无可审核的会议申请',
    })
  }

})


/**
 * @route POST api/activity/verifyMeeting
 * @desc 进行会议的审核
 * @access 接口是私密的
 */
router.post('/verifyMeeting',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority,user_name } =req.user[0].dataValues

  Meeting.update({
    meeting_situation: req.body.situation,
    meeting_reviewer_department:user_departments,
    meeting_reviewer:user_name,
    meeting_reviewer_position:user_authority,
  },{
    where:{
      meeting_id :req.body.id
    }
  })
    .then(ra=>{
      if(Number(req.body.situation) ===1) {
        res.send({
          status: 200,
          msg: '审核成功，通过该会议申请'
        })
      }else {
        res.send({
          status: 200,
          msg: '审核成功，不通过该会议申请'
        })
      }
    })
    .catch(error =>{
      console.log(error.message)
      res.send({
        msg:error.message,
        status:400
      })
    })
})



module.exports = router;
