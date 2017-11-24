var _ = require('underscore')
var Category = require('../models/category')

// 新增电影分类(回显数据)
exports.new = function (req, res) {
  res.render('admin/category_add', {
    title: '电影后台分类录入页',
    category: {
      name: ''
    }
  });
}

// 更新电影分类(回显数据)
exports.update = function (req, res) {
  var id = req.params.id
  if (id) {
    Category.findById(id, function (err, category) {
      res.render('admin/category_add', {
        title: '电影后台分类更新页',
        category: category
      })
    })
  }
}

// 新增电影分类 / 更新电影分类
exports.save = function (req, res) {
  var id = req.body.category._id
  var category = req.body.category

  if (id) {
    Category.findById(id, function (err, oldCategory) {
      _category = _.extend(oldCategory, category)
      _category.save(function (err, newCategory) {
        if (err) {
          console.log(err)
        }

        res.redirect('/admin/category/list')
      })
    })
  } else {
    var _category = new Category(category)
    _category.save(function (err, newCategory) {
      if (err) {
        console.log(err)
      }

      res.redirect('/admin/category/list')
    })
  }
}

// 电影分类列表
exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err)
    }

    res.render('admin/category_list', {
      title: '电影分类列表页',
      categories: categories
    })
  })
}


// 删除分类
exports.del = function (req, res) {
  var id = req.query.id

  if (id) {
    Category.remove({_id: id}, function (err, category) {
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
