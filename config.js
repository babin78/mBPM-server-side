var config={

  dbURL: 'mongodb://localhost/validate',
  //dbURL: 'mongodb://localhost123',
 //dbURL:"mongodb://sa:system123#@ds161304.mlab.com:61304/conduitapp",

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
