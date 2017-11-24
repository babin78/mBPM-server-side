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

var Pending=require('./models/pending-model')
var Transaction=require('./models/transaction-model')
  //process.argv[2]



mongoose.connect(config.dbURL, config.mongo.options).catch(err=>{
  console.log('some error occured during database connection')
  process.exit(1)
})

/*
function connectDatabase(){
  return Promise.try(_>{
    return mongoose.connect(config.dbURL, config.mongo.options)

  }).then(_=>{return true})
}

*/
function getPendingOne(typeval,processid){

  return Promise.try(function(){

    return Pending.aggregate([
      {$match:{status:null,type:typeval,ProcessInstance:mongoose.Types.ObjectId(processid)}},
      {$limit:1},
      {$lookup:
          {
            from: "queues",
            localField: "prev",
            foreignField: "_id",
            as: "queue_docs"
           }
        },
        {$project:
            {
                _id:1,
                workitem:"$workitem",
                source:"$prev",
                ProcessInstance:"$ProcessInstance",
                queue_id:"$queue_docs._id",
                queuename:"$queue_docs.queuename",
                queue_state:"$queue_docs.state",
                rule_ids:"$queue_docs.ruleids"


            }
        }
        ,{$unwind:"$queue_id"}
        ,{$unwind:"$queuename"}
        ,{$unwind:"$queue_state"}
        ,{$unwind:"$rule_ids"}
        ,{$project:{
                _id:1,
                workitem:"$workitem",
                source:"$source",
                ProcessInstance:"$ProcessInstance",
                queue_id:"$queue_id",
                queuename:"$queuename",
                queue_state:"$queue_state",
                rule_ids:"$rule_ids"


            }}
           ,{$unwind:"$rule_ids"},
             {$lookup:
                  {
                    from: "rules",
                    localField: "rule_ids",
                    foreignField: "_id",
                    as: "rule_docs"
                   }
               },
               {$project:{
                        workitem:"$workitem",
                        source:"$source",
                        ProcessInstance:"$ProcessInstance",
                        queue_id:"$queue_id",
                        queuename:"$queuename",
                        queue_state:"$queue_state",
                        rule_ids:"$rule_ids" ,
                        rulename : "$rule_docs.rulename",
                        toqueue:"$rule_docs.toqueue",
                        priority: "$rule_docs.priority"

                }
            }
            ,{$unwind:"$toqueue"}
            ,{$unwind:"$rulename"}
            ,{$unwind:"$priority"}

    ])
  })
  .then(data=>{ return data[0]  })
}

function updatePendingOne(id,status,lockedby,errordesc){
   return Promise.try(function(){
     return Pending.findOneAndUpdate({_id:id},{status:status,lockedby:lockedby,errordesc:errordesc},null)
   }).then(data=>{return data})
}

function findTransactionOne(pendingID){
  return Promise.try(function(){
    return Transaction.findOne({pending:pendingID})
  }).then(data=>{return data})
}

function insertTransactionOne(sourceQueueID,destinationQueueID,workitemID,type,pendingID,ProcessInstanceID){
  return Promise.try(function(){

    txn=new Transaction({        source:sourceQueueID,
                                 destination:destinationQueueID,
                                 item:workitemID,
                                 type:type,
                                 state:"initial",
                                 pending:pendingID,
                                 ProcessInstance: ProcessInstanceID,
                                 lastModified:new Date()
                    })

    return txn.save()
  }).then(data=>{return data})
}

var txn,pnd
console.time("count")

//connectDatabase()
getPendingOne('upload',processid)
.then(data=>{
  //console.log(data)
  if(!data)
   //throw new Promise.CancellationError('no pending item found')
   throw(
        appError({
            type: "app.pendingItem.notFound",
            message: "no pending item found."//,
            //detail: util.format( "The argument [%s] is required but was not passed-in.", "foo" ),
            //extendedInfo: "No! No weezing the joo-ooce!"
          })
      )
   pnd=data
   //updatePendingOne(id,status,lockedby,errordesc)
   return updatePendingOne(pnd._id,'processing','ps',null )

})
.then(data=>{
  if(!data)
   //throw new Promise.CancellationError('update pending item failed')
   throw(
        appError({

            type: "app.pendingItem.updateFail",
            message: "update pending item failed."//,
            //detail: util.format( "The argument [%s] is required but was not passed-in.", "foo" ),
            //extendedInfo: "No! No weezing the joo-ooce!"

          })
    )

   pnd=data

   return findTransactionOne(pnd._id)
})
.then(data=>{
  if(data)
  //throw new Promise.CancellationError('transaction already found')
  throw(
       appError({

           type: "app.transactionItem.alreadyFound",
           message: "transaction already found."//,
           //detail: util.format( "The argument [%s] is required but was not passed-in.", "foo" ),
           //extendedInfo: "No! No weezing the joo-ooce!"

         })
   )



  //insertTransactionOne(sourceQueueID,destinationQueueID,workitemID,type,pendingID,ProcessInstanceID)
  return  insertTransactionOne(pnd.source,pnd.toqueue,pnd.workitem,'move',pnd._id,pnd.ProcessInstance)
})
.then(data=>{
  if(!data)
  //throw new Promise.CancellationError('transaction insert failed')
  throw(
       appError({

           type: "app.transactionItem.insertFail",
           message: "transaction insert failed."//,
           //detail: util.format( "The argument [%s] is required but was not passed-in.", "foo" ),
           //extendedInfo: "No! No weezing the joo-ooce!"

         })
   )


  txn=data

  //updatePendingOne(id,status,lockedby,errordesc)
  return updatePendingOne(pnd._id,'done',null,null )

})
.then(data=>{
  if(!data)
  //throw new Promise.CancellationError('pendingitem status reupdate failed')
  throw(
       appError({

           type: "app.pendingItem.updateFail2",
           message: "pendingitem status reupdate failed."//,
           //detail: util.format( "The argument [%s] is required but was not passed-in.", "foo" ),
           //extendedInfo: "No! No weezing the joo-ooce!"

         })
   )


  console.timeEnd("count")
  console.log('transaction created sucessfully.')
  console.log(util.inspect(txn, false, null))
  process.exit(0)
})
.catch(Promise.CancellationError,err=>{
  console.timeEnd("count")
  console.log(err)
})
.catch(appError,err=>{
  switch ( err.type ) {
        case "app.pendingItem.notFound":
        case "app.pendingItem.updateFail":
              console.timeEnd("count")
              console.log(err.message)
              process.exit(0)
              break
        case "app.transactionItem.alreadyFound":
              //return updatePendingOne(pnd._id,'processing','ps',null )
              console.timeEnd("count")
              console.log(err.message)
              return updatePendingOne(pnd._id,'done',null,null )
              break
        case "app.transactionItem.insertFail":
        case "app.pendingItem.updateFail2":
              console.log(err.message)
              updatePendingOne(pnd._id,'error',null,err.message ).then(_=>{console.timeEnd("count")}).catch(err=>{
                console.timeEnd("count")
                throw new Error(err.message)})
              break


        default:

            //console.log(err.message)
            throw( err );

        break;
    }
})

.catch(err=>{console.timeEnd("count")
console.log(err)})
