var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var cookieParser = require('cookie-parser')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var port = process.env.PROT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/imooc'

// 视图
app.set('views', './views/pages')
// 视图模板引擎
app.set('view engine', 'pug')

// 静态资源解析
app.use(serveStatic(path.join(__dirname, 'public')))
// 表单数据解析
app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// app.use(bodyParser.text({ type: 'text/html' }))
app.use(cookieParser())
app.use(session({
  secret: 'movie',
  saveUninitialized: false,
  resave: false,
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

// 挂载 时间模块 moment 到本地变量 locals
app.locals.moment = require('moment')

// 实时加载
if (process.env.NODE_ENV === 'development') {
  var liveReloadPort = process.env.LR_PORT || 35279
  var excludeList = ['.woff', '.flv']

  app.use(require('connect-livereload')({
    port: liveReloadPort,
    excludeList: excludeList
  }))
}

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen)

// 监听 3000 端口
function listen () {
  app.listen(port, function () {
    console.log('Listening on: ' + port)
  })
}

// 连接 Mongodb 数据库
function connect () {
  mongoose.Promise = global.Promise
  return mongoose.connect(dbUrl, {useMongoClient: true})
}

app.use(function (req, res, next) {
  var _user = req.session.user
  if (_user) {
    app.locals.user = _user
  }
  return next()
})

// 电影首页
app.get('/', function (req, res) {
  console.log('user in session: ', req.session.user)

  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }
    res.render('index', {
      title: '电影首页',
      movies: movies
    })
  })
})

// 用户注册
app.post('/user/signup', function (req, res) {
  var _user = req.body.user

  User.find({name: _user.name}, function (err, user) {
    if (err) {
      console.log(err)
    }
    if (user) {
      return res.redirect('/')
    } else {
      var user = new User(_user)

      user.save(function (err, newUser) {
        if (err) {
          console.log(err)
        }

        res.redirect('/admin/userlist')
      })
    }
  })
})

// 用户登录
app.post('/user/signin', function (req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name: name}, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/')
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        console.log('Password is matched')
        req.session.user = user
        return res.redirect('/')
      } else {
        console.log('Password is not matched')
      }
    })
  })
})

app.get('/logout', function (req, res) {
  delete req.session.user
  delete app.locals.user

  res.redirect('/')
})

// 用户列表
app.get('/admin/userlist', function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: '用户列表页',
      users: users
    })
  })
})

// 电影详情
app.get('/movie/:id', function (req, res) {
  var id = req.params.id
  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err)
    }
    res.render('detail', {
      title: '电影详情页——' + movie.title,
      movie: movie
    })
  })
})

// 新增电影(回显数据)
app.get('/admin/movie', function (req, res) {
  res.render('admin', {
    title: '电影后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

// 更新电影(回显数据)
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: '电影后台更新页',
        movie: movie
      })
    })
  }
})

// 新增电影 / 更新电影
app.post('/admin/movie/new', function (req, res) {
  console.log(req.body, req.params, req.query)
  var id = req.body.movie._id
  var movie = req.body.movie
  var _movie
  console.log('/admin/movie/new : ' + id)
  if (id) {
    Movie.findById(id, function (err, oldMovie) {
      if (err) {
        console.log(err)
      }
      _movie = _.extend(oldMovie, movie)
      _movie.save(function (err, newMovie) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      doctor: movie.doctor,
      title: movie.title,
      country: movie.country,
      language: movie.language,
      year: movie.year,
      poster: movie.poster,
      summary: movie.summary,
      flash: movie.flash
    })
    _movie.save(function (err, newMovie) {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + newMovie._id)
    })
  }
})

// 电影列表
app.get('/admin/list', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: '电影列表页',
      movies: movies
    })
  })
})

// 删除电影
app.delete('/admin/list', function (req, res) {
  var id = req.query.id

  if (id) {
    Movie.remove({_id: id}, function (err, movie) {
      if (err) {
        console.log(err)
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
})

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
 summary: '2028年，专事军火开发的机器人公司Omni Corp.生产了大量装备精良的机械战警，他们被投入到惩治犯罪等行动中，取得显著的效果。罪犯横行的底特律市，嫉恶如仇、正义感十足的警察亚历克斯·墨菲（乔尔·金纳曼 饰）遭到仇家暗算，身体受到毁灭性破坏。借助于Omni公司天才博士丹尼特·诺顿（加里·奥德曼 饰）最前沿的技术，墨菲以机械战警的形态复活。数轮严格的测试表明，墨菲足以承担起维护社会治安的重任，他的口碑在民众中直线飙升，而墨菲的妻子克拉拉（艾比·考尼什 饰）和儿子大卫却再难从他身上感觉亲人的温暖。 　　感知到妻儿的痛苦，墨菲决心向策划杀害自己的犯罪头子展开反击……'
 }
 */
