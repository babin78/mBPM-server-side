var _=require('underscore')


try{

  var queues=[

  				  //{workstepname:'work intrudoction' , state:'start',rules:['rule1']},
            //{workstepname:'work intrudoction' , state:'start',rules:['rule2']},
            //{workstepname:'work intrudoction', STate:'STart',rules:[""]},  //
            {workstepname:'Work intrudoction', STATE:'Start',rules:["rule1"]},
            {workstepname:'decision1', state:'decision',rules:['rule3','rule4','rule5','rule15']},
  				  {workstepname:'discard', state:'end',rules:'NULL'},
  				  {workstepname:'exit', state:'end',rules:'NULL'},
  				  {workstepname:'data-entry', state:'custom',rules:['rule2']},
  				  {workstepname:'checker', state:'custom',rules:['rule6']},
  				  {workstepname:'decision2', state:'decision',rules:['rule7','rule8','rule9']},
  				  {workstepname:'split', state:'split',rules:['rule10']},
  				  {workstepname:'join', state:'join',rules:['rule11']},
  				  {workstepname:'tech-verify', state:'custom',rules:['rule12']},
  				  {workstepname:'filegenerate', state:'custom',rules:['rule13']},
  				  {workstepname:'readresponse', state:'custom',rules:['rule14']}

  			  ]

var          rulebook=[

          				 {rulename:'rule1',type:'auto',to:'data-entry' },
          				 {rulename:'rule2',type:'auto',to:'decision1'},
          				 {rulename:'rule3',type:'decision',condition:{ $and:[ {$gt:{amount:100}},{acceptflag:'accept'}]}, to:'checker'},
                   {rulename:'rule15',type:'decision',condition:{acceptflag:'accept'}, to:'split'},
                   {rulename:'rule4',type:'decision',condition: {discardflag:'discard'},to:'discard'},
          				 {rulename:'rule5',type:'decision',condition: 'else', to:'data-entry'},

          				 {rulename:'rule6',type:'auto',to:'decision2'},
          				 {rulename:'rule7',type:'decision',condition:{acceptflag:'accept'}, to:'split'},
          				 {rulename:'rule8',type:'decision',condition: {discardflag:'discard'}, to:'discard'},
          				 {rulename:'rule9',type:'decision',condition: 'else', to:'checker'},

          				 {rulename:'rule10',type:'split',to:'tech-verify'},
          				 {rulename:'rule11',type:'split',to:'filegenerate'},
          				 {rulename:'rule12',type:'auto',to:'join'},
          				 {rulename:'rule13',type:'auto',to:'readresponse'},
          				 {rulename:'rule14',type:'auto',to:'join'},
          				 {rulename:'rule16',type:'auto',to:'exit'}

          			   ]


var Str=JSON.stringify(queues)
var lowerStr=Str.toLowerCase(Str)
var lowerObj=JSON.parse(lowerStr)
 queues=lowerObj

 Str=JSON.stringify(rulebook)
 lowerStr=Str.toLowerCase(Str)
 lowerObj=JSON.parse(lowerStr)
  rulebook=lowerObj
//console.log(lowerObj)
}
catch(e){
  console.log(e)

}

/*

var allworkstepnames=_.map(queues,v=>{return v.workstepname})

var allruletonames=_.map(rulebook,v=>{return v.to})
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
console.log('some rule [to] field value is not found in queues/workstep')


var allrulesinQ=_.filter(_.flatten(_.map(queues,v=>{return v.rules})),v=>{  return v != 'null'})
//console.log(allrulesinQ)
var allruleuniquenames =_.unique( _.map(rulebook,v=>{return v.rulename}))
var isAllQueueRulematched=true
_.each(allrulesinQ,v=>{
  if(!_.contains(allruleuniquenames,v))
  {
    console.log(v)
    isAllQueueRulematched=false
  }
})
if(!isAllQueueRulematched)
console.log('some rules in queus dont match with rulename in rulebook')



//queues=""
        if (!_.isArray(queues) || (_.isArray(queues) &&  queues.length==0 ))
        {   console.log('queue is not an valid item')
            process.exit(0)
        }

        var gr=_.groupBy(queues,v=>{return v.workstepname})
        //console.log(_.isArray(queues) && queues.length>0  )

        var dupq=(_.find(gr,v=>{return v.length>1}))
        //console.log(dupq)
        if(dupq)
        {   console.log('queue has duplicate entry')
            process.exit(0)
        }

        var isAllPropertyFound=true
        var isAllStateValid
        var isAllhaveRules
        var startStateCount=0
        var endStateCount=0
        var isRuleDefined=true
        var isValidState=true

        _.each(queues,q=>{
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

              //check each rule entry should be in rulebook array

        })

        if(!isAllPropertyFound)
          console.log('not all prop found')
        if(startStateCount==0 || endStateCount==0 )
        console.log('process{queues:} no start/end state is defined ')

        if(startStateCount>1  )
        console.log('process{queues:} multple start state is defined ')
       if(!isRuleDefined)
       console.log('process{queues:} rules not defined ')
       if(!isValidState)
       console.log('invalid state')


       if (!_.isArray(rulebook) || (_.isArray(rulebook) &&  rulebook.length==0 ))
       {   console.log('rulebook is not an valid item')
           process.exit(0)
       }

       var grrl=_.groupBy(rulebook,v=>{return v.rulename})
       //console.log(_.isArray(queues) && queues.length>0  )

       var duprl=(_.find(grrl,v=>{return v.length>1}))
       //console.log(dupq)
       if(duprl)
       {   console.log('rulebook has duplicate entry')
           process.exit(0)
       }


       var isAllRulePropertyFound=true
       var isAllRuleTypeFound=true
       var isAllhaveRulesR


       _.each(rulebook,r=>{


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
       console.log('all rules dont  have either type/rulename')
       if(!isAllRuleTypeFound)
       console.log('all rules dont  have valid type')
*/
