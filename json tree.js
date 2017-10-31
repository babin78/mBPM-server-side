{
  //create process
  //create  queues and associates with process & workspace
  //save queues
  //process add  queues
  //save routerules
  //update routetules to-->queueid
  
  id=1
  processname:'outward'
  , queuename:processname@workstepname, state:'enabled'
  workspace:'dummy',
  
  queues:[
      
      {queueid=2,workstepname:'work intrudoction' , queuename:processname@workstepname, , queuename:processname@workstepname, state:'start',ProcessInstance:1,workspace:'x',rules:['rule1']}//work-introduce
	  //{queueid=3,workstepname:'maker',, queuename:processname@workstepname, state:'custom',ProcessInstance:1,workspace:'x',rules:['rule1']},//maker
	  {queueid=4,workstepname:'decision1',, queuename:processname@workstepname, state:'decision',ProcessInstance:1,workspace:'x',rules:['rule3','rule4','rule5']},//decision1
	  {queueid=5,workstepname:'discard',, queuename:processname@workstepname, state:'end',ProcessInstance:1,workspace:'x',rules:NULL},//discard
	  {queueid=6,workstepname:'exit',, queuename:processname@workstepname, state:'end',ProcessInstance:1,workspace:'x',rules:NULL},//exit
	  {queueid=7,workstepname:'data-entry',, queuename:processname@workstepname, state:'custom',ProcessInstance:1,workspace:'x',rules:['rule2']},//data-entry
	  {queueid=8,workstepname:'ckecher',, queuename:processname@workstepname, state:'custom',ProcessInstance:1,workspace:'x',rules:['rule6']},//checker
	  {queueid=9,workstepname:'decision2',, queuename:processname@workstepname, state:'decision',ProcessInstance:1,workspace:'x',rules:['rule7','rule8','rule9']},//decision2
      {queueid=10,workstepname:'split',, queuename:processname@workstepname, state:'split',ProcessInstance:1,workspace:'x',rules:['rule10']},//split
      {queueid=11,workstepname:'join',, queuename:processname@workstepname, state:'join',ProcessInstance:1,workspace:'x',rules:['rule11']},//join
      {queueid=12,workstepname:'tech-verify',, queuename:processname@workstepname, state:'custom',ProcessInstance:1,workspace:'x',rules:['rule12']},//tech-verify
	  {queueid=13,workstepname:'filegenerate',, queuename:processname@workstepname, state:'custom',ProcessInstance:1,workspace:'x',rules:['rule13']},//filegenerate
      {queueid=14,workstepname:'readresponse',, queuename:processname@workstepname, state:'custom',ProcessInstance:1,workspace:'x',rules:['rule14']}//readresponse	  
	  
  ],
  
   routingrules:[
     {ruleid='1'rulename:'rule1',type:'auto',from:self,to: 4,toqueuename:processname+'@data entry' },//scan-->data entry
	 {ruleid='2'rulename:'rule2',type:'auto',from:self,to:4,toqueuename:processname+'@decision1'},//data entry-->decision1
	 {ruleid='3'rulename:'rule3',type:'decision',condition:{ $and:{ {amount>100},{acceptflag='accept'}}}, from:self,to:8,toqueuename:processname+'@checker'},//decision1-->checker
	 {ruleid='4'rulename:'rule4',type:'decision',condition: {discardflag='discard'}, from:self,to:5,toqueuename:processname+'@discard'},//decision1-->discard
	 {ruleid='5'rulename:'rule5',type:'decision',condition: else, from:self,to:4,toqueuename:processname+'@datanetry'},////decision1-->prev(data entry)
	 
	 {ruleid='6'rulename:'rule6',type:'auto',from:self,to:9,toqueuename:processname+'decision2'},//checker-->decision2
	 {ruleid='7'rulename:'rule7',type:'decision',condition:{acceptflag='accept'}, from:self,to:10,toqueuename:processname+'@split'},//decision2-->split
	 {ruleid='8'rulename:'rule8',type:'decision',condition: {discardflag='discard'}, from:self,to:5,toqueuename:processname+'@discard'},//decision2-->discard
	 {ruleid='9'rulename:'rule9',type:'decision',condition: else, from:self,to:8,toqueuename:processname+'@checker'},////decision2-->prev(checker)
	 
	 {ruleid='10'rulename:'rule10',type:'split',from:self,to:12,toqueuename:processname+'@techvieryfy'},//split-->techverify
	 {ruleid='11'rulename:'rule11',type:'split',from:self,to:13,toqueuename:processname+'@filegen'},//split-->file-gen
	 {ruleid='12'rulename:'rule12',type:'auto',from:self,to:11,toqueuename:processname+'@join'},//tech-->join
	 {ruleid='13'rulename:'rule13',type:'auto',from:self,to:14,toqueuename:processname+'@read-response'},//filegen-->read-response
	 {ruleid='14'rulename:'rule14',type:'auto',from:self,to:11,toqueuename:processname+'@join'},//read-response-->join
     {ruleid='15'rulename:'rule14',type:'auto',from:self,to:11,toqueuename:processname+'@exit'},//join-->Exit 	 
	 
   ]
  
     
}