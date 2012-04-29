const util = require('util');

ModelError = function(code, message) {
  this.code = code;
  Error.call(this, message);
  Error.captureStackTrace(this, arguments.callee);
  util.log(message);
};

ModelError.prototype.__proto__ = Error.prototype

module.exports = (function(){
  return {
    System: function(msg) {
      msg = msg || 'something bad happen';
      return new ModelError(-1, msg)
    },
    NotFound: function(msg){
      return new ModelError(1, msg);
    }
  };
})();
