var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator')

var apikeySchema = new mongoose.Schema({
  keyval: String

});

module.exports=mongoose.model('Apikey',apikeySchema)
