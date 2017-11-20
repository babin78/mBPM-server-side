var passport = require('passport')
var User = require('../../models/user-model')
var config = require('../../config')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
var LocalStrategy = require('passport-local')

const localOptions = { usernameField: 'email',passwordField: 'password' }

  // Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    process.nextTick(function(){

      User.findOne({ email: email }, function(err, user) {
        if(err) { return done(err) }
        if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }) }

        user.comparePassword(password, function(err, isMatch) {
          if (err) { return done(err) }
          if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }) }

          return done(null, user)
        })
      })

    })


})

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() ,//ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
}

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    console.log(payload)
    process.nextTick(function(){
      User.findById(payload._id, function(err, user) {
        if (err) { return done(err, false) }

        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })

    })

})


exports.setup=function(app){

  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(jwtLogin)
  passport.use(localLogin)
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })

}


// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: true });
const requireLogin = passport.authenticate('local', { session: true });
exports.requireAuth=requireAuth
exports.requireLogin=requireLogin
exports.isAuthenticated=function (req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.status(403).send({err:'not authorized'})
}
