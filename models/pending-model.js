var mongoose=require('mongoose')
//var uniqueValidator=require('mongoose-unique-validator')

var pendingSchema = new mongoose.Schema({

  prev:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  workitem:{type:mongoose.Schema.Types.ObjectId,ref:'Workitem'},
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'},
  type:String, //create,complete,
  status:String, //locked,done,error
  errordesc:String,
  lockedby:String,
  pendingTransactions:{}
},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }});

module.exports=mongoose.model('Pending',pendingSchema)
