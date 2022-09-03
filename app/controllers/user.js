const User = require('../models/user')

// 用户注册
exports.showSignup = function (req, res) {
  res.render('user/signup', {
    title: '注册页面'
  })
}

exports.showSignin = function (req, res) {
  res.render('user/signin', {
    title: '登录页面'
  })
}

// 用户注册
exports.signup = function (req, res) {
  const _user = req.body.user

  User.findOne({ name: _user.name }, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (user) {
      return res.redirect('/signin')
    } else {
      user = new User(_user)

      user.save(function (err, newUser) {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    }
  })
}

// 用户登录
exports.signin = function (req, res) {
  const _user = req.body.user
  const name = _user.name
  const password = _user.password
  console.log(_user)
  User.findOne({ name }, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/signup')
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        req.session.user = user

        return res.redirect('/')
      } else {
        return res.redirect('/signin')
      }
    })
  })
}

exports.logout = function (req, res) {
  delete req.session.user
  // delete app.locals.user

  res.redirect('/')
}

// 用户列表
exports.list = function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err)
    }

    res.render('admin/user_list', {
      title: '用户列表页',
      users
    })
  })
}
