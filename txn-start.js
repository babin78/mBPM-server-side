var processid= process.argv[2]
if(!processid)
{
  console.log('processidis not defined')
  process.exit(0)
}
var mongoose = require('mongoose')
const util = require('util')
var config=require('./config')
var Promise=require('bluebird')
var _=require('underscore')
mongoose.Promise =Promise
//custom AppError
//https://www.bennadel.com/blog/2828-creating-custom-error-objects-in-node-js-with-error-capturestacktrace.htm
var appError = require( "./AppError" ).createAppError;

mongoose.connect(config.dbURL, config.mongo.options).catch(err=>{
  console.log('some error occured during database connection')
  process.exit(1)
})
//var workitemHelper=require('./workitem-helper')
var ProcessInstance=require('./models/process-model')
var Workspace=require('./models/workspace-model')
var Queue=require('./models/queue-model')
var Rule=require('./models/rule-model')
var User=require('./models/user-model')
var WorkItem=require('./models/workitem-model')
var Pending=require('./models/pending-model')
var Transaction=require('./models/transaction-model')

function findTransactionOne(processid,typeval,stateval){
  return Promise.try(function(){
       return Transaction.findOne({ProcessInstance : mongoose.Types.ObjectId(processid), type : typeval,state:stateval})
  }).then(data=>{return data})
}

function updateTransactionOne(id,stateval){
  return Promise.try(function(){
       return Transaction.findOneAndUpdate({ _id :  mongoose.Types.ObjectId(id)},{ state : stateval,$currentDate: { lastModified: true }},null)
  }).then(data=>{return data})
}


function updateQueueSource(queueID,transactionID,workitemID){
  return Promise.try(function(){
       return Queue.findOneAndUpdate({ _id: mongoose.Types.ObjectId(queueID), pendingTransactions: { $ne: mongoose.Types.ObjectId(transactionID) } },
                                     { $pull: { workitems: mongoose.Types.ObjectId(workitemID) }, $push: { pendingTransactions:mongoose.Types.ObjectId(transactionID)} },null)
  }).then(data=>{return data})
}

function updateQueueDestination(queueID,transactionID,workitemID){
  return Promise.try(function(){
       return Queue.findOneAndUpdate({ _id: mongoose.Types.ObjectId(queueID), pendingTransactions: { $ne: mongoose.Types.ObjectId(transactionID) } },
                                     { $addToSet: { workitems: mongoose.Types.ObjectId(workitemID) }, $push: {pendingTransactions: mongoose.Types.ObjectId(transactionID)} },null)
  }).then(data=>{return data})
}

function updateQueueStatus(queueID,transactionID){
  return Promise.try(function(){
       return Queue.findOneAndUpdate({ _id: mongoose.Types.ObjectId(queueID), pendingTransactions: mongoose.Types.ObjectId(transactionID) },
                                     { $pull: { pendingTransactions: mongoose.Types.ObjectId(transactionID) } },null)
  }).then(data=>{return data})
}

console.time('count')
var txn,qS,qD,workitem
findTransactionOne(processid,'move','initial')
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.transaction.notFound",
           message: "no pending transaction found"//,
           })
     )

     txn=data
     qs=txn.source
     qd=txn.destination
     workitem=txn.item
   //update transaction initial to pendingID
   return updateTransactionOne(txn._id,'pending')
})
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.transaction.updateOneError",
           message: "Some error occured "//,
           })
     )
  //function updateQueueSource(queueID,transactionID,workitemID)
  return updateQueueSource(qs,txn._id,workitem)
})
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.queue.updateOnefailed",
           message: "Some error occured to update source queue "//,
           })
     )
   return updateQueueDestination(qd,txn._id,workitem)
})
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.queue.updateOnefailed",
           message: "Some error occured to update destination queue "//,
           })
     )
     //update transaction initial to applied
     return updateTransactionOne(txn._id,'applied')
})
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.transaction.updateOnefailed",
           message: "Some error occured to update transaction status to applied "//,
           })
     )
     //update source queue status
     return updateQueueStatus(qs,txn._id)
})
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.queue.updateOnefailed",
           message: "Some error occured to update queue source status "//,
           })
     )
     //update destination queue status
     return updateQueueStatus(qd,txn._id)
})
.then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.queue.updateOnefailed",
           message: "Some error occured to update queue destination status "//,
           })
     )
     //update destination queue status
     return updateTransactionOne(txn._id,'done')
}).then(data=>{
  if(!data)
  throw(
       appError({
           type: "app.transaction.updateOnefailed",
           message: "Some error occured to update transaction status as done "//,
           })
     )
    console.timeEnd('count')
    console.log('done')
}).catch(err=>{
  console.timeEnd('count')
  console.log(err)
})
