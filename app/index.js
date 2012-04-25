
/**
 * Module dependencies.
 */

const express = require('express')
    , config = require('./config')
    , routes = require('./routes')
    , errors = require('./errors');

// Configuration

module.exports = (function() {
  const app = express.createServer();

  config(app);

  routes(app);

  errors(app);

  return app;
})();
