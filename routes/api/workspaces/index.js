var router = require('express').Router();
var workspaceCtrl=require('./workspace.controller')

router.get('/:id',workspaceCtrl.getview)//get one
router.get('/',workspaceCtrl.getall)//get all
router.post('/:name',workspaceCtrl.createworkspace) //create one
router.delete('/:id',workspaceCtrl.deleteworkspace) //delete one
module.exports = router;
