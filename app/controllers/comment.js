var _ = require('underscore')
var Comment = require('../models/comment')

// 新增电影 / 更新电影
exports.save = function (req, res) {
  var _comment = req.body.comment
  var movieId = _comment.movie

  if (_comment.cid) {
    Comment.findById(_comment.cid, function (err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }

      comment.reply.push(reply)

      comment.save(function (err, newComment) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movieId)
      })
    })
  } else {
    comment = new Comment(_comment)

    comment.save(function (err, newComment) {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + movieId)
    })
  }
}
