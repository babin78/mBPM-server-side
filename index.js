//var http=require('http')
var methods=require('methods')
var express=require('express')
var bodyparser=require('body-parser')
var  session = require('express-session')
var logger=require('morgan')
var methodoverride=require('method-override')
var errorhandler = require('errorhandler')


process.env.NODE_ENV=process.env.NODE_ENV || 'development'

var mongoose = require('mongoose');
var config=require('./config')
var Promise=require('bluebird')
mongoose.Promise =Promise

/*
var ProcessInstance=require('./models/process-model')
var Workspace=require('./models/workspace-model')
var Workitem=require('./models/workitem-model')
var Queue=require('./models/queue-model')
var User=require('./models/user-model')
*/
/*
Promise.then(_=>{
   console.log('all data saved')
  return ProcessInstance.findOne({name:'outward'})
})
*/
mongoose.connect(config.dbURL, config.mongo.options).catch(err=>{
  console.log('some error occured during database connection')
  process.exit(1)
})


var app=express()
// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json())
app.use(session({ secret: 'validate', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

app.use(require('./routes'));

if (process.env.NODE_ENV != 'production') {
  app.use(errorhandler());
}

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (process.env.NODE_ENV != 'production') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
