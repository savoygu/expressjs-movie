// var Index = require('../app/controllers/index')
// var User = require('../app/controllers/user')
// var Movie = require('../app/controllers/movie')
// var Comment = require('../app/controllers/comment')
// var Category = require('../app/controllers/category')
// var multipart = require('connect-multiparty')
// var multipartMiddleware = multipart()

module.exports = function (app) {
  app.use(function (req, res, next) {
    const _user = req.session.user

    app.locals.user = _user

    return next()
  })

  // 路由分发
  app.use('/', require('../app/routes/index'))
  app.use('/user', require('../app/routes/user'))
  app.use('/movie', require('../app/routes/movie'))
  app.use('/admin', require('../app/routes/admin'))

  // 首页
  // app.get('/', Index.index) // 电影首页

  // 用户
  // app.post('/user/signup', User.signup) // 用户注册
  // app.post('/user/signin', User.signin) // 用户登录
  // app.get('/signin', User.showSignin) // 登录页面
  // app.get('/signup', User.showSignup) // 注册页面
  // app.get('/logout', User.logout) // 登出
  // app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)// 用户列表

  // 电影
  // app.get('/movie/:id', Movie.detail) // 电影详情
  // app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new) // 新增电影(回显数据)
  // app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update) // 更新电影(回显数据)
  // app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save) // 新增电影 / 更新电影
  // app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list) // 电影列表
  // app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del) // 删除电影

  // 评论
  // app.post('/user/comment', User.signinRequired, Comment.save) // 新增评论

  // 电影分类
  // app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new) // 新增电影分类(回显数据)
  // app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save) // 新增电影分类 / 更新电影
  // app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list) // 电影分类列表
  //
  // app.get('/results', Index.search) // 电影分类列表

  /*
   {
   _id: 1,
   doctor: '何塞·帕迪里亚',
   country: '美国',
   title: '机械战警',
   year: 2014,
   poster: 'http://g4.ykimg.com/05160000530EEB63675839160D0B79D5',
   language: '英语',
   flash: 'http://player.youku.com/embed/XNzEwNDg4OTY4',
   summary: '2028年，专事军火开发的机器人公司Omni Corp.生产了大量装备精良的机械战警，他们被投入到惩治犯罪等行动中，取得显著的效果。罪犯横行的底特律市，嫉恶如仇、正义感十足的警察亚历克斯·墨菲（乔尔·金纳曼 饰）遭到仇家暗算，身体受到毁灭性破坏。借助于Omni公司天才博士丹尼特·诺顿（加里·奥德曼 饰）最前沿的技术，墨菲以机械战警的形态复活。数轮严格的测试表明，墨菲足以承担起维护社会治安的重任，他的口碑在民众中直线飙升，而墨菲的妻子克拉拉（艾比·考尼什 饰）和儿子大卫却再难从他身上感觉亲人的温暖。 感知到妻儿的痛苦，墨菲决心向策划杀害自己的犯罪头子展开反击……'
   }
   */
}
