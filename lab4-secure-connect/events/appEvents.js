const EventEmitter = require('events');

class AppEvents extends EventEmitter {}

// Single shared emitter for the whole app
module.exports = new AppEvents();