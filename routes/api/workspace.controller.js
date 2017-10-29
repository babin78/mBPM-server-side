var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var ProcessInstance=require('../../models/process-model')
var Workspace=require('../../models/workspace-model')

var workspaceCtrl={

  getview:function(req,res){

     var conditionstr
    if(req.query && req.query.name )
      conditionstr={name:req.query.name}
    else
     conditionstr={}

    Workspace.find(conditionstr)
    .then(data=>{

      res.send(data)
    })
    .catch(err=>{res.send(err)})

  },

  createworkspace:function(req,res){

     var workspace=new Workspace({name:req.params.name})
    workspace.save()
    .then(data=>{

      res.send(data)
    })
    .catch(err=>{res.send(err)})

  },
  deleteworkspace:function(req,res){


    Workspace.remove({name:req.params.name})
    .then(data=>{

      res.send(data)
    })
    .catch(err=>{res.send(err)})

  }
}

module.exports=workspaceCtrl
