var mongoose = require('mongoose');
var config=require('./config')
var Promise=require('bluebird')
mongoose.Promise =Promise
mongoose.connect(config.dbURL, config.mongo.options)

var NodeSchema = new mongoose.Schema({
    friend: {type: mongoose.Schema.Types.ObjectId, ref: 'Node'},
    name: String
});

var autoPopulateChildren = function(next) {
    this.populate('friend');
    next();
};

NodeSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

var Node = mongoose.model('Node', NodeSchema)

var user1=new Node({name:'A'})
var user2=new Node({name:'B'})
var user3=new Node({name:'C'})
var user4=new Node({name:'D'})
var user5=new Node({name:'E'})

user1.friend=user2._id
user2.friend=user3._id
user3.friend=user4._id
user4.friend=user5._id

Node.remove({})
.then(Promise.all([user5,user4,user3,user2,user1].map(p=>p.save())))
.then(_=>Node.findOne({name:'A'}))
.then(r=>{
  var nt=r
  while(nt)
  {
    console.log(nt.name)
    nt=nt.friend
  }

}) // foo
