var router = require('express').Router();

router.use('/workspace', require('./workspace'));

module.exports = router;
