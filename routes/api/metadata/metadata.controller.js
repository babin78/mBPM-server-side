var _=require('underscore')
var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var metaDataHelper=require('./metadata-helper')


exports.getMetaData=function(req,res,next){
   return metaDataHelper.getMetaData(req.params.id).then(data=>{
                    return res.status(200).send(data)
                    next()
                }).catch(next)

}
exports.insertMetaData=function(req,res,next){
   metaDataHelper.insertMetaData(req.body)
                .then(data=>{
                    res.status(200).send(data)
                }).catch(next)

}
exports.deleteMetaData=function(req,res,next){
   metaDataHelper.insertMetaData(req.body)
                .then(data=>{
                    res.status(200).send(data)
                }).catch(next)

}

exports.updateMetaData=function(req,res,next){
   metaDataHelper.updateMetaData(req.body)
                .then(data=>{
                    res.status(200).send(data)
                }).catch(next)

}

exports.isValid=function(req,res,next){
   metaDataHelper.isValid(req.body)
                .then(data=>{
                    res.status(200).send(data)
                }).catch(next)

}

var errorHandler=function(err){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
}
