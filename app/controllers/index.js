var Movie = require('../models/movie')
var Category = require('../models/category')

exports.index = function (req, res) {
  console.log('user in session: ', req.session.user)

  Category
    .find({})
    .populate({path: 'movies', options: {limit: 5}})
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      console.log(categories)
      res.render('index', {
        title: '电影首页',
        categories: categories
      })
    })
  // Movie.fetch(function (err, movies) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   res.render('index', {
  //     title: '电影首页',
  //     movies: movies
  //   })
  // })
}

exports.search = function (req, res) {
  var catId = req.query.cat
  var page = parseInt(req.query.p, 10)
  var count = 2
  var index = page * count

  console.log(page,  index)
  Category
    .find({_id: catId})
    .populate({
      path: 'movies',
      select: 'title poster'
    })
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      var category = categories[0] || {}
      var movies = category.movies || []
      var results = movies.slice(index, index + count)

      console.log(categories)
      res.render('results', {
        title: '电影结果列表页面',
        keyword: category.name,
        currentPage: page + 1,
        query: 'cat=' + catId,
        totalPage: Math.ceil(movies.length / count),
        movies: results
      })
    })
  // Movie.fetch(function (err, movies) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   res.render('index', {
  //     title: '电影首页',
  //     movies: movies
  //   })
  // })
}
