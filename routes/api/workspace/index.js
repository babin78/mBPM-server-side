var router = require('express').Router();
var workspaceCtrl=require('./workspace.controller')

router.get('/getview',(req,res)=>workspaceCtrl.getview(req,res))
router.post('/createworkspace/:name',(req,res)=>workspaceCtrl.createworkspace(req,res))
router.post('/deleteworkspace/:name',(req,res)=>workspaceCtrl.createworkspace(req,res))
module.exports = router;
