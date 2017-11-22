//var http=require('http')
var methods=require('methods')
var express=require('express')
var bodyparser=require('body-parser')
var  session = require('express-session')
var logger=require('morgan')
var methodoverride=require('method-override')
var errorhandler = require('errorhandler')
var cookieParser = require('cookie-parser')
var helmet = require('helmet')
var compression = require('compression')
var http=require('http')
process.env.NODE_ENV=process.env.NODE_ENV || 'development'

var mongoose = require('mongoose');
var config=require('./config')
var Promise=require('bluebird')
mongoose.Promise =Promise
debugger;
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
app.use(helmet())
app.use(compression({filter: shouldCompress}))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
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
app.use(cookieParser())
app.use(bodyparser.json())
//const MongoStore = require('connect-mongo')(session);
const MongoStore=require('connect-mongodb-session')(session)
//app.use(session({ secret: 'validate', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

var dbStore=new MongoStore({
  uri: config.dbURL,
  collection: 'sessions'
 })

 // Catch errors
    dbStore.on('error', function(error) {
      console.log('some error occured for session storage:'+error.message)
    })

app.use(session({
  secret: config.secret,
  cookie: { maxAge: 10000 * 60*config.sessionExpire },
  saveUninitialized: false,
  resave:false,
  store:dbStore

}))

require('./routes/auth/passport').setup(app)
/*
var server = http.createServer(app);
var socketioServer = require('socket.io')();

socketioServer.listen(config.socketPort || 3001)
socketioServer.on('connection', function(client){
  console.log('socket.io is running..')
  socketioServer.on('daemon-event',data=>{console.log('data received:'+data)})

});

*/
var io = require( 'socket.io' )().listen( 3001 )//.set( "log level", 0 );
io.sockets.on( "connection", function ( socket ) {
    console.log( 'Server: Incoming connection.' );
    socket.on( "echo", function ( msg, callback ) {
        console.log(msg)
    } );
} );

//exports.server=socketioServer
//require('./config/socketio').default(socketio);


//var eventbus = require('./eventBus')
//eventbus.on('event',data=>{console.log(data)})

var daemonCtlr=require('./daemon/ctrl')

daemonCtlr.on('starting',_=>{console.log('starting daemon')})
daemonCtlr.on('started',_=>{console.log('started daemon')})
daemonCtlr.on('running',_=>{console.log('running daemon')})
daemonCtlr.on('stopping',_=>{console.log('stopping daemon')})
daemonCtlr.on('stopped',_=>{console.log('stopped daemon')})
daemonCtlr.on('notrunning',_=>{console.log('not running daemon')})
daemonCtlr.on('error',err=>{console.log('some error occured in daemon:'+err.message)})


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
var server = app.listen( process.env.PORT || config.appPort || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});


process.on('uncaughtException',err=>{
  console.log(err.message)
  process.exit(0)
})



// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    console.log("Closed out remaining connections.");
    process.exit()
  });

   // if after
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit()
  }, 10*1000);
}
// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);
