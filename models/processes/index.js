var router = require('express').Router();
var processCtrl=require('./process.controller')

router.get('/:workspacename/:processname',processCtrl.getByName)
router.delete('/:workspacename/:processname',processCtrl.deleteProcessByName)
//router.get('/:workspacename/:processname',(req,res)=>processCtrl.getview(req,res))//get one or all
router.post('/',processCtrl.createProcess) //create one
router.post('/isvalidformat',processCtrl.validateFormat) //create one
router.post('/isvaliddata',processCtrl.validateData) //create one

//router.delete('/:name',(req,res)=>workspaceCtrl.deleteworkspace(req,res)) //delete one
module.exports = router;
