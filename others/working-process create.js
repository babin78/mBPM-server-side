var mongoose = require('mongoose');
var config=require('./config')
var Promise=require('bluebird')
mongoose.Promise =Promise
mongoose.connect(config.dbURL, config.mongo.options)

var ProcessInstance=require('./models/process-model')
var Workspace=require('./models/workspace-model')
var Workitem=require('./models/workitem-model')
var Queue=require('./models/queue-model')
var User=require('./models/user-model')

Promise.all([ProcessInstance,Workspace,Queue,Workitem,User]).map(p=>p.remove({}))
.catch(err=>console.log(err))
.finally(_=>{

//Promise.resolve(_=>{

  console.log('all collections are cleaned')
  var workspace=new Workspace({name:'dummy'})
  var processinst=new ProcessInstance({name:'outward',state:'enabled'})

  workspace.processes.push(processinst)
  processinst.workspace=workspace

  var queueStart=new Queue({name:'work introducetion',state:'start'})
  queueStart.ProcessInstance=processinst
  queueStart.prev=null
  queueStart.next=null

  var queueCustom1=new Queue({name:'data entry',state:'custom'})
  queueCustom1.ProcessInstance=processinst
  queueCustom1.prev=queueStart
  queueStart.next=queueCustom1

  var queueCustom2=new Queue({name:'checker',state:'custom'})
  queueCustom2.ProcessInstance=processinst
  queueCustom2.prev=queueCustom1
  queueCustom1.next=queueCustom2

  /*
  var queueDecision=new Queue({name:'IsAccepted',state:'decision'})
  queueDecision.ProcessInstance=processinst
  queueDecision.prev=queueCustom2
  queueCustom2.next=queueDecision

  var queueExit=new Queue({name:'IsAccepted',state:'end'})
  queueExit.ProcessInstance=processinst
  queueExit.prev=queueDecision
  queueDecision.next=queueExit
  processinst.queues=[queueStart,queueCustom1,queueCustom2,queueDecision,queueExit]
*/
  processinst.queues=[queueStart,queueCustom1,queueCustom2]
  //return Promise.all([queueExit,queueDecision,queueCustom2,queueCustom1,queueStart,processinst,workspace]).map(p=>p.save())
  return Promise.all([queueCustom2,queueCustom1,queueStart,processinst,workspace]).map(p=>p.save())

})
.then(_=>{
   console.log('all data saved')
  return ProcessInstance.findOne({name:'outward'})
})
.then(ps=>{
    console.log(ps)
   if(!ps)
    {    console.log('no process found')
         return Promise.resolve()
    }
    else{
       console.log('processinstance'+ps)
      return Queue.find({$and:[{type:'start'},{ProcessInstance:mongoose.Schema.Types.ObjectId(ps._id)}]})

    }

}).then(q=>{

  if(!q)
   {    console.log('no queues found')
        return Promise.resolve()
   }

  var nt=q
  while(nt)
  {
    console.log(nt.name)
    nt=nt.next
  }
}).catch(err=>console.log(err))














/*
Node.remove({})
//.then(Promise.all([user5,user4,user3,user2,user1].map(p=>p.save())))
.then(Promise.all([user1,user2,user3,user4,user5].map(p=>p.save())))
.then(_=>Node.findOne({name:'A'}))
.then(r=>{
  var nt=r
  while(nt)
  {
    console.log(nt.name)
    nt=nt.friend
  }

}) // foo
*/
