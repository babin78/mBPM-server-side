var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var queueSchema=new mongoose.Schema({
  name:{type: String, lowercase: true, required: [true, "can't be blank"],
  //match: [/^[a-zA-Z0-9]$/, 'is invalid'],
  index: true,
  unique: true
},
  state:String, //start//end/custom/decision/split/join
  prev:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  next:{type:mongoose.Schema.Types.ObjectId,ref:'Queue'},
  workitems:[{type:mongoose.Schema.Types.ObjectId,ref:'Workitem'}],
  ProcessInstance:{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'}
},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})
queueSchema.plugin(uniqueValidator,{message:'is already taken'});

queueSchema.virtual('itemcount').get(function () {
  return this.workitems.length;
});

var autoPopulateQueus = function(next) {
    this//.populate('prev')
         .populate('next')
         //.populate('workitems')
         //.populate('ProcessInstance')

    next();
};

queueSchema
.pre('find', autoPopulateQueus)
.pre('findById', autoPopulateQueus)
.pre('findOne', autoPopulateQueus)

module.exports=mongoose.model('Queue',queueSchema)
