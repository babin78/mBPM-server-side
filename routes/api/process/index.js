var router = require('express').Router();
var processCtrl=require('./process.controller')

router.get('/:workspacename/:processname',(req,res)=>processCtrl.getByName(req,res))
router.delete('/:workspacename/:processname',(req,res)=>processCtrl.deleteProcessByName(req,res))
//router.get('/:workspacename/:processname',(req,res)=>processCtrl.getview(req,res))//get one or all
router.post('/',(req,res)=>processCtrl.createProcess(req,res)) //create one
router.post('/isvalidformat',(req,res)=>processCtrl.validateFormat(req,res)) //create one
router.post('/isvaliddata',(req,res)=>processCtrl.validateData(req,res)) //create one

//router.delete('/:name',(req,res)=>workspaceCtrl.deleteworkspace(req,res)) //delete one
module.exports = router;
