var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator')
var ruleSchema=new mongoose.Schema({
  name:{type: String, lowercase: true, required: [true, "can't be blank"],
  //match: [/^[a-zA-Z0-9]$/, 'is invalid'],
  index: true,
  unique: true
},
  type:{type: String, lowercase: true, required: [true, "can't be blank"]}, //auto/decision/split/join/set/expire
  condition:{type: String, lowercase: true}
  from:String,
  to:String,
  fromqueue:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  toqueue:[{type:mongoose.Schema.Types.ObjectId,ref:'Queue'}],
  workspace:{type:mongoose.Schema.Types.ObjectId,ref:'Workspace'},
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'}
},{ retainKeyOrder:true,
 timestamps: { createdAt: 'created_at' }})

ruleSchema.plugin(uniqueValidator,{message:'is already taken'});
/*
var autoPopulateProcess = function(next) {
    this.populate('queues')
    //.populate('workspace');
    next();
};

processSchema
.pre('find', autoPopulateProcess)
.pre('findById', autoPopulateProcess)
.pre('findOne', autoPopulateProcess)
*/
module.exports=mongoose.model('Rule',ruleSchema)
