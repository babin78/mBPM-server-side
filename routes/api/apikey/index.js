var router = require('express').Router();
var apikeyCtrl=require('./apikey.controller')

router.get('/getkey',(req,res)=>apikeyCtrl.getkey(req,res))
router.post('/generatekey',(req,res)=>apikeyCtrl.generatekey(req,res))

module.exports = router;
