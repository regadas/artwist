var Event = require('events').EventEmitter;

module.exports = function( app ) {
  echonest = app.set('echonest');

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
      event.emit('send', 1000);
    });

    if(data.artists && data.artists instanceof Array && data.artists.length >= 5){
      var length = data.artists.length;

      data.artists.forEach(function(name){
        echonest.artist.news({ name: name, results: 1 }, function(error, response) {
          if (error) { //fetch || connection error
            console.log(error, response);
          } else {
            switch(response.status.code) {
              case 0:
                var news = response.news[0] //TODO: test this stuff
                //considering json views a la scala ...humm
                results.push({
                  name: name,
                  status: 0,
                  news: {
                    title: news.name,
                    url: news.url,
                    summary: news.summary,
                  }
                });
                break;
              default:
                results.push({
                  name: name,
                  status: response.status.code
                });
            }
            if(results.length == length) {
              //consider websockets ?
              event.emit('send');
              clearTimeout(timer);
            }
          }
        });
      });

    }
  });

  app.get('/artist/events', function(req, res){
  });

}
