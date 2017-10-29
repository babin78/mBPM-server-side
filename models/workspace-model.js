var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator');
var workspaceSchema=new mongoose.Schema({
  name:{type: String, lowercase: true, required: [true, "can't be blank"],
  //match: [/^[a-zA-Z0-9]$/, 'is invalid'],
  index: true,
  unique: true
},
  processes:[{type:mongoose.Schema.Types.ObjectId,ref:'ProcessInstance'}],

},{ retainKeyOrder:true, timestamps: { createdAt: 'created_at' }})

workspaceSchema.plugin(uniqueValidator,{message:'is already taken'});

var autoPopulateWorkspace = function(next) {
    this.populate('processes');
    next();
};


workspaceSchema
.pre('findOne', autoPopulateWorkspace)
.pre('find', autoPopulateWorkspace)
.pre('findById', autoPopulateWorkspace)

module.exports=mongoose.model('Workspace',workspaceSchema)
