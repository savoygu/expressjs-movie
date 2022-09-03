const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const port = process.env.PROT || 3000
const app = express()
const dbUrl = 'mongodb://localhost/imooc'

// 视图
app.set('views', './app/views/pages')
// 视图模板引擎
app.set('view engine', 'pug')

// 静态资源解析
app.use(serveStatic(path.join(__dirname, 'public')))
// 表单数据解析
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// app.use(bodyParser.text({ type: 'text/html' }))
app.use(cookieParser())
app.use(session({
  secret: 'movie',
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: 'sessions'
  })
}))

// 挂载 时间模块 moment 到本地变量 locals
app.locals.moment = require('moment')

// 实时加载
if (process.env.NODE_ENV === 'development') {
  // 开发配置
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true // 格式化代码
  mongoose.set('debug', true)

  const liveReloadPort = process.env.LR_PORT || 35279
  const excludeList = ['.woff', '.flv']

  app.use(require('connect-livereload')({
    port: liveReloadPort,
    excludeList
  }))
}

require('./config/routes')(app)

connect()

// 监听 3000 端口
function listen () {
  app.listen(port, function () {
    console.log('Listening on: ' + port)
  })
}

// 连接 Mongodb 数据库
function connect () {
  mongoose.connection.on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen)

  mongoose.connect(dbUrl)
    .catch(console.error.bind(console, 'connect error:'))
  // mongoose.Promise = global.Promise
  // return mongoose.connect(dbUrl, {useMongoClient: true})
}
