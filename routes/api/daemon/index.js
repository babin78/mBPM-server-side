var router = require('express').Router();
var daemonCtlr=require('../../../daemon/ctrl')

router.get('/start',(req,res)=>{
    daemonCtlr.start()
    res.status(200).send('started')
})

router.get('/stop',(req,res)=>{
    daemonCtlr.stop()
    res.status(200).send('stopped')
})


router.get('/status',(req,res)=>{

  var pid= daemonCtlr.status()
  if(pid>0)
    res.status(200).send('{running} pid:'+pid)
  else
    res.status(200).send('{not running}' )
})

module.exports = router;
