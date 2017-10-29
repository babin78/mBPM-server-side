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

var process,queue,workitem

dbConnectPromise.then(()=>{
  workitem=new Workitem();
  workitem.chequeno='000123'
  workitem.status='available'

  return Promise.all([Process.findOne({name:'outward'}),Queue.findOne({name:'work introduction'}),workitem.save()])

}).then((data)=>{
  process=data[0]
  queue=data[1]
  workitem=data[2]
  workitem.queue=queue._id
  workitem.process=process._id
  return workitem.save()
}).then((data)=>{
  console.log(data)
  queue.workitems.push(data)
  queue.save()
}).catch(err=>{console.log(err)})
