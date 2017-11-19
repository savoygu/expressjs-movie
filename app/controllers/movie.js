var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')

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
  Category.find({}, function (err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('admin', {
      title: '电影后台录入页',
      categories: categories,
      movie: {}
    })
  })
}

// 更新电影(回显数据)
exports.update = function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      Category.find({}, function (err, categories) {
        res.render('admin', {
          title: '电影后台更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}

// 新增电影 / 更新电影
exports.save = function (req, res) {
  var id = req.body.movie._id
  var movie = req.body.movie
  var _movie
  if (id) {
    Movie.findById(id, function (err, oldMovie) {
      if (err) {
        console.log(err)
      }
      _movie = _.extend(oldMovie, movie)
      var oldCategoryId = movie.oldCategory
      var categoryId = movie.category
      _movie.save(function (err, newMovie) {
        if (err) {
          console.log(err)
        }

        if (categoryId !== oldCategoryId) {
          Category.findByIdAndUpdate({_id: categoryId}, {$addToSet: {movies: newMovie._id}}, function (err, newCategory0) {
            Category.findByIdAndUpdate({_id: oldCategoryId}, {$pull: {movies: newMovie._id}}, function (err, newCategory1) {
              res.redirect('/movie/' + movie._id)
            })
          })
        } else {
          res.redirect('/movie/' + movie._id)
        }
      })
    })
  } else {
    _movie = new Movie(movie)

    var categoryId = _movie.category
    var categoryName = movie.categoryName

    _movie.save(function (err, newMovie) {
      if (err) {
        console.log(err)
      }

      if (categoryId) {
        Category.findById(categoryId, function (err, category) {
          category.movies.push(newMovie._id)

          category.save(function (err, newCategory) {
            if (err) {
              console.log(err)
            }

            res.redirect('/movie/' + newMovie._id)
          })
        })
      } else if (categoryName) {
        var category = new Category({
          name: categoryName,
          movies: [newMovie._id]
        })

        category.save(function (err, newCategory) {
          if (err) {
            console.log(err)
          }

          newMovie.category = newCategory._id
          newMovie.save(function (err, newMovie) {
            res.redirect('/movie/' + newMovie._id)
          })
        })
      }
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