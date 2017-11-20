var router = require('express').Router();
var queueCtrl=require('./queue.controller')

router.get('/',queueCtrl.getAll)
router.get('/:id',queueCtrl.getOne)
router.get('/process/:id',queueCtrl.getByProcessID)
router.post('/adduser',queueCtrl.addUser)
router.post('/removeuser',queueCtrl.removeUser)

module.exports = router;
