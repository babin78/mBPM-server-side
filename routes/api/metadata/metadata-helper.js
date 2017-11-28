var _=require('underscore')
var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var Metadata=require('../../../models/metadata-model')

exports.getMetaData=function(processid){
  return Promise.try(function(){
    return Metadata.find({ProcessInstance:mongoose.Types.ObjectId(processid)})
  })//.then(data=>{return data})
}

exports.insertMetaData=function(metadata){
  return Promise.try(function(){
    metadata=new Metadata({
                            ProcessInstance:mongoose.Types.ObjectId(metadata.processid),
                            attributename:metadata.attributename,
                            attributetype:metadata.attributetype,
                            defaultvalue:metadata.defaultvalue,
                            mandatory:metadata.mandatory
                          })
    return metadata.save()
  })//.then(data=>{return data})
}

exports.deletetMetaData=function(metadata){
  return Promise.try(function(){
        return Metadata.remove({ProcessInstance:mongoose.Types.ObjectId(metadata.processid),attributename:metadata.attributename})
  })//.then(data=>{return data})
}

exports.updateMetaData=function(newVal){
  return Promise.try(function(){

        return Metadata.findOne({_id:newval._id})
               .then(data=>{
                 if(!data)
                  return res.status(404).send({})

                  var updatedVal=Object.assign(data,newVal)

                  return updatedVal.save()
               })

  })//.then(data=>{return data})
}
exports.isValid=function(metadata,val){
  return new Promise(function(resolve,reject){
     //code has to be build
     resolve(true)
  })
}
