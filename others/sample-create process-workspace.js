var config=require('./config')

var mongoose=require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise
//console.log(config.dbURL)

var dbConnectPromise=mongoose.connect(config.dbURL, config.mongo.options).then(()=>{

  return Promise.resolve('database connection is sucessfull')


}).catch(err=>{
  console.log(err)
  return Promise.reject('some error occured during database connection')
  })


var Process=require('./models/process-model')
var Workspace=require('./models/workspace-model')
var Workitem=require('./models/workitem-model')
var Queue=require('./models/queue-model')


//console.log( Process.collection.collectionName)


//var wsDropP=require('./dropcollection')(Workspace)
//var psP=require('./dropcollection')(Process)
//var qP=require('./dropcollection')(Queue)
//var wiP=require('./dropcollection')(Workitem)
/*
var workspace
var process1

//Workspace.findById('59f30de62b4ef40d5c4dadaa').then()

/*
dbConnectPromise.then(()=>{
  console.log('data connection is establised')
  console.log('dropping workspace collection')
  return wsDropP
}).then(()=>{
  console.log('dropping process collection')
  return psP
})
*/

dbConnectPromise.then(()=>{
  console.log('connection done')
  return Workspace.findOne({name:'dummy'})//.exec()

}).then((data)=>{
  //console.log('new workspace is created')
  if(!data)
   {
      workspace=new Workspace()
      workspace.name='dummy'
      return  workspace.save()
   }

   workspace=data
   return workspace

}).then((data)=>{

  if(data)
  console.log('workspace created/found')

  console.log(data)

  return Process.findOne({name:'outward'})

}).then((data)=>{

    if(!data)
    {
      process1=new Process()
      process1.name='outward'
      process1.state='enabled'
      process1.workspace=workspace._id

      return process1.save()
   }
   {
     process1=data;
     return process1
   }


}).then((data)=>{

  console.log('new process is found/created')
  console.log(data)
  workspace.processes.push(process1)
  return workspace.save()


}).then((data)=>{

  console.log('workspace resaved')
  console.log(data)


}).catch(err=>{console.log(err)})
