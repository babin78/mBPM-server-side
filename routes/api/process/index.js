var router = require('express').Router();
var processCtrl=require('./process.controller')

router.get('/:workspacename/:processname',(req,res)=>processCtrl.getview(req,res))//get one or all
router.post('/',(req,res)=>processCtrl.create(req,res)) //create one
router.post('/isvalid',(req,res)=>processCtrl.validate(req,res)) //create one

//router.delete('/:name',(req,res)=>workspaceCtrl.deleteworkspace(req,res)) //delete one
module.exports = router;
