module.exports = function(app){

  function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
  }

  NotFound.prototype.__proto__ = Error.prototype;

  app.all('*', function(req, res, next) {
     throw new NotFound;
  });

  app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
      res.render('404.jade');
    } else {
      next(err);
    }
  });

  app.error(function(err, req, res){
    console.log(err);
    res.render('500.jade', {
      error: err
    });
  });

  return app;
}
