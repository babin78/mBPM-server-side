const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});

myEmitter.on('uncaughtException', function (err) {
    console.error(err);
});

module.exports = myEmitter;
