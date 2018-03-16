var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var expressValidator= require('express-validator');
var session=require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var auth = require('./routes/auth');
var book = require('./routes/book');
var user= require('./routes/user');


var app = express();
//custom helper for handlebars
//for reference: "https://stackoverflow.com/questions/32707322/how-to-make-a-handlebars-helper-global-in-expressjs/42224612#42224612"
var handlebar_helper  = require('./authentication/hbs_helper/helper.js')(hbs);
// view engine setup
app.engine('hbs',handlebar_helper.engine)
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// session using passport js
app.use(session({
  secret: "secret key",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/book', book);
app.use('/auth', auth);
app.use('/', user);

app.red

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
