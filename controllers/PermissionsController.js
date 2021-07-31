const { body,validationResult } = require('express-validator');
const User = require('./../models/user');

exports.admin_get = (req, res, next) => {
  authenticateUser(req.user, res);
  res.render('admin_form');
}

exports.admin_post = [body('adminpassword', 'Password is incorrect').trim().custom((value) => value === process.env['ADMIN_PWD']), (req, res, next) => {
  authenticateUser(req.user, res);
  const errors = validationResult(req);
  var currentUser = req.user;
  if(!errors.isEmpty()){
    res.render('admin_form', {errors: errors.array()});
    return;
  }
  else{
    var user = new User({
      username: currentUser.username,
      password: currentUser.password,
      displayname: currentUser.displayname,
      isAdmin: true,
      isMember: currentUser.isMember,
      created_at: currentUser.created_at,
      _id: currentUser._id
    });

    User.findByIdAndUpdate(currentUser._id, user, function(err, theUser){
      if(err){
        return next(err);
      }
      else{
        res.redirect('/');
      }
    })
  }
}]

exports.member_get = (req, res, next) => {
  authenticateUser(req.user, res);
  res.render('member_form');
}

exports.member_post = [body('memberpassword', 'Password is incorrect').trim().custom((value) => value === process.env['MEMBER_PWD']), (req, res, next) => {
  authenticateUser(req.user, res);
  const errors = validationResult(req);
  var currentUser = req.user;
  if(!errors.isEmpty()){
    res.render('member_form', {errors: errors.array()});
    return;
  }
  
  else{
    var user = new User({
      username: currentUser.username,
      password: currentUser.password,
      displayname: currentUser.displayname,
      isAdmin: currentUser.isAdmin,
      isMember: true,
      created_at: currentUser.created_at,
      _id: currentUser._id
    });

    User.findByIdAndUpdate(currentUser._id, user, function(err, theUser){
      if(err){
        return next(err);
      }
      else{
        res.redirect('/');
      }
    })
  }
}]

const authenticateUser = (user, res) => {
  if(!user){
    res.redirect('/login');
  }
}