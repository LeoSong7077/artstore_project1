require('./public/javascripts/connectDB');

//express를 위한 필수 모듈들
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require("passport");
//var flash = require("connect-flash");

var MongoStore = require("connect-mongo");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//express객체 생성
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').__express); //경로 설정 해줘서 ejs module 없다는 에러 해결
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//세션
app.use(session({
    secret:"TKRvOIJs=HyqrvagQ#&!f!%V]Ww/4KiVs$s,<<MX", //임의의 문자
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/artstore'}),
    //cookie:{maxAge:(3.6e+6)*24}
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', usersRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
