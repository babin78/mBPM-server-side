var router = require('express').Router();
var apiauth=require('./api.auth.middleware')
//open following line and replace with next line to enable/text api authentication
//with apikey
//router.use('/workspace',apiauth, require('./workspace'));
router.use('/workspace', require('./workspace'));
//router.use('/apikey', require('./apikey'));
router.use('/process', require('./process'));
module.exports = router;
