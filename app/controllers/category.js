var Category = require('../models/category')

// 新增电影分类(回显数据)
exports.new = function (req, res) {
  res.render('category_admin', {
    title: '电影后台分类录入页',
    category: {
      name: ''
    }
  });
}
// 新增电影分类 / 更新电影分类
exports.save = function (req, res) {
  var _category = req.body.category
  var category = new Category(_category)

  category.save(function (err, newCategory) {
    if (err) {
      console.log(err)
    }

    res.redirect('/admin/category/list')
  })
}

// 电影分类列表
exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err)
    }

    res.render('category_list', {
      title: '电影分类列表页',
      categories: categories
    })
  })
}