var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const expressSession=require("express-session")
const passport=require("passport")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret:"hi hii"
}))
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());
app.use(logger('dev'));
app.use(cors(
  {
  origin:["https://deploy-mern-1whq.vercel.app"],
  method:["POST","GET"],
  credentials:true
  }
            ));
mongoose.connect('mongodb+srv://aayushjain1290:QD0qtupk9BIc4sL4@cluster0.ojgke0k.mongodb.net/pin?retryWrites=true&w=majority&appName=Cluster0');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  
});

app.use(function(req, res, next) {
  next(createError(404));
});
module.exports = app;
