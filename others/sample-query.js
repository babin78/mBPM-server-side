
var config=require('./config')

var mongoose=require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise
//console.log(config.dbURL)

var dbConnectPromise=mongoose.connect(config.dbURL, config.mongo.options).then(()=>{

  return Promise.resolve('database connection is sucessfull')


}).catch(err=>{
  console.log(err)
  return Promise.reject('some error occured during database connection')
  })


var Process=require('./models/process-model')
var Workspace=require('./models/workspace-model')
var Workitem=require('./models/workitem-model')
var Queue=require('./models/queue-model')



dbConnectPromise.then(()=>{
return Queue.find().deepPopulate('workitems prev next').exec()

}).then((data)=>{console.log(data)}).catch(err=>{})
