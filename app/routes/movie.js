var express = require('express')
var router = express.Router()
var Movie = require('../controllers/movie')

// 电影
router.get('/:id', Movie.detail) // 电影详情

module.exports = router
