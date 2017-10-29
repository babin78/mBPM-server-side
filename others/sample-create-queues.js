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

var processInst
dbConnectPromise.then(()=>{

    Process.findOne({name:'outward'}).exec().then((data)=>{
     if(!data)
       return Promise.reject("process not found")

       processInst=data;

       var queue1=new Queue()
       queue1.name='work introduction'
       queue1.type='start'
       queue1.process=processInst._id

       var queue2=new Queue()
       queue2.name='data entry'
       queue2.type='custom'
       queue2.process=processInst._id

       var queue3=new Queue()
       queue3.name='work exit'
       queue3.type='end'
       queue3.process=processInst._id


             Promise.all([queue1.save(),queue2.save(),queue3.save()]).then((data)=>{

               queue1.next=data[1]._id
               queue2.prev=data[0]._id
               queue2.next=data[2]._id
               queue3.prev=data[1]._id

               Promise.all([queue1.save(),queue2.save(),queue3.save()]).then((data)=>{
                 data.forEach(instance=>{
                     processInst.queues.push(instance)
                   })
                 processInst.save()

                              })

             })



  })

}).then((data)=>{
  console.log(data)
}).catch(err=>{console.log(err)})
