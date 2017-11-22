var mongoose=require('mongoose')
//var uniqueValidator=require('mongoose-unique-validator')

var transactionSchema = new mongoose.Schema({

  source:{},
  destination:{},
  item:{},
  type:String, //move or modify
  state:String, //initial, pending, applied, done, canceling, and canceled.
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'},
  lastModified:{},
  stype:Number //applicable for move from-pending:0 from:queue:1

},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }});

module.exports=mongoose.model('transaction',transactionSchema)
