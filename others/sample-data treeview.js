//tree view

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

var process,queue,workitem

dbConnectPromise.then(()=>{
/*
  return Workspace.findOne({name:'dummy'}).populate({
    path: 'processes',
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { path: 'queues' }
  }).exec();
 */

 /*return Workspace.findOne({name:'dummy'}).populate({
   path:'processes',
   model:'Process',
   populate: {
    path: 'queues',
    model: 'Queue'
  }

}).exec();
*/
/*
return Queue.findOne({name:'work introduction'}).populate([{
  path:'queue',
  model:'Queue'
}]

*/


return Workitem.findOne({_id:'59f33b3b99506b25f033ecf5'}).populate([{
  path:'queue',
  model:'Queue',
  populate:{
    path:'workitems',
    model:'Workitem'
  }
},
{
  path:'process',
  model:'Process',
  populate:{
    path:'queues',
    model:'Queue'
  }
}]
).exec();

}).then((data)=>{
  console.log(data)

}).catch(err=>{console.log(err)})
