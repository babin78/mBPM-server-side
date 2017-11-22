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
  //process.argv[2]

var source,destination,item,type,ProcessInstance,lastmodified,stype,TXN,PND

return Pending.findOne({ProcessInstance:processid, status:null},null,{$sort:{ created_at: 1 }})//.sort({ created_at: 1 }).limit(1)
.then(data=>{
      if(!data)
      throw new Promise.CancellationError('no pending found')
      //find prev queue and populate ruleids
      //upload case
      //console.log(data)
      PND=data
      item=data.workitem
      switch(data.type)
      {
        case 'upload':
              source=data.prev
              return Queue.findOne({_id:data.prev}).populate('ruleids').exec()
              break
      }
})
.then(data=>{
  if(data.length==0)
  throw new Promise.CancellationError('no data found')

    var txns=[]
    _.each(data.ruleids,v=>{

              //set or expire don't have to field
              switch(v.type)
              {
                case 'auto':
                case 'decision':
                case 'split':
                case 'join':
                      destination=v.toqueue
                      type='move'
                      txns.push(new Transaction({source:source,
                                                 destination:destination,
                                                 item:item,
                                                 type:type,
                                                 state:'initial',
                                                 ProcessInstance: processid,
                                                 lastModified:new Date()}))

                      //return Queue.findOne({_id:data.prev}).populate('ruleids').exec()
                      break
                //? set and expire
              }

    })

    return Promise.all(txns).map(p=>p.save())
   //return Rule.find({_id:data.prev}).populate('ruleids').exec()
  //console.log(util.inspect(data, false, null))
})
.then(data=>{
  if(data.length==0)
  throw new Promise.CancellationError('no data found')

  TXN=data
  return Pending.update({_id:PND._id},{status:'done'})
  //console.log(util.inspect(TXN, false, null))
})
.then(data=>{
  if(!data)
  throw new Promise.CancellationError('no data found')

  console.log(util.inspect(TXN, false, null))
})
.catch(Promise.CancellationError,err=>{
  console.log(err)

})
.catch(err=>{console.log(err)})
