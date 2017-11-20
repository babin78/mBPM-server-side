var _=require('underscore')

var mongoose = require('mongoose')
var Promise=require('bluebird')
mongoose.Promise =Promise

var ProcessInstance=require('../../../models/process-model')
var Workspace=require('../../../models/workspace-model')
var Queue=require('../../../models/queue-model')
var Rule=require('../../../models/rule-model')


var allworksteps=[]
var allrules=[]
var visitedworksteps=[]
var visitedrules=[]
var pendings=[]
var queues,rulebook

var traverse=function(workstepname,rulename){
var nextrules,nextrule,remaining,currentrule,currentworkstep,nextworkstep,nextpendingItem

  try{
    {
      if(!_.contains(visitedworksteps,workstepname) && !_.contains(visitedrules,rulename) )
      {     if(!_.contains(visitedworksteps,workstepname))
            visitedworksteps.push(workstepname)
            if(!_.contains(visitedrules,rulename))
            visitedrules.push(rulename)
            currentrule=_.find(rulebook,v=>{return v.rulename==rulename})
            currentworkstep=_.find(queues,v=>{return v.workstepname==workstepname})

            if(currentrule.type!='set')
            {
                nextworkstep=_.find(queues,v=>{ return v.workstepname==currentrule.to})
                if(nextworkstep.state!='end')
                {

                    nextrules=nextworkstep.rules
                    nextrule=_.first(nextrules)
                    remaining=_.rest(nextrules)
                    if(remaining.length>0)
                    _.each(remaining,v=>{
                       pendings.push({workstepname:nextworkstep.workstepname,rulename:v})
                    })
                    traverse(nextworkstep.workstepname,nextrule)
                }
                else {
                      if(!_.contains(visitedworksteps,nextworkstep.workstepname))
                      visitedworksteps.push(nextworkstep.workstepname)
                        if(pendings.length>0)
                        {
                          nextpendingItem=_.first(pendings)
                          pendings=_.rest(pendings)
                          traverse(nextpendingItem.workstepname,nextpendingItem.rulename)
                        }
                        else {
                          return
                        }

                }

            }
            else {
              if(pendings.length>0)
              {
                nextpendingItem=_.first(pendings)
                pendings=_.rest(pendings)
                traverse(nextpendingItem.workstepname,nextpendingItem.rulename)
              }
              else {
                return
              }
            }
        }
        else if(_.contains(visitedworksteps,workstepname) && _.contains(visitedrules,rulename) ){
          if(pendings.length>0)
          {
            nextpendingItem=_.first(pendings)
            pendings=_.rest(pendings)
            traverse(nextpendingItem.workstepname,nextpendingItem.rulename)
          }
          else {
            return
          }
        }
        else if(_.contains(visitedworksteps,workstepname) && !_.contains(visitedrules,rulename) ){

                if(!_.contains(visitedrules,rulename))
                visitedrules.push(rulename)
                currentrule=_.find(rulebook,v=>{return v.rulename==rulename})
                currentworkstep=_.find(queues,v=>{return v.workstepname==workstepname})

                if(currentrule.type!='set')
                {
                    nextworkstep=_.find(queues,v=>{ return v.workstepname==currentrule.to})
                    if(nextworkstep.state!='end')
                    {

                        nextrules=nextworkstep.rules
                        nextrule=_.first(nextrules)
                        remaining=_.rest(nextrules)
                        if(remaining.length>0)
                        _.each(remaining,v=>{
                           pendings.push({workstepname:nextworkstep.workstepname,rulename:v})
                        })
                        traverse(nextworkstep.workstepname,nextrule)
                    }
                    else {
                            if(!_.contains(visitedworksteps,nextworkstep.workstepname))
                            visitedworksteps.push(nextworkstep.workstepname)
                            if(pendings.length>0)
                            {
                              nextpendingItem=_.first(pendings)
                              pendings=_.rest(pendings)
                              traverse(nextpendingItem.workstepname,nextpendingItem.rulename)
                            }
                            else {
                              return
                            }

                    }

                }
                else {
                  if(pendings.length>0)
                  {
                    nextpendingItem=_.first(pendings)
                    pendings=_.rest(pendings)
                    traverse(nextpendingItem.workstepname,nextpendingItem.rulename)
                  }
                  else {
                    return
                  }
                }
        }
        else{ return}

    }


    }
    catch(e){
      console.log(e)
    }
}

exports.validateFormatFn=function(obj){
  var retval={}
  var errArr=[]
  var isruleBookArrayFound
  var isruleBookentryFound
  var isruleBookentrydefined

      //convert to lowercase and if error report error
      try{

        var Str=JSON.stringify(obj)
        var lowerStr=Str.toLowerCase(Str)
        var lowerObj=JSON.parse(lowerStr)
        obj=lowerObj

      }
      catch(e){
         console.log(e)
         return {err:'invalid request'}
      }

  try{
              //check action tag is present
              if (!obj.action  )
                return {err:'action tag not found'}
              //check action tag must have value 'create' or 'update'
              if(obj.action!='create' && obj.action!='update')
                return {err:'action tag should have vale of create or update'}
              //check workspace tag is present
              if (!obj.workspace || obj.workspace==""  )
                return {err:'workspace tag is not defined'}
              //check process.name tag must have value
              if (!obj.process.name || obj.process.name==""  )
                  return {err:'process/name  tag  not defined'}
              //check process.queues tag must have value
              if (!obj.process.queues  )
                return {err:'process/queues tag not found'}
              //check process.rulebook tag must have value
              if (!obj.process.rulebook  )
                  return {err:'process/rulebook tag not found'}
              //queues must be an non empty array
              var isthisArray=_.isArray(obj.process.queues)
              console.log(isthisArray)
              if (!isthisArray )
                 return {err:'process/queues should be a non empty array '}
              //rulebook must be an non empty array
            if (!(_.isArray(obj.process.rulebook) ))
                    return {err:'process/rulebook should be a non empty array '}
              if (!(_.isArray(obj.process.queues) && obj.process.queues.length>0 ))
                 return {err:'process/queues should be an array with multiple items '}

                //rulebook must be an non empty array
                if (!(_.isArray(obj.process.rulebook) && obj.process.rulebook.length>0 ))
                   return {err:'process/rulebook should be a non empty array '}

                //all worksteps/rules should have valid keys

                var isAllPropertyFound=true
                var isAllStateValid
                var isAllhaveRules
                var startStateCount=0
                var endStateCount=0
                var isRuleDefined=true
                var isValidState=true

                _.each(obj.process.queues,q=>{
                          if(!(_.has(q, "workstepname") && _.has(q, "state") && _.has(q, "rules")  ))
                            { console.log(q)
                              isAllPropertyFound=false

                            }
                            var statevals=["start","end","decision","custom","split","join","set","expire"]
                            if( _.has(q, "state") && (!_.contains(statevals,q.state)))
                            isValidState=false
                            if('start' ===q.state)
                               startStateCount++
                               if('end' === q.state)
                                  endStateCount++
                                 var rulearrays= q.rules
                                 if ((q.state!='end') &&( !_.isArray(rulearrays) || (_.isArray(rulearrays) &&  rulearrays.length==0 )))
                                 {
                                   console.log(rulearrays)
                                   isRuleDefined=false
                                 }
                     })

              if(!isAllPropertyFound)
               return {err:'process/queues not all prop found'}

              if(startStateCount==0 || endStateCount==0 )
               return {err:'process/queues no start/end state is defined '}


              if(startStateCount>1  )
                return {err:'process/queues multple start state is defined '}

             if(!isRuleDefined)
              return {err:'not all rules are defined in process/queues  '}

             if(!isValidState)
             return {err:'not all worksteps have valid state in process/queues  '}

              //check for duplicate workstep name
              var gr=_.groupBy( obj.process.queues,v=>{return v.workstepname})
              var dupq=(_.find(gr,v=>{return v.length>1}))

               if(dupq)
               return {err:'process/queues has duplicate workstep name '}

               //check for rulebook

               var isAllRulePropertyFound=true
               var isAllRuleTypeFound=true
               var isAllhaveRulesR
               _.each(obj.process.rulebook,r=>{
                 if(!(_.has(r, "rulename") && _.has(r, "type")  ))
                   { console.log(r)
                     isAllRulePropertyFound=false
                   }

                   if(r.type=="decision" && (!_.has(r, "condition")))
                   {
                      console.log(r)
                      isAllRulePropertyFound=false

                   }

                   if(r.type=="decision" && _.has(r, "condition"))
                   {
                       if((r.condition!=="else" ) && (typeof(r.condition)!=='object'))
                       {
                         console.log(r.decision)
                         isAllRulePropertyFound=false
                       }


                   }
                   var ruletypevals=["auto","decision","split","join","set","expire"]
                   if( _.has(r, "type") && (!_.contains(ruletypevals,r.type)))
                   {
                     console.log(r)
                     isAllRuleTypeFound=false
                  }
                     //check each rule entry should be in rulebook array

               })
               if(!isAllRulePropertyFound)
               return {err:' some rules in process/rulebook dont have either type/rulename'}

               if(!isAllRuleTypeFound)
                return {err:' some rules in process/rulebook dont have valid rule type'}

                var grrl=_.groupBy(obj.process.rulebook,v=>{return v.rulename})
                var duprl=(_.find(grrl,v=>{return v.length>1}))
                if(duprl)
                 return {err:'process/rulebook has duplicate rule name '}

               //all rule in rulebook should be in queues or visa virsa
               var allworkstepnames=_.map(obj.process.queues,v=>{return v.workstepname})

                var allruletonames=_.map(obj.process.rulebook,v=>{return v.to})
                var allruleuniquetonames=_.unique(allruletonames)
                var isAllRuleToFound=true
                _.each(allruleuniquetonames,v=>{
                  if(!_.contains(allworkstepnames,v))
                  {
                    console.log(v)
                    isAllRuleToFound=false
                  }
                })
                if(!isAllRuleToFound)
                return {err:'some rule [to] field value is not found in queues/workstep'}



                var allrulesinQ=_.filter(_.flatten(_.map(obj.process.queues,v=>{return v.rules})),v=>{  return v != 'null'})
                //console.log(allrulesinQ)
                var allruleuniquenames =_.unique( _.map(obj.process.rulebook,v=>{return v.rulename}))
                var isAllQueueRulematched=true
                _.each(allrulesinQ,v=>{
                  if(!_.contains(allruleuniquenames,v))
                  {
                    console.log(v)
                    isAllQueueRulematched=false
                  }
                })
                if(!isAllQueueRulematched)
                return {err:'some rules in queus dont match with rulename in rulebook'}


                allworksteps=_.map(obj.process.queues,v=>{return v.workstepname})
                allrules=_.map(obj.process.rulebook,v=>{return v.rulename})


                runnext=_.find(obj.process.queues,v=>{ return v.state=='start'})

                 var nextrules=runnext.rules
                  var nextrule=_.first(nextrules)
                  var remaining=_.rest(nextrules)
                  if(remaining.length>0)
                  _.each(remaining,v=>{
                     pendings.push({workstepname:runnext.workstepname,rulename:v})
                  })
                  queues=obj.process.queues
                  rulebook=obj.process.rulebook
                  traverse(runnext.workstepname,nextrule)

                  var isallworkstepvisited=true
                  //console.log(allworksteps)
                  //console.log(visitedworksteps)

                  //console.log(allrules)
                  //console.log(visitedrules)

                _.each(allworksteps,v=>{
                      var isworkstepvisited=false
                    _.each(visitedworksteps,k=>{
                      if(v==k)
                      isworkstepvisited=true

                    })
                    if(!isworkstepvisited)
                    {
                      //console.log(v)
                      isallworkstepvisited=false
                    }

                })

                var isallrulevisited=true
                _.each(allrules,v=>{
                      var isrulevisited=false
                    _.each(visitedrules,k=>{
                      if(v==k)
                      isrulevisited=true

                    })
                    if(!isrulevisited)
                    {
                      //console.log(v)
                      isallrulevisited=false
                    }

                })
                if(!isallworkstepvisited && !isallrulevisited)
                return {err:'all workstep/rules are not covered'}

            return null

          }catch(e)
          {
            console.log(e)
            return {err:e}
          }

}

exports.getToLowerJSONFn=function(obj){

  try{

    var Str=JSON.stringify(obj)
    var lowerStr=Str.toLowerCase(Str)
    var lowerObj=JSON.parse(lowerStr)
    return lowerObj

  }
  catch(e){
     console.log(e)
     return null
  }
}

exports.validateDataFn=function(obj){

   return new Promise((resolve,reject)=>{
     Workspace.findOne({name:obj.workspace})
      .then(data=>{
        if(!data)
           throw new Promise.CancellationError('workspace not found');
           return ProcessInstance.findOne({workspace:data._id,name:obj.process.name})
      })
      .then(data=>{
        if(obj.action=="create" && data)
         throw new Promise.CancellationError('process name is taken');
         if(obj.action=="update" && (!data))
          throw new Promise.CancellationError('process with same name not found');

          var queueNames=_.map(obj.process.queues,v=>{ return obj.process.name+"@"+v.workstepname})
          console.log(data)
          return  Promise.all(queueNames).map(p=>Queue.findOne({queuename:p}))

      })
      .then(data=>{
         //var data=_.filter(data,v={return v!=null})

        data=_.filter(data,v=>{return !_.isNull(v)})
        console.log(data)
        if(obj.action=="create" && data.length>0)
         throw new Promise.CancellationError('some or all queue name {processname@workstepname} is already taken');
         //res.status(200).send({validate:true})
         resolve({validate:true})
      })
      .catch(Promise.CancellationError,e=>{
        //console.log('err:'+e)
        //return res.status(400).send({err:e.toString()})
        var badErrReq=new Promise.CancellationError(e.message.toString())
        reject(badErrReq)
      })
      .catch(err=>{
        console.log(err)
        var appErr=new Error(err.message.toString())
        reject(appErr)
      })


   })

}

exports.createProcessFn=function(obj){

  return new Promise((resolve,reject)=>{
      var workpace,ps,queues,rulebook
       debugger;
      return Workspace.findOne({name:obj.workspace})
              .then(data=>{
                if(!data)
                   throw new Promise.CancellationError('workspace not found');

                   workspace=data
                   var ps=new ProcessInstance({name:obj.process.name,state:'disabled',workspace:workspace._id})
                   workspace.processes.push(ps)
                   return Promise.all([workspace,ps]).map(p=>p.save())

              })
              .then(data=>{
                  if(!data)
                  throw new Promise.CancellationError('process not saved');
                  if(_.isArray(data) && data.length<1 )
                  throw new Promise.CancellationError('process not saved');
                  if(!data[0] || !data[1])
                  throw new Promise.CancellationError('process not saved');

                  workpace=data[0]
                  ps=data[1]
                  console.log('workspace:'+workspace)
                  console.log('process:'+ps)

                  queues=_.map(obj.process.queues,  q=>{
                    var tempQ= new Queue({queuename:obj.process.name+'@'+q.workstepname,
                                      workstepname:q.workstepname,state:q.state,
                                      ProcessInstance:ps._id,workspace:workspace._id,
                                      rules:q.rules})
                        return tempQ
                  })
                  console.log(queues)

                  return Promise.all(queues).map(p=>p.save())

              })
              .then(data=>{

                if(!data)
                throw new Promise.CancellationError('queues are not saved');
                if(_.isArray(data) && (data.length!==obj.process.queues.length ))
                throw new Promise.CancellationError('not all queues are saved');
                queues=data
                ps.queues=queues
                return ps.save()

              })
              .then(data=>{
                 if(!data)
                 throw new Promise.CancellationError('process is not resaved ');
                  ps=data
                  rulebook=_.map(obj.process.rulebook,r=>{
                  var inputdata={}
                        inputdata.rulename=r.rulename
                        inputdata.workspace=workspace._id
                        inputdata.ProcessInstance=ps._id

                    if(_.has(r,'condition'))
                       inputdata.condition=r.condition
                    if(_.has(r,'type'))
                          inputdata.type=r.type
                    if(_.has(r,'to'))
                    {
                        inputdata.to=r.to
                        var toQueue=_.find(queues,v=>{ return v.queuename==obj.process.name+'@'+inputdata.to})
                        inputdata.toqueue=toQueue._id

                    }
                    if(_.has(r,'action'))
                        inputdata.action=r.action


                    return new Rule(inputdata)
                  })

                  console.log(rulebook)

                  return Promise.all(rulebook).map(p=>p.save())

              })
              .then(data=>{

                if(!data)
                throw new Promise.CancellationError('rulebook is not saved');
                if(_.isArray(data) && (data.length!==obj.process.rulebook.length ))
                throw new Promise.CancellationError('not all rules are saved');

                rulebook=data
                ps.rulebook=rulebook
                return ps.save()

              })
              .then(data=>{
                if(!data)
                throw new Promise.CancellationError('process is not saved with rulebook');

                resolve(data)

              })
              .catch(Promise.CancellationError,e=>{

                var badErrReq=new Promise.CancellationError(e.message.toString())
                reject(badErrReq)
              })
              .catch(err=>{
                console.log(err)
                var appErr=new Error(err.message.toString())
                reject(appErr)
              })

  })
}

exports.getByNameFn=function(workspacename,processname){
  return new Promise((resolve,reject)=>{

      return Workspace.findOne({name:workspacename})
            .then(data=>{
                if(!data)
                 throw new Promise.CancellationError('workspace not found');

                 return ProcessInstance.findOne({name:processname,workspace:data._id})
                     .populate('queues')
                     .populate('workspace')
                     .populate('rulebook').exec()
            })
            .then(data=>{
              if(!data)
               throw new Promise.CancellationError('process not found');
                  resolve(data)
              })
            .catch(Promise.CancellationError,e=>{

              var badErrReq=new Promise.CancellationError(e.message.toString())
              reject(badErrReq)
            })
            .catch(err=>{

                var appErr=new Error(err.message.toString())
                reject(appErr)
              })
          })
}

exports.deleteProcessFn=function(workspacename,processname){
  return new Promise((resolve,reject)=>{
     var workspace,ps
      return Workspace.findOne({name:workspacename})
            .then(data=>{
                if(!data)
                 throw new Promise.CancellationError('workspace not found');
                 workspace=data
                 return ProcessInstance.findOne({name:processname,workspace:data._id}).exec()
            })
            .then(data=>{
              if(!data)
               throw new Promise.CancellationError('process not found');
                ps=data
                return Promise.all([
                  ProcessInstance.remove({name:ps.name,workspace:workspace._id}),
                  Queue.remove({ProcessInstance:ps._id,workspace:workspace._id}),
                  Rule.remove({ProcessInstance:ps._id,workspace:workspace._id}),
                ])
              })
              .then(_=>{
                resolve('data deleted successfully ')
              })
            .catch(Promise.CancellationError,e=>{

              var badErrReq=new Promise.CancellationError(e.message.toString())
              reject(badErrReq)
            })
            .catch(err=>{

                var appErr=new Error(err.message.toString())
                reject(appErr)
              })
          })
}
/*
module.exports={
  validateFormat:validateFormatFn,
  getToLowerJSON:getToLowerJSONFn,
  validateData:validateDataFn,
  createProcess:createProcessFn,
  getByName:getByNameFn,
  deleteProcess:deleteProcessFn
}
*/
