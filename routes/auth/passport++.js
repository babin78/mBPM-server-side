var passport=require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User=require('../../models/user-model')

exports.setup=function(app){

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('local',new LocalStrategy(
    {
      usernameField : 'emailid',
       passwordField : 'password',
      passReqToCallback: true,
      session:true
  },
  function(req,emailid, password, done) {
    User.findOne({ emailid: emailid }, function (err, user) {
      console.log('calling auth')
      if (err) {
       console.log(err.message)
        return done(err);
      }
      if (!user) {
        console.log('no user found')
        return done(null, false, { message: 'Incorrect emailid.' });
      }
      if (!user.validPassword(password)) {
        console.log('invalid password')
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('invalid password')
      return done(null, user);
    });
  }
))



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

}

//exports.isAuthenticated = passport.authenticate('local', { session : true });
exports.isAuthenticated=passport.authenticate('local',{session:true})
/*exports.isAuthenticated=function (req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.status(403).send({err:'not authorized'})
}
*/
