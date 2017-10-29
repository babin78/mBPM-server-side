var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator')

var userSchema = new mongoose.Schema({
  name: String,
  friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }//[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

var autoPopulateFriend = function(next) {
    this.populate('friend');
    next();
};

userSchema
.pre('findOne', autoPopulateFriend)
.pre('find', autoPopulateFriend)


/*var deepPopulate = require('mongoose-deep-populate')(mongoose);

userSchema.plugin(deepPopulate, {
  whitelist: [
    'friend'
  ],

});
*/
module.exports=mongoose.model('User',userSchema)
