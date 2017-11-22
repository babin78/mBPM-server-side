var _=require('underscore')
var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/rule-model')
var User=require('../../../models/user-model')
//var processCtrl={


  exports.getAll=function(req,res){
    return Queue.find({})
          .populate('workspace','name')
          .populate('ProcessInstance','name')
          .populate('users','email')
          .populate('workitems')
          .exec()
    .then(data=>{
      if(!data)
      throw new Promise.CancellationError('no data found');
      else{
      res.status(200).send(data)
    }
    })
    .catch(Promise.CancellationError,err=>{
      console.log('err'+err)
      res.status(404).send(err)
    })
    .catch(err=>{return res.status(500).send(err)})


  }

  exports.getOne=function(req,res){
    return Queue.findOne({_id:req.params.id})
          .populate('workspace','name')
          .populate('ProcessInstance','name')
          .populate('users','email')
          .populate('workitems')
          .exec()
    .then(data=>{
      if(!data)
      throw new Promise.CancellationError('no data found');
      else{
      res.status(200).send(data)
    }
    })
    .catch(Promise.CancellationError,err=>{
      console.log('err'+err)
      res.status(404).send(err)
    })
    .catch(err=>{return res.status(500).send(err)})


  }

  exports.getByProcessID=function(req,res){
    return Queue.findOne({ProcessInstance:req.params.id})
          .populate('workspace','name')
          .populate('ProcessInstance','name')
          .populate('users','email')
          .populate('workitems')
          .exec()
    .then(data=>{
      if(!data)
      throw new Promise.CancellationError('no data found');
      else{
      res.status(200).send(data)
    }
    })
    .catch(Promise.CancellationError,err=>{
      console.log('err'+err)
      res.status(404).send(err)
    })
    .catch(err=>{return res.status(500).send(err)})


  }

  exports.addUser=function(req,res){

    if(!req.body.queueid)
      return res.status(404).send({err:'queueid is not defined'})
    if(!req.body.userid)
        return res.status(404).send({err:'userid is not defined'})
    if((!mongoose.Types.ObjectId.isValid(req.body.userid)) || (!mongoose.Types.ObjectId.isValid(req.body.queueid)))
         return res.status(404).send({err:'either useridor queueid is invalid'})

    return Promise.all([Queue.findOne({_id:req.body.queueid}),User.findOne({_id:req.body.userid})])
    .then(data=>{
      if(!data[0])
        throw new Promise.CancellationError('queue not found');
      if(!data[1])
        throw new Promise.CancellationError('user not found');

      var isUserAlreadyThere=_.find(data[0].users,u=>{return u==req.body.userid})

      if(isUserAlreadyThere)
        throw new Promise.CancellationError('user is already added');

      data[0].users.push(data[1]._id)
      return data[0].save()
    })
    .then(_=>{
      return Queue.findOne({_id:req.body.queueid})
            .populate('workspace','name')
            .populate('ProcessInstance','name')
            .populate('users','email')
            .populate('workitems')
            .exec()
    })
    .then(data=>{
      res.status(200).send(data)
    })
    .catch(Promise.CancellationError,err=>{
      console.log('err'+err)
      res.status(404).send({err:err.message})
    })
    .catch(err=>{return res.status(500).send({err:err.message})})


  }

  exports.removeUser=function(req,res){

    if(!req.body.queueid)
      return req.status(400).send({err:'queueid is not defined'})
    if(!req.body.userid)
        return req.status(400).send({err:'userid is not defined'})

    if((!mongoose.Types.ObjectId.isValid(req.body.userid)) || (!mongoose.Types.ObjectId.isValid(req.body.queueid)))
             return res.status(400).send({err:'either useridor queueid is invalid'})


    return Promise.all([Queue.findOne({_id:req.body.queueid}),User.findOne({_id:req.body.userid})])
    .then(data=>{
      if(!data[0])
        throw new Promise.CancellationError('queue not found');
      if(!data[1])
        throw new Promise.CancellationError('user not found');
      var isUserAlreadyThere=_.find(data[0].users,u=>{return u==req.body.userid})
      if(!isUserAlreadyThere)
        throw new Promise.CancellationError('user is already removed');

      var newUserList=_.reject(data[0].users,u=>{return u==req.body.userid})
      console.log(newUserList)
      data[0].users=newUserList
      return data[0].save()
    })
    .then(_=>{
      return Queue.findOne({_id:req.body.queueid})
            .populate('workspace','name')
            .populate('ProcessInstance','name')
            .populate('users','email')
            .populate('workitems')
            .exec()
    })
    .then(data=>{
      res.status(200).send(data)
    })
    .catch(Promise.CancellationError,err=>{
      console.log('err'+err)
      res.status(404).send({err:err.message})
    })
    .catch(err=>{return res.status(500).send({err:err.message})})


  }
