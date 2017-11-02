var _=require('underscore')
var isJSON=function (p){

  try{
    JSON.parse(p)
    /*console.log(typeof(p))
    if(typeof(p)=='JSON')
      return true
    else {
      return false
    }
    */
  }
  catch(e)
  {
     console.log(e)
     return false
  }

}

module.exports=function(obj){
  var retval={}
  var errArr=[]
  var isruleBookArrayFound
  var isruleBookentryFound
  var isruleBookentrydefined

      //if((type of obj)!='Object') {return {err:'invalid request'}}
      if (!obj.action  )
        return {err:'action tag not found'}
      if(obj.action!='create' && obj.action!='update')
        return {err:'action tag should have vale of create or update'}
      if (!obj.workspace || obj.workspace==""  )
        return {err:'worspace tag value not found'}
        if (!obj.process.name || obj.process.name==""  )
          return {err:'process  tag  not define'}
      //if(isJSON(obj.process)!=true)
      //  return {err:'invalid process tag'}
      //if(isJSON(obj.process.queues)!=true) {return {err:'invalid process/queues tag'}}
      //if(isJSON(obj.process.rulebook)!=true) {return {err:'invalid process/rulebook tag'}}
      if (!obj.process.queues  )
        return {err:'process{queues:} tag not found'}
      if (!obj.process.rulebook  )
          return {err:'process{rulebook:} tag not found'}
      if (!(!_.isArray(obj.process.queues) && obj.process.queues.length>0 ))
         return {err:'process{queues:} is not defined'}

        }

        if (!(!_.isArray(obj.process.rulebook) && obj.process.rulebook.length>0 ))
           return {err:'process{rulebook:} is not defined'}

          }


          var dupWorksteps=_.filter(_.chain(obj.process.queues).groupBy('workstepname'),function(v){return v.length > 1}).flatten().value()
          if(dupWorksteps.length>0)
          return {err:'process{queues:} duplicate workstep/workstepname found in process/queues'}

          var workstepGroup=_.groupBy(obj.process.queues,v=>{return v.length>1})


          var isAllPropertyFound=true
          var isAllStateValid=false
          var isAllhaveRules=false
          var startStateCount=0
          var endStateCount=0,v=>
          var isRuleDefined

          _.each(process.queues,q=>{
            if(!(_.has(q, "workstepname") && _.has(q, "state") && _.has(q, "rules")  ))
              isAllPropertyFound=false

              if('start' ===q.state)
                 startStateCount++
                 if('end' === q.state)
                    endStateCount++
                   var rulearrays= q.rules
                   if(!(_.isArray(rulearrays) && rulearrays.length>0))
                        isRuleDefined=false

                //check each rule entry should be in rulebook array

          })

          if(!isRuleDefined)
          return {err:'process{queues:} not all queue rule array is is defined '}
          if(startStateCount==0 && endStateCount==0 )
          return {err:'process{queues:} no start/end state is defined '}

          if(startStateCount>1 || endStateCount>1 )
          return {err:'process{queues:} multple start/end state is defined '}


        if (!Array.isArray(obj.process.rulebook)  )
          return {err:'process{rulebook:} should be an array'}


        else if(obj.process.rulebook.length==0  ){
            return {err:'process{rulebook:} should not be empty'}

   return null

}
