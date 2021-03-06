var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var types=['start','end','decision','split','join','custom','set','expire']
var queueSchema=new mongoose.Schema({
  queuename:{type: String, lowercase: true, required: [true, "can't be blank"],
  //match: [/^[a-zA-Z0-9]$/, 'is invalid'],
  index: true,
  unique: true
},
workstepname:{type: String, lowercase: true, required: [true, "can't be blank"]},
  state:{type: String, lowercase: true, enum:types,required: [true, "can't be blank"]}, //start//end/custom/decision/split/join
  //prev:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  //next:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  //prev:{},
  //next:{},
  //rules:[{type:mongoose.Schema.Types.ObjectId,ref:'Rule'}],
  rules:[{type:String,lowercase:true,required: [true, "can't be blank"]}],
  ruleids:[{type:mongoose.Schema.Types.ObjectId,ref:'Rule'}],
  //workstep:{type: String, lowercase: true, required: [true, "can't be blank"],enum:types},
  workitems:[{type:mongoose.Schema.Types.ObjectId,ref:'Workitem'}],
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'},
  workspace:{type:mongoose.Schema.Types.ObjectId,ref:'Workspace'},
  users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
  pendingTransactions:[{type:mongoose.Schema.Types.ObjectId,ref:'Transaction'}]

},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})
queueSchema.plugin(uniqueValidator,{message:'is already taken'});
/*
queueSchema.virtual('itemcount').get(function () {
  return this.workitems.length;
});
*/
/*
var autoPopulateQueus = function(next) {
    this//.populate('prev')
         .populate('ruleids')
         .populate('workitems')
         //.populate('workitems')
         //.populate('ProcessInstance')

    next();
};

queueSchema
.pre('find', autoPopulateQueus)
.pre('findById', autoPopulateQueus)
.pre('findOne', autoPopulateQueus)
*/

queueSchema
  .virtual('itemcount')
  .get(function() {
    return this.workitems.length
  });

  queueSchema.set('toObject', { virtuals: true });
  queueSchema.set('toJSON', { virtuals: true });
module.exports=mongoose.model('Queue',queueSchema)
