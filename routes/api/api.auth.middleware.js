var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var Apikey=require('../../models/apikey-model')

module.exports=  function (req, res, next) {
    if(!req.header('apikey'))
      {return res.status(400).send({msg:'no request header[apikey] found'})}
      else {
           Apikey.findOne({keyval:req.header('apikey')}).then(data=>{
             if(!data)
             {return res.status(401).send({msg:'you are not authorized'})}
             next()
           }).catch(err=>{
             res.status(500).send(err)
           })

      }
  }
