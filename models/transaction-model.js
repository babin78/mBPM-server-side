var mongoose=require('mongoose')
//var uniqueValidator=require('mongoose-unique-validator')

var transactionSchema = new mongoose.Schema({

  source:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  destination:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  item:{type:mongoose.Schema.Types.ObjectId,ref:'Workitem'},
  type:String, //move or modify
  state:String, //initial, pending, applied, done, canceling, and canceled.
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'},
  lastModified:{},
  stype:Number, //applicable for move from-pending:0 from:queue:1
  pending:{type:mongoose.Schema.Types.ObjectId,ref:'Pending'}
},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }});

module.exports=mongoose.model('transaction',transactionSchema)
