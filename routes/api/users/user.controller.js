var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise
var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var config = require('../../../config')
var passport=require('../../auth/passport')
var User=require('../../../models/user-model')

var generateToken=function (user) {
  return jwt.sign(user, config.secret, {
    expiresIn: '5m' // in seconds
  })
}

// Set user info from request
var setUserInfo=function (request) {
  return {
    _id: request._id,
    name: request.profile.name,
    nickname: request.profile.nickname,
    email: request.email,
    role: request.role,
  }
}





exports.logout=function(req,res){
    req.logout()
    res.status(200).send({status:'done'})

}

exports.login=function(req,res,next){
  let userInfo = setUserInfo(req.user)

    res.status(200).json({
      token: 'JWT ' + generateToken(userInfo),
      user: userInfo
    })
}


exports.createUser=function(req,res){



      debugger;
      //if(!req.body.username)
      // return res.status(400).send({err:'username is not defined'})
      if(!req.body.email)
        return res.status(400).send({err:'emailid is not defined'})
      if(!req.body.password)
          return res.status(400).send({err:'password is not defined'})
      if(!req.body.role)
          return res.status(400).send({err:'role is not defined'})

      var user=new User()
      //user.username=req.body.username
      user.email=req.body.email
      user.role=req.body.role
      //user.setPassword(req.body.password)
      user.password = req.body.password

      if(req.body.nickname)
      user.nickname=req.body.nickname

      if(req.body.isConfirmed)
      user.isConfirmed=req.body.isConfirmed


    return user.save()
    .then(_=>{
          let userInfo = setUserInfo(user)

          res.status(201).json({
            //token: 'JWT ' + generateToken(userInfo),
            user: userInfo
          })

    })
    .catch(err=>{
      res.status(500).send(err.message)
    })


  }



  exports.patchUser=function(req,res){




        //if(!req.body.username)
        // return res.status(400).send({err:'username is not defined'})
        if(!req.body._id)
          return res.status(404).send({err:'_id is not defined'})

      return User.findOne({_id:req.body._id})
          .then(data=>{
             if(!data)
              return res.status(404).send({err:'user not found'})

              data=Object.assign(data,req.body)
              return data.save()
            })
            .then(data=>{
              let userInfo = setUserInfo(data)

              res.status(200).json({
                //token: 'JWT ' + generateToken(userInfo),
                user: userInfo
              })
            })
            .catch(err=>{
              res.status(500).send(err.message)
            })


    }


  exports.deleteUser=function(req,res){
      if(!req.body.emailid)
         return res.status(400).send({err:'emailid is not defined'})


      return User.findOne({emailid:req.body.emailid})
      .then(data=>{
        if(!data)
        throw new Promise.CancellationError('user not found')
        return User.remove({emailid:req.body.emailid})

      })
      .then(_=>{
        res.status(200).send({status:'success'})
      })
      .catch(Promise.CancellationError,e=>{
           res.status(400).send({err:'data not found'})

      })
      .catch(err=>{
        res.status(500).send({err:err.message})
      })


    }


    exports.getUsers=function(req,res){

        return User.find({}).select("-hash -salt")
        .then(data=>{
            res.status(200).send(data)

        })
        .catch(err=>{
          res.status(500).send({err:err.message})
        })


      }


      exports.getUser=function(req,res){

          return User.findOne({_id:req.params.id}).select("-hash -salt")
          .then(data=>{
              res.status(200).send(data)

          })
          .catch(err=>{
            res.status(500).send({err:err.message})
          })


        }

/*
        //========================================
        // Authorization Middleware
        //========================================

        // Role authorization check
        exports.roleAuthorization = function(role) {
          return function(req, res, next) {
            const user = req.user;

            User.findById(user._id, function(err, foundUser) {
              if (err) {
                res.status(422).json({ error: 'No user was found.' })
                return next(err)
              }

              // If user is found, check role.
              if (foundUser.role == role) {
                return next()
              }

              res.status(401).json({ error: 'You are not authorized to view this content.' })
              return next('Unauthorized')
            })
          }
        }
*/
