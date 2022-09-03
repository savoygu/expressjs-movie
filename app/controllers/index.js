const Movie = require('../models/movie')
const Category = require('../models/category')

exports.index = function (req, res) {
  console.log('user in session: ', req.session.user)

  Category
    .find({})
    .populate({ path: 'movies', options: { limit: 20 } })
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      console.log(categories)
      res.render('index', {
        title: '电影首页',
        categories
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
  const catId = req.query.cat
  const q = req.query.q
  const page = parseInt(req.query.p, 10) || 0
  const count = 2
  const index = page * count

  if (catId) {
    Category
      .find({ _id: catId })
      .populate({
        path: 'movies',
        select: 'title poster'
      })
      .exec(function (err, categories) {
        if (err) {
          console.log(err)
        }
        const category = categories[0] || {}
        const movies = category.movies || []
        const results = movies.slice(index, index + count)

        console.log(categories)
        res.render('movie/results', {
          title: '电影结果列表页面',
          keyword: category.name,
          currentPage: page + 1,
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  } else {
    Movie
      .find({ title: new RegExp(q + '.*', 'i') })
      .exec(function (err, movies) {
        if (err) {
          console.log(err)
        }
        const results = movies.slice(index, index + count)

        res.render('movie/results', {
          title: '电影结果列表页面',
          keyword: q,
          currentPage: page + 1,
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}
