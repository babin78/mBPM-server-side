var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var instStateEnum=[1,2,3,4]//1-->default ,for split 1 will split to 2 and 3 ,join back 1,4 -->exit/discard out of process
var archivalitemSchema=new mongoose.Schema({
  status:String, //locked//processing//done//available
  lockedby:String,
  queue:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'},
  workspace:{type:mongoose.Schema.Types.ObjectId,ref:'Workspace'},
  instance:{type:Number,enum:instStateEnum,default:1},
  data:{}
},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})
//workitemSchema.plugin(uniqueValidator,{message:'is already taken'});
/*
var autoPopulateQueues = function(next) {
    this.populate('queues');
    next();
};

workitemSchema
.pre('findOne', autoPopulateQueues)
.pre('find', autoPopulateQueues)
.pre('findById', autoPopulateQueues)
*/
module.exports=mongoose.model('Workitem',archivalitemSchema)
