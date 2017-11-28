var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var config=require('../config')
var datatypes=['string','number','boolean','date','object','array']

var metadataSchema=new mongoose.Schema({
  attributename:{type: String, lowercase: true, required: [true, "can't be blank"],index:true},
  attributetype:{type: String, lowercase: true, enum:datatypes,required: [true, "can't be blank"]},
  defaultvalue:{},
  mandatory:Boolean,
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'},

},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})


module.exports=mongoose.model('Metadata',metadataSchema)
