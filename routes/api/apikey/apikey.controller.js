var mongoose = require('mongoose')
var Promise=require('bluebird')
var rand = require("generate-key");

//rand.generateKey();


mongoose.Promise =Promise

var Apikey=require('../../../models/apikey-model')



var apikeyCtrl={

  getkey:function(req,res){


    Apikey.findOne({})
    .then(data=>{

      res.send(data)
    })
    .catch(err=>{res.send(err)})

  },

  generatekey:function(req,res){

     var genkey= rand.generateKey();
     console.log(genkey)
     var apikey=new Apikey({keyval:genkey})
    Promise.all([Apikey.remove({}),apikey.save()])
    .then(data=>{

      res.send(data[1])
    })
    .catch(err=>{res.send(err)})

  }
}

module.exports=apikeyCtrl
