const express = require('express')
const router = express.Router()
//引入 Message模型
const Message = require('../../models/Message');
const passport =require('passport');




/**
 * @route GET api/message/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get("/test", async (req, res) => {
  res.send({
    'username': 'message',
    'sex': 'man',
    'address': '上海'
  })

})


/**
 * @route GET api/message/getMyMessage
 * @desc 获取我的消息
 * @access 接口是私密的
 */
router.get('/getMyMessage',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_id } =req.user[0].dataValues

  const findResult = await Message.findAll({
    where: {
      message_push_people: user_id
    }
  });

  if (findResult && findResult.length !== 0) {
    res.send({
      msg:'获取消息成功',
      status:200,
      messageData: findResult.map((item) =>{
        return {
          id: item.message_id,
          theme: item.message_theme,
          content: item.message_content,
          start_time: item.message_start_time,
          pushPeople: item.message_push_people,
          type: item.message_type,
        }
      }).reverse()
    })
  }else {
    res.send({
      msg:'获取消息失败，暂无可查询的消息',
      status:400
    })
  }
});


/**
 * @route POST api/message/deleteMessage
 * @desc 删除我的消息
 * @access 接口是私密的
 */
router.post('/deleteMessage',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_id } =req.user[0].dataValues

  Message.destroy({
    where: {
      message_id: req.body.id,
    }
  })
    .then(ress=>{
      res.send({
        msg:'删除消息成功',
        status:200,
      })
    })
    .catch(error=>{
      res.send({
        msg:'删除消息失败,error.message',
        status:400,
      })
      console.log(error.message)
    })
})




module.exports = router;
