//var crypto =require('crypto')
var bcrypt   = require('bcrypt-nodejs');
var mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator')
var Promise=require('bluebird')
mongoose.promise=Promise
var config=require('../config')
var roles=config.roles

var UserSchema = new mongoose.Schema({
/*  username: {type: String, lowercase: true, required: [true, "can't be blank"],
  index: true,
  unique: true
},*/
  email: {type: String, lowercase: true, required: [true, "can't be blank"],index: true,
  unique: true},
  role: {
    type: String,enum:roles,
    default: 'user',lowercase: true, required: [true, "can't be blank"]
  },
  nickname:String,
  isConfirmed:Boolean,
  password: {type:String,required: [true, "can't be blank"]},
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
  //salt: String
  //hash: String,
  //salt: String

},{timestamps: { createdAt: 'created_at'}});



/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      email:this.email,
      name: this.username,
      nickname:this.nickname,
      role: this.role
    };
  });

  UserSchema.set('toObject', { virtuals: true });
  UserSchema.set('toJSON', { virtuals: true });
/*
  UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };

  UserSchema.methods.validPassword = function(password) {
   var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
   return this.hash === hash;
  };
*/

UserSchema.pre('save', function(next) {
  const user = this,
        SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}


/*
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

*/
UserSchema.plugin(uniqueValidator,{message:'is already taken'});
module.exports= mongoose.model('User', UserSchema);
