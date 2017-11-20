var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise


var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/rule-model')
var Workitem=require('../../../models/workitem-model')

exports.getview=function(req,res){
     var conditionstr
    if(req.params && req.params.id )
      conditionstr={name:req.params.id}
    else
     conditionstr={}

     return Workspace.findOne(conditionstr).populate('processes').exec()
    .then(data=>{
      if(!data)
        return res.status(404).send({})
        res.status(200).send(data)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
  }

  exports.getall=function(req,res){

       return Workspace.findOne({}).populate('processes').exec()
      .then(data=>{
        if(!data)
          return res.status(404).send({})
          res.status(200).send(data)
      })
      .catch(err=>{
        res.status(500).send(err)
      })
    }


  exports.deleteworkspace=function(req,res){

     var conditionstr
    if(req.params && req.params.id )
    {

      conditionstr={name:req.params.id}

      Workspace.findOne(conditionstr).exec()
      .then(data=>{


          if(!data)
          {
            throw new Promise.CancellationError('workspace not found');
        }
        else{

          return Promise.all([Workspace.remove({name:req.params.id}),ProcessInstance.remove({workspace:data._id}),Queue.remove({workspace:data._id}),Rule.remove({workspace:data._id}),Workitem.remove({workspace:data._id})])
        }
      })
      .then(_=>{

        res.status(200).send('data deleted')}
      )
      .catch(Promise.CancellationError,err=>{
        console.log('err'+err)
        res.status(400).send({err:'workpace not found'})
      })
      .catch(err=>{
        console.log('err'+err)
        res.status(500).send(err)
      })


  }
    else
     {
       return res.status(404).send('no workspace-name is specified')
     }


  },

  exports.createworkspace=function(req,res){

     var workspace=new Workspace({name:req.params.name})
    workspace.save()
    .then(data=>{

      res.send(data)
    })
    .catch(err=>{res.send(err)})

  }
//}

//module.exports=workspaceCtrl
