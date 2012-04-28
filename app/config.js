const express = require('express')
    , echonest = require('echonest');

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
    app.set('songkick', { 
      api_key: process.env.SONGKICK_KEY,
      url: 'http://api.songkick.com/api/3.0'
    });
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });

  return app;
}
