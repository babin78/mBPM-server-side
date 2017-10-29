var mongoose = require('mongoose');
var config=require('./config')
var Promise=require('bluebird')
mongoose.Promise =Promise


var ProcessInstance=require('./models/process-model')
var Workspace=require('./models/workspace-model')
var Workitem=require('./models/workitem-model')
var Queue=require('./models/queue-model')
var User=require('./models/user-model')
/*
Promise.then(_=>{
   console.log('all data saved')
  return ProcessInstance.findOne({name:'outward'})
})
*/
mongoose.connect(config.dbURL, config.mongo.options)
.then(_=>{

    return Workspace.findOne({name:'dummy'})
   //return ProcessInstance.findOne({name:'outward'})
   //return Queue.findOne({prev:null})
})
.then(data=>{
  if(!data)
  {
    console.log('data  not found')
    return
  }
console.log(data.processes)})
.catch(err=>{console.log(err)})
