var router = require('express').Router();
var userCtrl=require('./user.controller')
var passport=require('../../auth/passport')

router.post('/',userCtrl.createUser) //create one
router.patch('/',userCtrl.patchUser)
router.delete('/',userCtrl.deleteUser) //delete one
router.get('/', userCtrl.getUsers) //get all
router.get('/:id',userCtrl.getUser) //get one
router.post('/login', passport.requireLogin,userCtrl.login)
router.post('/logout',userCtrl.logout)
//router.patch('/',userCtrl.updateUser) //get one
router.get('/jwt', passport.requireAuth, function(req, res) {
  res.send('jwt==>User id is: ' + req.user._id + '.');
});

router.get('/local', passport.isAuthenticated, function(req, res) {
  res.send('local==>User id is: ' + req.user._id + '.');
});
module.exports = router;
