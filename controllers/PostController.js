var async = require('async');
const {body,validationResult} = require('express-validator');
const { render } = require('pug');
var User = require('./../models/user');
var Post = require('./../models/post');

exports.list = (req, res, next) => {
  Post.find({})
    .populate('user', 'displayname')
    .sort({created_at: -1})
    .exec(function(err, posts){
      if(err){
        return next(err);
      }
      else{
        res.render('post', {posts: posts});
      }
    })
}

exports.create_get = (req, res, next) => {
  authenticateUser(req.user, res);
  res.render('post_form');
  return;
}

exports.create_post = [body('description', 'Description is required').trim().isLength({min: 1}).escape(),body('title', 'Title is required').trim().isLength({min: 1}).escape(), (req, res, next) => {
  const errors = validationResult(req);
  authenticateUser(req.user, res);
  if(!errors.isEmpty()){
    res.render('post_form', {errors: errors.array(), post: req.body});
    return;
  }
  else{
    var post = new Post({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
      created_at: Date.now()
    });

    post.save(function(err, post){
      if(err){
        return next(err);
      }
      else{
        res.redirect('/');
      }
    });
  }
}]

exports.delete_get = (req, res, next) => {
  authenticateUser(req.user, res);
  if(!req.user.isAdmin){
    res.redirect('/');
  }
  else{
    Post.findById(req.params.id)
    .populate('user')
    .exec(function(err, thepost){
      if(err){
        return next(err);
      }
      if(thepost==null){
        res.redirect('/');
      }
      else{
        res.render('post_delete', {post: thepost});
        return;
      }
    })
  }
}

exports.delete_post = (req, res, next) => {
  authenticateUser(req.user, res);
  if(!req.user.isAdmin){
    res.redirect('/');
  }
  else{
    Post.findByIdAndRemove(req.params.id, function(err){
      if(err){
        return next(err);
      }
      res.redirect('/');
    })
  }
}

const authenticateUser = (user, res) => {
  if(!user){
    res.redirect('/login');
  }
}

