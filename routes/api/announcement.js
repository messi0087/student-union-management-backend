const express = require('express')
const router = express.Router()
//引入 Announcement模型
const Announcement = require('../../models/Announcement');
const passport =require('passport');




/**
 * @route GET api/announcement/test
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
 * @route POST api/announcement/increaseAnnouncement
 * @desc 增加公告
 * @access 接口是私密的
 */
router.post('/increaseAnnouncement',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_departments,user_authority,user_name } =req.user[0].dataValues

  if(user_authority >=3){
    res.send({
      status :403,
      msg :'您的权限不够发布公告'
    })
    return 0
  }

  if(req.body.theme === ""||req.body.content === ""){
    res.send({
      status :400,
      msg :'主题或内容不能为空'
    })
    return 0
  }
  const newAnnouncement = {
    announcement_theme :req.body.theme,
    announcement_content :req.body.content,
    announcement_department :user_departments,
    announcement_originator :user_name,
    announcement_position :user_authority
  }


  Announcement.create({...newAnnouncement})
    .then( (item) =>{
      const newData={
        theme :item.announcement_theme,
        content :item.announcement_content,
        department :item.announcement_department,
        originator :item.announcement_originator,
        position :item.announcement_position,
        time :item.createdAt,
      }
      res.send({
        status :200,
        msg :'增加公告成功',
        newAnnouncement:newData
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
 * @route GET api/announcement/getAnnouncement
 * @desc 获取公告
 * @access 接口是公开的
 */
router.get("/getAnnouncement", async (req, res) => {
  const findResult = await Announcement.findAll({
    where: {
    }
  });
  if (findResult && findResult.length !== 0) {
    res.send({
      msg: '获取成功',
      status: 200,
      announcemenData :findResult.map((item) =>{
        return {
          theme :item.announcement_theme,
          context :item.announcement_content,
          time :item.createdAt,
          staff :item.announcement_originator,
          department :item.announcement_department,
          position :item.announcement_position
        }
      }).reverse()
    })
  }else {
    res.send({
      msg: '暂无公告数据',
      status: 400
    })
  }
})




module.exports = router;
