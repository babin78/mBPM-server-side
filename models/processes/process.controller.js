var _=require('underscore')
var mongoose = require('mongoose')
var Promise=require('bluebird')
var validprocesshelper=require('./process-validate-helper')
mongoose.Promise =Promise

var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/rule-model')

//var processCtrl={


  exports.getview=function(req,res){
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


  }
  exports.validateFormat=function(req,res){

    var errors=validprocesshelper.validateFormat(req.body)
    if(!errors)
      res.status(200).send({validate:true})
    else {
      res.status(400).send({validate:false,errors})
    }

  }
  exports.validateData=function(req,res){
    var obj
    var errors=validprocesshelper.validateFormat(req.body)
    if(!errors)
      {
        obj=validprocesshelper.getToLowerJSON(req.body)
        if(!obj)
          return res.status(400).send({validate:false,errors:[{err:'some error occured during conversion '}]})
        validprocesshelper.validateData(obj)
                          .then(_=>{ return res.status(200).send({validate:true})})
                          .catch(err=>{return res.status(400).send({validate:false,err:err.message.toString()})})
      }
    else {
      res.status(400).send({validate:false,errors})
    }
  }

  exports.getByName=function(req,res){

    validprocesshelper.getByName(req.params.workspacename,req.params.processname)
                      .then(data=>{

                         return res.status(200).send(data)
                      })
                      .catch(Promise.CancellationError,err=>{
                            return res.status(404).send({err:err.message.toString()})
                      })
                      .catch(err=>{return res.status(500).send({err:err.message.toString()})})

  }
  exports.deleteProcessByName=function(req,res){

    validprocesshelper.deleteProcess(req.params.workspacename,req.params.processname)
                      .then(data=>{

                         return res.status(200).send(data)
                      })
                      .catch(Promise.CancellationError,err=>{
                            return res.status(404).send({err:err.message.toString()})
                      })
                      .catch(err=>{return res.status(500).send({err:err.message.toString()})})

  }
  exports.createProcess=function(req,res){

    var obj
    var errors=validprocesshelper.validateFormat(req.body)
    if(!errors)
      {
        console.log('valid format')
        obj=validprocesshelper.getToLowerJSON(req.body)
        if(!obj)
          return res.status(400).send({validate:false,errors:[{err:'some error occured during conversion '}]})
        console.log('convertion passed')
        validprocesshelper.validateData(obj)
                          .then(_=>{
                                console.log('validdatapassed')
                                 return validprocesshelper.createProcess(obj)
                          })
                          .then(data=>{
                            console.log('return data:'+data)
                             return res.status(200).send(data)
                          })
                          .catch(err=>{return res.status(400).send({validate:false,err:err.message.toString()})})
      }
    else {
      res.status(400).send({validate:false,errors})
    }

  }

exports.deleteprocess=function(req,res){

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



//}

//module.exports=processCtrl
