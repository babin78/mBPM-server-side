var _=require('underscore')
var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

//var workitemHelper=require('./workitem-helper')
var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/rule-model')
var User=require('../../../models/user-model')
var WorkItem=require('../../../models/workitem-model')
var Pending=require('../../../models/pending-model')
var Transaction=require('../../../models/transaction-model')

//testing

var randomIntFromInterval=function (min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
exports.uploadtc=function(req,res){


  return Promise.all([ProcessInstance.findOne({_id:req.body.processid}), Queue.findOne({_id:req.body.queueid})])
   .then(data=>{
     if(!data[0] || !data[1])
     throw new Promise.Error('not found')

     workitem=new WorkItem()
     //workitem.data=randomIntFromInterval(1,100)
     workitem.data=req.body.data
     workitem.status='available'
     workitem.queue=req.body.queueid
     workitem.ProcessInstance=req.body.processid
     workitem.workspace=data[0].workspace._id
     workitem.instance=1



     data[1].workitems.push(workitem)
      pending=new Pending({prev:req.body.queueid  ,workitem:workitem,ProcessInstance:req.body.processid,type:'upload'})
     return Promise.all([workitem,data[1],pending]).map(p=>p.save())

   })
   .then(data=>{return res.status(200).send(data)})
   .catch(err=>{
     return res.status(500).send({err:err.message})
   })

}



exports.uploadWorkItem=function(req,res){

   //res.send({process:req.process,queue:req.queue})
   workitem=new WorkItem()
   workitem.data=req.body.data
   //workitem.status='available'
   //workitem.queue=req.queue._id
   workitem.ProcessInstance=req.process._id
   workitem.workspace=req.process.workspace
   workitem.instance=1

   //queue=req.queue
   //queue.workitems.push(workitem)
   //console.log(queue)
   //console.log(workitem)
   pending=new Pending({workitem:workitem,ProcessInstance:req.process._id,type:'upload'})
   return Promise.all([workitem,pending]).map(p=>p.save())
         /*.then(data=>{
           return WorkItem.findOne({_id:data[0]._id})
                 .populate('queue','queuename')
                 .populate('ProcessInstance','name')
                 .populate('workspace','name')
                 .exec()
         })*/
         .then(data=>{
           return res.status(200).send(data)
         })
         .catch(Promise.CancellationError,err=>{
           console.log('err'+err)
           return res.status(404).send({err:err.message})
         })
         .catch(err=>{return res.status(500).send({err:err.message})})




}




exports.deleteWorkItem=function(req,res){

      /*return Promise.all([WorkItem.remove({ProcessInstance:req.process._id}),
                          Queue.update({ProcessInstance:req.process._id},{workitems:[]},{ multi: true}),
                          Pending.remove({ProcessInstance:req.process._id}),
                          Transaction.remove({ProcessInstance:req.process._id})
                        ])
      */
      return Promise.all([WorkItem.remove({}),
                          Queue.update({},{workitems:[]},{ multi: true}),
                          Pending.remove({}),
                          Transaction.remove({})
                        ])

         .then(data=>{
           return res.status(200).send('done')
         })
         .catch(Promise.CancellationError,err=>{
           console.log('err'+err)
           return res.status(404).send({err:err.message})
         })
         .catch(err=>{return res.status(500).send({err:err.message})})




}

exports.getAllWorkItem=function(req,res){

      return WorkItem.find({}).exec().then(data=>{
           return res.status(200).send(data)
         })
         .catch(Promise.CancellationError,err=>{
           console.log('err'+err)
           return res.status(404).send({err:err.message})
         })
         .catch(err=>{return res.status(500).send({err:err.message})})




}


exports.getOneWorkItem=function(req,res){

      return WorkItem.find({_id:req.params.id})
            //.populate('queue')
            //.populate('ProcessInstance','name')
            //.populate('workspace','name')
            .exec().then(data=>{
           return res.status(200).send(data)
         })
         .catch(Promise.CancellationError,err=>{
           console.log('err'+err)
           return res.status(404).send({err:err.message})
         })
         .catch(err=>{return res.status(500).send({err:err.message})})




}
