const express = require('express')
const router = express.Router()
const Movie = require('../controllers/movie')

// 电影
router.get('/:id', Movie.detail) // 电影详情

module.exports = router
