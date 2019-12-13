const express = require('express')
const router = express.Router()
const bcrypt =require('bcryptjs')
const tool = require('../../utils/key-tools')
//引入 User模型
const User = require('../../models/User');


/**
 * @route GET api/user/test
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
 * @route POST api/user/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post("/register", async (req, res) => {

  const findResult = await User.findAll({
    where: {
      user_email: req.body.email
    }
  });

  if (findResult && findResult.length === 0) {

    const newUser = {
      user_email: req.body.email,
      user_password: tool.enbcrypt(req.body.password),
      user_authority: '0',
    }

    User.create({...newUser})
      .catch(err => {
        console.log(err.message)
        res.send({
          msg:'注册失败',
          status:400
        })
      })

    res.send({
      msg:'注册成功',
      status:200
    })
  } else {
    res.send({
      msg:'邮箱已经被占用',
      status:400
    })
  }

});


/**
 * @route POST api/user/change
 * @desc 修改密码接口地址
 * @access 接口是公开的
 */
router.post("/change", async (req, res) => {

  const findResult = await User.findAll({
    where: {
      user_email: req.body.email
    }
  });

  if (findResult && findResult.length > 0) {

    const user = findResult[0]
    let currntPassword = req.body.currntPassword
    let newPassward = req.body.newPassward
    const result = await bcrypt.compareSync(currntPassword, user.user_password);

    if(result){
      User.update({
        password:newPassward
      },{
        where:{
          email: user.email
        }
      }).catch(error =>{
        console.log(error.message)
        res.send({
          msg:'修改失败',
          status:400
        })
      });
    }
    res.send({
      msg:'密码修改成功',
      status:200
    })
  } else {
    res.send({
      msg:'邮箱不存在',
      status:400
    })
  }

});

/**
 * @route POST api/user/login
 * @desc 登录接口地址
 * @access 接口是公开的
 */
router.post("/login", async (req, res) => {

  const findResult = await User.findAll({
    where: {
      user_email: req.body.email
    }
  });

  if (findResult && findResult.length > 0) {

    const user = findResult[0]
    let currntPassword = req.body.currntPassword
    const result = await bcrypt.compareSync(currntPassword, user.user_password);

    if(result){
      User.update({
        password:newPassward
      },{
        where:{
          email: user.email
        }
      }).catch(error =>{
        console.log(error.message)
        res.send({
          msg:'修改失败',
          status:400
        })
      });
    }
    res.send({
      msg:'密码修改成功',
      status:200
    })
  } else {
    res.send({
      msg:'邮箱不存在，请先注册账号',
      status:400
    })
  }

});


module.exports = router;
