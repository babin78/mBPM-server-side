var mongoose = require('mongoose')
const util = require('util')
var config=require('./config')
var Promise=require('bluebird')
var _=require('underscore')
mongoose.Promise =Promise

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
var processid='5a159e3400ffd916dc78c4fd'  //process.argv[2]

var source,destination,item,type,ProcessInstance,lastmodified,stype,TXN

Return Transaction.findOne({})
.then(data=>{
 //Dive.update({ _id: diveId }, { "$pull": { "divers": { "user": userIdToRemove } }}, { safe: true, multi:true }
  TXN=data
  var T1=Queue.update(
       { _id: TXN.source, pendingTransactions: { $ne: TXN._id } },
       { $pull:{workitems:TXN.item} , $push: { pendingTransactions: TXN._id } }
    )

  var T2=Queue.update(
       { _id: TXN.destination, pendingTransactions: { $ne: TXN._id } },
       { $push:{workitems:TXN.item}, $push: { pendingTransactions: TXN._id } }
    )

   return Promise.all([T1,T2])
})
.then(data=>{

   console.log(util.inspect(data, false, null))
})
.catch(Promise.CancellationError,err=>{
  console.log(err)

})
.catch(err=>{console.log(err)})
