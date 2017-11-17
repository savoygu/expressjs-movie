var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')

// 电影详情
exports.detail = function (req, res) {
  var id = req.params.id
  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err)
    }
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function (err, comments) {
        console.log(comments)
        if (err) {
          console.log(err)
        }
        res.render('detail', {
          title: '电影详情页——' + movie.title,
          movie: movie,
          comments: comments
        })
      })
  })
}

// 新增电影(回显数据)
exports.new = function (req, res) {
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
  });
}

// 更新电影(回显数据)
exports.update = function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: '电影后台更新页',
        movie: movie
      })
    })
  }
}

// 新增电影 / 更新电影
exports.save = function (req, res) {
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
}

// 电影列表
exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: '电影列表页',
      movies: movies
    })
  })
}

// 删除电影
exports.del = function (req, res) {
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
}