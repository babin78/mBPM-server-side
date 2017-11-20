var config={

  dbURL: 'mongodb://localhost/validate',
  secret:'validate',
  sessionExpire:1, //in min  //14,//days
  daemonInterval:2, //min
  //dbURL: 'mongodb://localhost123',
 //dbURL:"mongodb://sa:system123#@ds161304.mlab.com:61304/conduitapp",
 socketPort:3001,
 appPort:3000,
roles:['owner','admin','BLadmin','user'],
 mongo: {
     options: {
       /*db: {
         safe: true
       },
       */
       useMongoClient: true
     }
   }
}

module.exports=config
