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
mongoose.connect(config.dbURL, config.mongo.options).catch(err=>{
  console.log('some error occured during database connection')
  process.exit(1)
})

function getPendingHangedAll(){
  return Promise.try(function(){
    return Pending.aggregate([
                                  {$match:{
                                     $nor:[{status:null},{status:'done'}]
                                  }
                                  },
                                  {$project:
                                      {
                                          _id:1,
                                          //timediff:{$subtract:[new Date(),"$updatedAt"]},
                                          isHigh:{ $gte:[{$divide:[{$subtract:[new Date(),"$updatedAt"]},1000*60]},5]}

                                       }

                                  },
                                  {$match:{
                                         "isHigh":true
                                      }
                                  }
                            ])
  })
  .then(data=>{return data})
}

function updatePendingMany(idArr){
  return Promise.try(function(){
     return Pending.update({_id:{$in:idArr}},{status:null},null)

  })
  .then(data=>{return data})
}
var idArr
getPendingHangedAll()
.then(data=>{

  if(data.length==0)
   throw(
        appError({
            type: "app.pendingItem.notFound",
            message: "no pending item found."//,
          })
      )

  idArr=_.map(data,v=>{return v._id})
  return updatePendingMany(idArr)

})
.then(data=>{


  console.timeEnd("count")
  console.log('data updated:%d',data)

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
