const express = require('express')
const router = express.Router()
//引入 Activity模型
const Activity = require('../../models/Activity');
const passport =require('passport');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;





/**
 * @route GET api/activity/test
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
 * @route POST api/activity/increaseActivity
 * @desc 增加账单审核
 * @access 接口是私密的
 */
router.post('/increaseActivity',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority,user_name,user_id } =req.user[0].dataValues

  const newActivity = {
    activity_theme: req.body.theme,
    activity_address: req.body.address,
    activity_content: req.body.content,
    activity_charge: req.body.charge,
    activity_time:  req.body.time,
    activity_situation: 0,
    activity_originator_department: user_departments,
    activity_originator: user_name,
    activity_originator_position: user_authority,
    activity_originator_id: user_id,
  }

  Activity.create({...newActivity})
    .then( () =>{
      res.send({
        status :200,
        msg :'增加公告成功',
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
 * @route GET api/activity/getMyActivity
 * @desc 获取我的申请
 * @access 接口是私密的
 */
router.get('/getMyActivity',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_id } =req.user[0].dataValues

  const findResult = await Activity.findAll({
    where: {
      activity_originator_id:user_id
    }
  })
    .catch(error=>console.log(error.message));

  if(findResult && findResult.length !== 0) {
    res.send({
      status: 200,
      msg: '查询成功',
      activityData: findResult.map((item) =>{
        return {
          id: item.activity_id,
          situation: item.activity_situation,
          time: item.activity_time,
          theme: item.activity_theme,
          address: item.activity_address,
          content: item.activity_content,
          charge: item.activity_charge,
          reviewerDepartment: item.activity_reviewer_department,
          reviewer: item.activity_reviewer,
          reviewerPosition: item.activity_reviewer_position,
          originatorDepartment: item.activity_originator_department,
          Originator: item.activity_originator,
          OriginatorPosition: item.activity_originator_position
        }
      }).reverse()
    })
  }else {
    res.send({
      status: 400,
      msg: '暂无申请'
    })
  }
})


/**
 * @route GET api/activity/getAllActivity
 * @desc 获取所有的审核过的申请
 * @access 接口是公开的的
 */
// router.get('/getAllActivity',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
router.get('/getAllActivity',async (req, res)=>{
  const findResult = await Activity.findAll({
    where: {
      activity_situation:1
    }
  })
    .catch(error=>console.log(error.message));

  if(findResult && findResult.length !== 0) {
    res.send({
      status: 200,
      msg: '查询成功',
      activityData: findResult.map((item) =>{
        return {
          id: item.activity_id,
          situation: item.activity_situation,
          time: item.activity_time,
          theme: item.activity_theme,
          address: item.activity_address,
          content: item.activity_content,
          charge: item.activity_charge,
          reviewerDepartment: item.activity_reviewer_department,
          reviewer: item.activity_reviewer,
          reviewerPosition: item.activity_reviewer_position,
          originatorDepartment: item.activity_originator_department,
          Originator: item.activity_originator,
          OriginatorPosition: item.activity_originator_position
        }
      }).reverse()
    })
  }else {
    res.send({
      status: 400,
      msg: '暂无审核过的申请'
    })
  }
})

/**
 * @route GET api/activity/getVerifyActivity
 * @desc 获取需要我审核的活动
 * @access 接口是公开的的
 */
router.get('/getVerifyActivity',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority,user_name,user_id } =req.user[0].dataValues
  let activityData =[]

  const findResult = await Activity.findAll({
    where: {
      activity_originator_department : user_departments,
      activity_situation : 0,
      activity_originator_position:{
        [Op.gt]: user_authority
      }
    }
  })
    .catch(error=>console.log(error.message));

  if(findResult && findResult.length !== 0) {
    activityData.push(...findResult.reverse())
  }

  //越级查询
  if(user_departments==='文体中心'){
    let defaultDepartment1 = '体育部'
    let defaultDepartment2 = '文艺部'
    const findResult = await Activity.findAll({
      where: {
        [Op.or]:
          [
            {activity_originator_department: defaultDepartment1},
            {activity_originator_department: defaultDepartment2}
          ],
        activity_originator_position : 4,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }

  if(user_departments==='新闻中心'){
    let defaultDepartment1 = '记者部'
    let defaultDepartment2 = '宣传部'
    const findResult = await Activity.findAll({
      where: {
        [Op.or]:
          [
            {activity_originator_department: defaultDepartment1},
            {activity_originator_department: defaultDepartment2}
          ],
        activity_originator_position : 4,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }

  if(user_departments==='学办中心'){
    let defaultDepartment1 = '办公室'
    let defaultDepartment2 = '外联部'
    const findResult = await Activity.findAll({
      where: {
        [Op.or]:
          [
            {activity_originator_department: defaultDepartment1},
            {activity_originator_department: defaultDepartment2}
          ],
        activity_originator_position : 4,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }

  if(user_departments==='团学中心'){
    let defaultDepartment1 = '组织部'
    let defaultDepartment2 = '青年志愿者协会'
    const findResult = await Activity.findAll({
      where: {
        [Op.or]:
          [
            {activity_originator_department: defaultDepartment1},
            {activity_originator_department: defaultDepartment2}
          ],
        activity_originator_position : 4,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }

  if(user_departments==='科创中心'){
    let defaultDepartment1 = '科竞部'
    let defaultDepartment2 = '创业部'
    const findResult = await Activity.findAll({
      where: {
        [Op.or]:
          [
            {activity_originator_department: defaultDepartment1},
            {activity_originator_department: defaultDepartment2}
          ],
        activity_originator_position : 4,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }

  if(user_departments==='主席团'){
    let defaultDepartment1 = '文体中心'
    let defaultDepartment2 = '新闻中心'
    let defaultDepartment3 = '学办中心'
    let defaultDepartment4 = '团学中心'
    let defaultDepartment5 = '科创中心'
    const findResult = await Activity.findAll({
      where: {
        [Op.or]:
          [
            {activity_originator_department: defaultDepartment1},
            {activity_originator_department: defaultDepartment2},
            {activity_originator_department: defaultDepartment3},
            {activity_originator_department: defaultDepartment4},
            {activity_originator_department: defaultDepartment5}
          ],
        activity_originator_position : 2,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }

  if(user_departments==='老师'){
    let defaultDepartment = '主席团'
    const findResult = await Activity.findAll({
      where: {
        activity_originator_department: defaultDepartment,
        activity_originator_position : 1,
        activity_situation : 0
      }
    })
      .catch(error=>console.log(error.message));

    if(findResult && findResult.length !== 0) {
      activityData.push(...findResult.reverse())
    }
  }


  //检测查询情况
  if(activityData.length !==0){
    res.send({
      status: 200,
      msg: '查询成功',
      activityData: activityData.map((item) =>{
        return {
          id: item.activity_id,
          situation: item.activity_situation,
          time: item.activity_time,
          theme: item.activity_theme,
          address: item.activity_address,
          content: item.activity_content,
          charge: item.activity_charge,
          reviewerDepartment: item.activity_reviewer_department,
          reviewer: item.activity_reviewer,
          reviewerPosition: item.activity_reviewer_position,
          originatorDepartment: item.activity_originator_department,
          Originator: item.activity_originator,
          OriginatorPosition: item.activity_originator_position
        }
      }).reverse()
    })
  }else {
    res.send({
      status: 400,
      msg: '查询失败，暂无可审核的活动申请',
    })
  }

})


/**
 * @route POST api/activity/verifyActivity
 * @desc 进行审核
 * @access 接口是私密的
 */
router.post('/verifyActivity',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority,user_name } =req.user[0].dataValues

  Activity.update({
    activity_situation: req.body.situation,
    activity_reviewer_department:user_departments,
    activity_reviewer:user_name,
    activity_reviewer_position:user_authority,
  },{
    where:{
      activity_id :req.body.id
    }
  })
    .then(ra=>{
      if(Number(req.body.situation) ===1) {
        res.send({
          status: 200,
          msg: '审核成功，通过该申请'
        })
      }else {
        res.send({
          status: 200,
          msg: '审核成功，不通过该申请'
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
