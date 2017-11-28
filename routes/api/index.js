var router = require('express').Router();
var apiauth=require('./api.auth.middleware')
//open following line and replace with next line to enable/text api authentication
//with apikey
//router.use('/workspace',apiauth, require('./workspace'));
router.use('/workspaces', require('./workspaces'));
//router.use('/apikey', require('./apikey'));
router.use('/processes', require('./processes'));
router.use('/users', require('./users'));
router.use('/queues', require('./queues'));
router.use('/workitems', require('./workitems'));
router.use('/metadata', require('./metadata'));
//router.use('/daemon', require('./daemon'));
//router.use('/groups', require('./groups'));

module.exports = router;
