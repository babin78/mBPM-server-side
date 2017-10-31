var router = require('express').Router();
var workspaceCtrl=require('./workspace.controller')

router.get('/',(req,res)=>workspaceCtrl.getview(req,res))//get one or all
router.post('/:name',(req,res)=>workspaceCtrl.createworkspace(req,res)) //create one
router.delete('/:name',(req,res)=>workspaceCtrl.deleteworkspace(req,res)) //delete one
module.exports = router;
