var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var config=require('../config')
var roles=config.roles

var groupSchema=new mongoose.Schema({
  name: {type: String, lowercase: true, required: [true, "can't be blank"],
  index: true,
  unique: true
},

  users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
  roles:[{name: {type: String, lowercase: true,enum:roles}]
},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})

groupSchema.plugin(uniqueValidator,{message:'is already taken'});
module.exports=mongoose.model('Group',groupSchema)
