const express = require('express')
const router = express.Router()
const bcrypt =require('bcryptjs')
const tool = require('../../utils/key-tools')
const validateAuthority = require('../../utils/validate-authority')
//引入 User模型
const User = require('../../models/User');
const config = require('../../config/default');
const jwt =require('jsonwebtoken');
const passport =require('passport');




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
      user_email: req.body.account
    }
  });

  if (findResult && findResult.length === 0) {

    const newUser = {
      user_email: req.body.account,
      user_password: tool.enbcrypt(req.body.password),
      user_authority: validateAuthority.Authority(req.body.positionChoice),
      user_name:req.body.name,
      user_departments:req.body.departmentChoice,
      user_phone_number:req.body.phone,
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
 * @route POST api/user/changePassword
 * @desc 修改密码接口地址
 * @access 接口是公开的
 */
router.post("/changePassword", async (req, res) => {

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
      let changePassword = tool.enbcrypt(req.body.newPassward)
      User.update({
        user_password:changePassword
      },{
        where:{
          user_email: user.user_email
        }
      })
        .then(ra=>{
        res.send({
          msg:'密码修改成功',
          status:200
        })
      })
        .catch(error =>{
        console.log(error.message)
        res.send({
          msg:error.message,
          status:400
        })
      });
    } else {
      res.send({
        msg:'原密码错误',
        status:400
      })
    }
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
    let currntPassword = req.body.password
    const result = await bcrypt.compareSync(currntPassword, user.user_password);

    if(result){
      //验证通过 返回token
      const payload = {id: user.user_id , name : user.user_name};
      // console.log(payload);
      const token = jwt.sign( payload, config.secretOrKey ,{ expiresIn : "7 days"});

      res.cookie('xxx-token',token,{maxAge:60 * 60 * 24 *1000*7 ,signed:false});//如果上面没有设置字符串那么此处还是未被加密的
      // res.cookie('xxx-token',token,{maxAge:60 *1000,signed:false});//如果上面没有设置字符串那么此处还是未被加密的


      res.send({
        msg:'登录成功',
        status:200,
        name:user.user_name,
        token:token
      })
    }else {
      res.send({
        msg:'登录失败，密码错误',
        status:400
      })
    }

  } else {
    res.send({
      msg:'邮箱不存在，请先注册账号',
      status:400
    })
  }

});


/**
 * @route POST api/user/changeInformation
 * @desc 增加用户信息接口地址
 * @access 接口是公开的
 */
router.post("/changeInformation",passport.authenticate('jwt', { session: false })  ,async (req, res) => {
  let user =req.user[0].dataValues

  let name = user.user_name
  let authority = user.user_authority
  let departments  = user.user_departments
  let phone  = user.user_phone_number

  if(req.body.newName){
    name = req.body.newName
  }

  if(req.body.positionChoice){
    authority = validateAuthority.Authority(req.body.positionChoice)
  }

  if(req.body.departmentChoice){
    departments = req.body.departmentChoice
  }

  if(req.body.newPhone){
    phone = req.body.newPhone
  }

  User.update({
    user_authority: authority,
    user_name:name,
    user_departments:departments,
    user_phone_number:phone,
  },{
    where:{
      user_email: user.user_email
    }
  })
    .then(ra=>{
      res.send({
        status:200,
        msg:'修改用户信息成功',
        name,
        authority,
        departments,
        phone
      })
    })
    .catch(error =>{
      console.log(error.message)
      res.send({
        msg:error.message,
        status:400
      })
    })
})



/**
 * @route GET api/user/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get('/current',passport.authenticate('jwt', { session: false }) ,async (req, res)=>{
  let { user_id,user_email,user_phone_number,user_departments,user_authority,user_name } =req.user[0].dataValues
  res.send({
    status : 200,
    id : user_id,
    email : user_email,
    phone : user_phone_number,
    name : user_name,
    departmentChoice : user_departments,
    positionChoice : user_authority,
  })
});


/**
 * @route GET api/user/getAddressBook
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get("/getAddressBook", async (req, res) => {
  const resultZhuXi =[]
  const resultTeacher =[]
  //文体中心
  const resultWenTiCenter =[]
  const resultSportsDepartment =[]
  const resultArtsDepartment =[]
  //新闻中心
  const resultNewsCenter =[]
  const resultPublicityDepartment =[]
  const resultReporterDepartment =[]
  //科创中心
  const resultScientificallyCreateCenter =[]
  const resultScientificallyRaceDepartment =[]
  const resultStartUpBusinessDepartment =[]
  //团学中心
  const resultYouthLeagueCenter =[]
  const resultOrganizationDepartment =[]
  const resultYouthVolunteersAssociation =[]
  //学办中心
  const resultLearnCenter =[]
  const resultTheOfficeDepartment =[]
  const resultExternalConnectionDepartment =[]

  const department = [
    '主席团', '老师', '文体中心','学办中心','团学中心', '新闻中心','科创中心',
    '办公室','外联部','体育部','文艺部','组织部','青年志愿者协会','宣传部','记者部','科竞部','创业部',
  ]
  for (let item of department){
    const findResult = await User.findAll({
      where: {
        user_departments: item
      }
    })

    if(findResult && findResult.length > 0) {
      for( let data of findResult) {
        let newData = {
          id: data.user_id,
          name: data.user_name,
          departments: data.user_departments,
          email: data.user_email,
          phone: data.user_phone_number,
          position: data.user_authority
        }
        if(newData.departments ==='主席团') {
          resultZhuXi.push(newData)
        }
        else if(newData.departments ==='老师') {
          resultTeacher.push(newData)
        }

        else if(newData.departments ==='文体中心') {
          resultWenTiCenter.push(newData)
        }
        else if(newData.departments ==='体育部') {
          resultSportsDepartment.push(newData)
        }
        else if(newData.departments ==='文艺部') {
          resultArtsDepartment.push(newData)
        }

        else if(newData.departments ==='新闻中心') {
          resultNewsCenter.push(newData)
        }
        else if(newData.departments ==='宣传部') {
          resultPublicityDepartment.push(newData)
        }
        else if(newData.departments ==='记者部') {
          resultReporterDepartment.push(newData)
        }

        else if(newData.departments ==='科创中心') {
          resultScientificallyCreateCenter.push(newData)
        }
        else if(newData.departments ==='科竞部') {
          resultScientificallyRaceDepartment.push(newData)
        }
        else if(newData.departments ==='创业部') {
          resultStartUpBusinessDepartment.push(newData)
        }

        else if(newData.departments ==='团学中心') {
          resultYouthLeagueCenter.push(newData)
        }
        else if(newData.departments ==='组织部') {
          resultOrganizationDepartment.push(newData)
        }
        else if(newData.departments ==='青年志愿者协会') {
          resultYouthVolunteersAssociation.push(newData)
        }

        else if(newData.departments ==='学办中心') {
          resultLearnCenter.push(newData)
        }
        else if(newData.departments ==='办公室') {
          resultTheOfficeDepartment.push(newData)
        }
        else if(newData.departments ==='外联部') {
          resultExternalConnectionDepartment.push(newData)
        }
      }
    }
  }
  const bookData = [
    {
      title: '主席团',
      children: resultZhuXi,
      departmentDescription: '负责主持学生会的全面工作，积极与各部门联系，参与学校有关学生事务的管理，维护学生权益。'
    },
    {
      title: '老师',
      children: resultTeacher,
      departmentDescription: '管理整个学生会'
    },
    {
      title: '文体中心',
      departmentDescription: '问文体中心由文艺部,体育部两个个部门组成,主要工作实在学院组织文艺体育类相关',
      children: [...resultWenTiCenter,
        {
          title: '体育部',
          departmentDescription: '举办各类的体育比赛，在承办的各项活动中负责后勤保障工作',
          children: resultSportsDepartment
        },
        {
          title: '文艺部',
          departmentDescription: '文艺部是以“活跃校园文化气氛，丰富广大同学业余文化生活”为宗旨，积极、活跃、有效的开展各项校园文艺活动的部门，旨在增强同学间的交流，发现艺术人才。',
          children: resultArtsDepartment
        },
      ],
    },
    {
      title: '新闻中心',
      departmentDescription: '负责为学院大型活动撰写新闻稿（即文记），拍摄照片（即摄记），然后排版做推文，管理运营学院公众号，还有修图，采访等等。',
      children: [...resultNewsCenter,
        {
          title: '宣传部',
          departmentDescription: '宣传部是学生会对内外进行组织和开展活动的窗口，也是协调学生会开展宣传工作的重要职能部门。宣传部的主要工作是制作各种宣传海报、布置活动会场以及贺章的制作。\n',
          children: resultPublicityDepartment
        },
        {
          title: '记者部',
          departmentDescription: '负责好学院的网站运营、平时的新闻更新和采写、策划的现实中的事件,网络上也跟踪报道新闻',
          children: resultReporterDepartment
        },
      ],
    },
    {
      title: '科创中心',
      departmentDescription: '管理学院中的各类科技竞赛和学生的各种创业相关的工作',
      children: [...resultScientificallyCreateCenter,
        {
          title: '科竞部',
          departmentDescription: '科竞部主要负责学院的各项科技竞赛和举办一定的学院内的科技竞赛',
          children: resultScientificallyRaceDepartment
        },
        {
          title: '创业部',
          departmentDescription: '创业部是院学生会下设负责培养学生创业就业意识,提高学生综合素质,锻炼学生创新以及社会实践能力的部门',
          children: resultStartUpBusinessDepartment
        },
      ],
    },
    {
      title: '团学中心',
      departmentDescription: '负责协助主席团处理学生会日常事务;负责管理学生活动中心;负责学生会文件归档',
      children: [...resultYouthLeagueCenter,
        {
          title: '组织部',
          departmentDescription: '负责对各班团支部团费收缴、团员证的注册及团员档案管理工作。加强与学院各班团支书的联系，对各班团支部组织生活、团队活动的指导和评估。',
          children: resultOrganizationDepartment
        },
        {
          title: '青年志愿者协会',
          departmentDescription: ',以“行善之义举,谱爱之欢歌”为宗旨,依托于学校以及社会上的公益资源开展多种多样的公益活动。',
          children: resultYouthVolunteersAssociation
        },
      ],
    },
    {
      title: '学办中心',
      departmentDescription: '学办中心是负责学生工作,管理学生日常生活、学习、纪律的学院职能部门。',
      children: [...resultLearnCenter,
        {
          title: '办公室',
          departmentDescription: '办公室是院学生会的枢纽，主要负责协助主席团的工作和学生会日常工作安排，建立并管理各部门的工作档案和工作日志以及各种会议的组织、策划、记录、通知、考勤，起草和发送学生会.',
          children: resultTheOfficeDepartment
        },
        {
          title: '外联部',
          departmentDescription: '是学校与商家沟通的桥梁。 外联部最主要的任务就是为学生会和学生活动筹集资金，即拉赞助',
          children: resultExternalConnectionDepartment
        },
      ],
    },
  ]

    res.send({
      msg:'获取成功',
      status:200,
      bookData
  })
})




module.exports = router;
