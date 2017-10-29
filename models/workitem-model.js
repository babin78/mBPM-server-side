var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var workitemSchema=new mongoose.Schema({
  status:String, //locked//processing//done//available
  lockedby:String,
  queue:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'}
},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})
//workitemSchema.plugin(uniqueValidator,{message:'is already taken'});

var autoPopulateQueues = function(next) {
    this.populate('queues');
    next();
};

workitemSchema
.pre('findOne', autoPopulateQueues)
.pre('find', autoPopulateQueues)
.pre('findById', autoPopulateQueues)

module.exports=mongoose.model('Workitem',workitemSchema)
