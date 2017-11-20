var ioc = require( 'socket.io-client' )
var config=require('../config')
var Promise=require('bluebird')

var stopFlag=false
var client = ioc.connect( "http://localhost:3001" )
/*
var executeMe=function (){
  return new Promise((resolve,reject)=>{
        //console.log('inside fun')
        while(!stopFlag){
        {
          //console.log('inside loop')
          setInterval(_=>{
              console.log('running')

                client.emit( "echo", "Hello World", function ( message ) {
                console.log( 'Echo received: ', message );
                client.disconnect()
                //server.close()
            } )

          },1000 * config.daemonInterval)
        }
        console.log('resolved')
        client.emit("echo",'complete')
        client.disconnect()
        Promise.resolve('done')



    }
  })
}
/*
client.once( "connect", function () {
    console.log( 'Client: Connected to port ');

    executeMe()
    .then(_=>{
      console.log('stopping')
      client.emit("echo",'stopping')
      client.disconnect()
      process.exit(0)})
    .catch(_=>{
      console.log('stopping')
      client.emit("echo",'stopping')
      client.disconnect()
      process.exit(0)})

} )

/*
executeMe()
.then(_=>{
  console.log('stopping')
  process.exit(0)})
.catch(_=>{
  console.log('stopping')
  process.exit(0)})

*/
// listen for TERM signal .e.g. kill

client.once( "connect", function () {
  client.emit( "echo", "stopFlag:"+stopFlag, function ( message ) {

  client.disconnect()
  //server.close()
} )
  setInterval(_=>{
      if(stopFlag){
                client.emit( "echo", "stopping", function ( message ) {

                client.disconnect()
                //server.close()
            } )
            process.exit(0)

      }
      console.log('running')

        client.emit( "echo", "Hello World", function ( message ) {
        console.log( 'Echo received: ', message );
        client.disconnect()
        //server.close()
    } )

  },1000 * config.daemonInterval)

} )

process.on ('SIGTERM', _=>{
  stopFlag=true
 console.log('SIGTERM received')
 client.emit( "echo", "SIGTERM received", function ( message ) {

 client.disconnect()
 //server.close()
} )
});

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT',  _=>{stopFlag=true
  console.log('SIGINT received')
  client.emit( "echo", "SIGTERM received", function ( message ) {

  client.disconnect()
  //server.close()
 } )
});
