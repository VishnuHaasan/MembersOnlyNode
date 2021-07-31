var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');
var permissionsRouter = require('./routes/permissions');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var app = express();
var User = require('./models/user');
var helmet = require('helmet');
var compression = require('compression');
require('dotenv').config();
const mongoDb = process.env['MONGO_URL'];
mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(helmet());
app.use(compression());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', postsRouter);
app.use('/',permissionsRouter);
app.use('/user', usersRouter);
app.get('/login', (req, res, next) => {
  res.render('login');
})
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
