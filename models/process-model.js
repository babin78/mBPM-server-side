var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator')
var states=['enabled','disabled','started','stopped','checkin','checkout','starting','stopping','error','invalid']
var processSchema=new mongoose.Schema({
  name:{type: String, lowercase: true, required: [true, "can't be blank"],
  //match: [/^[a-zA-Z0-9]$/, 'is invalid'],
  index: true,
  unique: true
},
  state:{type: String, lowercase: true,enum:states, required: [true, "can't be blank"],Default:'disabled'}, //enabled/disabled/started/stopped/checkin/checkout/starting/stopping/err/invalid
  queues:[{type:mongoose.Schema.Types.ObjectId,ref:'Queue'}],
  workspace:{type:mongoose.Schema.Types.ObjectId,ref:'Workspace'}

},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})

processSchema.plugin(uniqueValidator,{message:'is already taken'});
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
module.exports=mongoose.model('ProcessInstance',processSchema)
