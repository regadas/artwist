var Event = require('events').EventEmitter
  , ArtistModel = require('./models/artist')
  , errors = require('./inner_errors.js');

module.exports = function( app ) {
  var Artist = ArtistModel( app );

  app.get('/', function(req, res){
    res.render('index', { title: 'artwist' });
  });

  app.post('/artists', function(req, res){
    var data = req.body
      , response = {
        error: null,
        results: []
      }
      , event = new Event();

    event.on('send', function() {
      res.json(response);
    });
    var timer = setTimeout(function() {
      event.emit('send', 2000);
    })
    , sendResult = function() {
      event.emit('send');
      clearTimeout(timer);
    };

    if(data.artists && data.artists instanceof Array && data.artists.length >= 5){
      var length = data.artists.length;

      data.artists.forEach(function(name){
        Artist.find(name, function(error, artist){
          if(!error){

            Artist.news(artist.id, function(error, news){
              artist['news'] = news;
              response.results.push(artist);
              if(response.results.length == length) sendResult();
            });

          } else {
            //append error to the element since this is a bulk fetch
            var result = {
              name: name,
              error: error
            };
            response.results.push({ name: name });
            if(response.results.length == length) sendResult();
          }
        });
      });
    } else { 
      response.error = errors.System("Oh Noes! no data provided");
      sendResult();
    }
  });

  app.get('/artist/:id/events', function(req, res){
    Artist.events(req.params.id, { per_page: 5 }, function(error, data){
      res.json({ events: data , error: error });
    });
  });


}
