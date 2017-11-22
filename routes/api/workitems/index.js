var router = require('express').Router();
var workitemCtrl=require('./workitem.controller')
var passport=require('../../auth/passport')
var workitemHelper=require('./workitem-helper')
//router.post('/uploadWorkItem',passport.requireAuth,workitemHelper.checkProcessMiddleware,workitemCtrl.uploadWorkItem)
//test concurrency
router.post('/tc',workitemCtrl.uploadtc)

router.post('/uploadworkitem',
          passport.isAuthenticated,
          workitemHelper.checkProcessQueue,
          workitemCtrl.uploadWorkItem)
router.post('/cleanDanger',
                    passport.isAuthenticated,
                    workitemHelper.checkProcess,
                    workitemCtrl.deleteWorkItem)
router.get('/',      workitemCtrl.getAllWorkItem)
router.get('/:id',      workitemCtrl.getOneWorkItem)
module.exports = router;
