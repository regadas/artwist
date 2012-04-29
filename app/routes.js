var Event = require('events').EventEmitter
  , ArtistModel = require('./models/artist');

module.exports = function( app ) {
  var Artist = ArtistModel( app );

  app.get('/', function(req, res){
    res.render('index', { title: 'artwist' });
  });

  app.post('/artists', function(req, res){
    var data = req.body
      , results = []
      , event = new Event();

    event.on('send', function() {
      res.json(results);
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
          if(artist){
            Artist.news(artist.id, function(error, news){
              var result = artist;
              if(!error){
                artist['news'] = {
                  title: news.name,
                  url: news.url,
                  summary: news.summary,
                };
              }
              results.push(result);
              if(results.length == length) sendResult();
            });
          } else { 
            results.push({ name: name });
            if(results.length == length) sendResult();
          }
        });
      });
    } else { sendResult() }
  });

  app.get('/artist/:id/events', function(req, res){
    Artist.events(req.params.id, { per_page: 5 }, function(error, data){
      res.json({ events: data });
    });
  });


}
