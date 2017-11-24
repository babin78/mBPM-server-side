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

var TXN

return Transaction.findOne({ ProcessInstance : processid, state : 'initial'})
.then(data=>{

  if(!data)
  throw new Promise.CancellationError('no pending found')

      TXN=data
      /*if(TXN.type=='move')
      {      var T1=Queue.update(
                 { _id: TXN.source, pendingTransactions: { $ne: TXN._id } },
                 { $pull:{workitems:TXN.item} , $push: { pendingTransactions: TXN._id } }
              )

            var T2=Queue.update(
                 { _id: TXN.destination, pendingTransactions: { $ne: TXN._id } },
                 { $push:{workitems:TXN.item}, $push: { pendingTransactions: TXN._id } }
              )

             return Promise.all([T2,T1])
      }
      */
      if(TXN.type=='move')
      {      return Queue.update(
                 { _id: TXN.source._id, pendingTransactions: { $ne: TXN._id } },
                 { $pull:{workitems:TXN.item._id} , $push: { pendingTransactions: TXN._id } }
              )
      }


})
.then(data=>{
  if(!data)
  throw new Promise.CancellationError('no pending found')

      console.log('ist update output:'+util.inspect(data, false, null))
      if(TXN.type=='move')
      {      return Queue.update(
                 { _id: TXN.destination._id, pendingTransactions: { $ne: TXN._id } },
                 { $push:{workitems:TXN.item._id} , $push: { pendingTransactions: TXN._id } }
              )
      }

   //console.log(util.inspect(data, false, null))
})
.then(data=>{
  if(!data)
  throw new Promise.CancellationError('no pending found')

      console.log('2nd update output:'+util.inspect(data, false, null))

   //console.log(util.inspect(data, false, null))
})
.catch(Promise.CancellationError,err=>{
  console.log(err)

})
.catch(err=>{console.log(err)})
