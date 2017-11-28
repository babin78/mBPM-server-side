var router = require('express').Router();
var metadataCtrl=require('./metadata.controller')
//var passport=require('../../auth/passport')
var metadataHelper=require('./metadata-helper')

//router.post('/tc',workitemCtrl.uploadtc)
router.get('/:id',metadataCtrl.getMetaData)
router.post('/',metadataCtrl.insertMetaData)
router.delete('/',metadataCtrl.deleteMetaData)
router.patch('/',metadataCtrl.updateMetaData)
router.get('/isvalid',metadataCtrl.isValid)

router.use(function(err, req, res, next){
  /*if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }


*/
    if(err)
    {console.log(err)
    return res.status(500).send(err.message)
    }
    next()
})
module.exports = router;
