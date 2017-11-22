var _=require('underscore')
var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/rule-model')
var User=require('../../../models/user-model')


var isJSON=function(obj){
  try{
   if(typeof(obj)!='object')
     return false

     var keys=_.keys(obj)

     if(keys.length==0)
       return false
   console.log('done')
    var Str=JSON.stringify(obj)
    var lowerStr=Str.toLowerCase(Str)
    var lowerObj=JSON.parse(lowerStr)
    return true

  }
  catch(e){
     console.log(e)
     return false
  }
}

exports.checkProcessQueue = function(req,res,next){
        if(!req.body.processid)
        {  return res.status(400).send({err:'processid is not defined'})
          next(new Error('processid is not defined'))
        }
        if(!req.body.data)
        {    return res.status(400).send({err:'data is not defined'})
              next(new Error('data is not defined'))
        }
        if(req.body.data=={})
        {     return res.status(400).send({err:'processid is not defined'})
             next(new Error('processid is not defined'))
        }
        if(!mongoose.Types.ObjectId.isValid(req.body.processid))
             return res.status(404).send({err:'processid is not valid'})

        console.log(req.body.data)
        /*if(!isJSON(req.body.data))
           return res.status(404).send({err:'data is not a valid JSON'})
        */


      return Promise.all([ProcessInstance.findOne({_id:req.body.processid}),Queue.findOne({ProcessInstance:req.body.processid,state:'start'})])
         .then(data=>{
           if(!data[0])
            {
                return res.status(400).send({err:'process not found'})
                next(new Error('process not found'))
            }
           if(!data[1])
            {    return res.status(400).send({err:'start queue not found'})
                 next(new Error('start queue not found'))
            }
            req.process=data[0]
            req.queue=data[1]

            next()


         })
         .catch(err=>{next(err)})


}


exports.checkProcess = function(req,res,next){
        if(!req.body.processid)
        return res.status(400).send({err:'processid is not defined'})

        if(!mongoose.Types.ObjectId.isValid(req.body.processid))
             return res.status(404).send({err:'processid is not valid'})



      return ProcessInstance.findOne({_id:req.body.processid}).exec()
         .then(data=>{
           if(!data)
                return res.status(400).send({err:'process not found'})

            req.process=data

            next()


         })
         .catch(err=>{next(err)})


}
