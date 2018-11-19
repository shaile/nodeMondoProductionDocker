var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
//Database connection
const connect = require('./db');



// let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let assignmentRouter = require('./routes/assignment');
let countriesRouter = require('./routes/Countries');
let uoloadRouter = require('./routes/upload');
let uploadfileRouter = require('./routes/gridsupload.js');

var app = express();
app.use(cors()); 
/** Seting up server to accept cross-origin browser requests */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img',express.static(path.join(__dirname, 'uploads')));

app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/assignments', assignmentRouter);
app.use('/countries', countriesRouter);
app.use('/upload', uoloadRouter);
app.use('/uploadfile', uploadfileRouter);

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
