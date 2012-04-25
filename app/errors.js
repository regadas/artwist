module.exports = function(app){

  function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
  }

  NotFound.prototype.__proto__ = Error.prototype;

  app.error(function(err, req, res, next){
      if (err instanceof NotFound) {
          res.render('404');
      } else {
          next(err);
      }
  });

  app.error(function(err, req, res){
    console.log(err);
    res.render('500', {
      error: err
    });
  });

  return app;
}
