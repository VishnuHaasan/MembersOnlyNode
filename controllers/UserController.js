var async = require('async');
const {body,validationResult} = require('express-validator');
const { render } = require('pug');
var User = require('./../models/user');
var Post = require('./../models/post');
var bcrypt = require('bcryptjs');

exports.create_get = (req, res, next) => {
  res.render('user_form');
}

exports.create_post = [body('username', 'Username is required').trim().isLength({min:1}).escape(), body('password', 'Password is required').trim().isLength({min:1}).escape(), body('displayname', 'Display name is required').trim().isLength({min:1}).escape(), body('confirmpassword', 'Confirm Password must be the same as Password').custom((value, {req}) => value === req.body.password), (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.render('user_form', {user: req.body, errors: errors.array()});
  }

  else{
    bcrypt.hash(req.body.password, 10, (err, hashedpwd) => {
      if(err){
        return next(err);
      }
      var user = new User({
        username: req.body.username,
        password: hashedpwd,
        displayname: req.body.displayname,
        created_at: Date.now(),
        isAdmin: false,
        isMember: false
      });
      user.save(function(err){
        if(err){
          return next(err);
        }
        res.redirect('/login');
      });
    });
  }
}]

exports.detail = (req, res, next) => {
  User.findById(req.params.id)
    .exec(function(err, user){
      if(err){
        return next(err);
      }
      else{
        res.render('user_detail', {user: user});
        return;
      }
    })
}