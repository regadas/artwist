
module.exports = function( app ) {
  echonest = app.set('echonest');

  app.get('/', function(req, res){
    res.render('index', { title: 'artwist' });
  });

  app.post('/artists', function(req, res){
  });

  app.get('/artist/events', function(req, res){
  });

}
