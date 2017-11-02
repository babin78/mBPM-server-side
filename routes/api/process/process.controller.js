var mongoose = require('mongoose')
var Promise=require('bluebird')
//var validateprocess=require('./process-validate')
mongoose.Promise =Promise

var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/queue-model')

var processCtrl={


  getview:function(req,res){
    return Workspace.findOne({name:req.params.workspacename}).exec()
    .then(data=>{
      if(!data)
      throw new Promise.CancellationError('workspace not found');
      else{
      return ProcessInstance.findOne({workspace:data._id,name:req.params.processname}).populate('workspace').exec()
    }
    })
    .then(data=>{
      if(!data)
      res.status(404).send({})
      else {
        console.log('data found')
        res.status(200).send(data)
      }
    })
    .catch(Promise.CancellationError,err=>{
      console.log('err'+err)
      res.status(404).send(err)
    })
    .catch(err=>{return res.status(500).send(err)})
    //.then(this.handleEntityNotFound(res))
    // .then(this.respondWithResult(res))
    //.catch(this.handleError(res))


  },
  validate:function(req,res){

    //var errors=validateprocess(req.body)
    if(!errors)
      res.status(200).send({validate:true})
    else {
      res.status(400).send({validate:false,errors})
    }

  },
  create:function(req,res){
      console.log(req.body)
      return Workspace.findOne({name:req.body.workspace}).exec()
    .then(data=>{
      if(!data)
        throw new Promise.CancellationError('workspace not found');
      else{
         var processinst=new ProcessInstance({name:req.body.process,state:'disabled',workspace:data._id})
         data.processes.push(processinst)
         return Promise.all([processinst,data]).map(p=>p.save())

      }
  })
  .then(data=>{
    if(!data)
    {
       res.status(404).send( {msg:'data not saved'})
    }
    else{
      data[0].workspace=data[1]._id
      res.status(200).send( data[0])
    }
  })
  .catch(Promise.CancellationError,err=>{
    console.log('err'+err)
    res.status(404).send(err)
  })
  .catch(err=>{
     console.log(err)
    res.status(500).send(err)
  })


},

deleteprocess:function(req,res){

   var conditionstr
  if(req.params && req.params.id )
  {

    conditionstr={name:req.params.id}

    ProcessInstance.findOne(conditionstr).exec()
    .then(data=>{


        if(!data)
        {
          res.status(404).send('data not found')
      }
      else{

        return Promise.all([ProcessInstance.remove({name:req.params.id}),Queue.remove({ProcessInstance:data._id}),Rule.remove({ProcessInstance:data._id}),Workitem.remove({workspace:data._id})])
      }
    })
    .then(_=>{

      res.status(200).send('data deleted')})
    .catch(err=>{
      console.log('err'+err)
      res.status(500).send(err)
    })


}
  else
   {
     return res.status(404).send('no workspace-name is specified')
   }


}



}

module.exports=processCtrl
