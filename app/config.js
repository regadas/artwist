const express = require('express')
    , echonest = require('echonest')
    , songkick = require('../lib/songkick');

module.exports = function(app) {

  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.set('echonest', new echonest.Echonest({
      api_key: process.env.ECHONEST_KEY
    }));
    app.set('songkick', new songkick({
      api_key: process.env.SONGKICK_KEY
    }));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });

  return app;
}
