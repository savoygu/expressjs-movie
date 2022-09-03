const _ = require('underscore')
const Movie = require('../models/movie')
const Comment = require('../models/comment')
const Category = require('../models/category')
const fs = require('fs')
const path = require('path')

// 电影详情
exports.detail = function (req, res) {
  const id = req.params.id
  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err)
    }

    Movie.update({ _id: id }, { $inc: { pv: 1 } }, function (err) {
      if (err) {
        console.log(err)
      }
    })

    Comment
      .find({ movie: id })
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function (err, comments) {
        console.log(comments)
        if (err) {
          console.log(err)
        }
        res.render('movie/detail', {
          title: '电影详情页——' + movie.title,
          movie,
          comments
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
    res.render('admin/movie_add', {
      title: '电影后台录入页',
      categories,
      movie: {}
    })
  })
}

// 更新电影(回显数据)
exports.update = function (req, res) {
  const id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      Category.find({}, function (err, categories) {
        res.render('admin/movie_add', {
          title: '电影后台更新页',
          movie,
          categories
        })
      })
    })
  }
}

exports.savePoster = function (req, res, next) {
  const posterData = req.files.uploadPoster
  const filePath = posterData.path
  const originalFilename = posterData.originalFilename
  console.log(posterData)

  if (originalFilename) {
    fs.readFile(filePath, function (err, data) {
      const timestamp = Date.now()
      const type = posterData.type.split('/')[1]
      const poster = timestamp + '.' + type
      const newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

      fs.writeFile(newPath, data, function (err) {
        req.poster = poster
        next()
      })
    })
  } else {
    next()
  }
}

// 新增电影 / 更新电影
exports.save = function (req, res) {
  const id = req.body.movie._id
  const movie = req.body.movie
  let _movie

  if (req.poster) {
    movie.poster = req.poster
  }

  if (id) {
    Movie.findById(id, function (err, oldMovie) {
      if (err) {
        console.log(err)
      }
      _movie = _.extend(oldMovie, movie)
      const oldCategoryId = movie.oldCategory
      const categoryId = movie.category
      _movie.save(function (err, newMovie) {
        if (err) {
          console.log(err)
        }

        if (categoryId !== oldCategoryId) {
          Category.findByIdAndUpdate({ _id: categoryId }, { $addToSet: { movies: newMovie._id } }, function (err, newCategory0) {
            Category.findByIdAndUpdate({ _id: oldCategoryId }, { $pull: { movies: newMovie._id } }, function (err, newCategory1) {
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

    const categoryId = _movie.category
    const categoryName = movie.categoryName

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
        const category = new Category({
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

    res.render('admin/movie_list', {
      title: '电影列表页',
      movies
    })
  })
}

// 删除电影
exports.del = function (req, res) {
  const id = req.query.id

  if (id) {
    Movie.remove({ _id: id }, function (err, movie) {
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
