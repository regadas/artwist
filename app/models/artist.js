
var request = require('request')
  , Artist = {}
  , app
  , echonest
  , songkick;

module.exports = function( _app ) {
  app = _app;
  echonest = app.set('echonest');
  songkick = app.set('songkick');
  return Artist;
}

Artist = function(id, name, songkick) {
  this.id = id;
  this.name = name;
  this.songkick = songkick;
};

Artist.find = function(name, callback) {
  echonest.artist.search({ name: name, results: 1 , bucket: 'id:songkick'}, function(error, response) {
    if (error) { //fetch || connection error
      console.log(error, response);
    } else {
      var meta = response.artists[0]
        , sk = (function(){
          if(meta.foreign_ids[0]) {
            return meta.foreign_ids[0].foreign_id.split(':')[2];
          }
        })();
      callback(new Artist(meta.id, meta.name, sk));
    }
  });
}

Artist.news = function(id, callback) {
  echonest.artist.news({ id: id, results: 1 }, function(error, response) {
    if(error){
      console.log(error, response);
    } else {
      var status = response.status.code;
      switch(status) {
        case 0:
          var news = response.news[0]
          callback(status, news);
          break;
        default:
          callback(status, undefined);
      }
    }
  });

}

Artist.events = function(id, callback) {
  request({
    //ugly as hell!! we should make a lib for songkick.
    url: songkick.url+'/artists/'+id+'/calendar.json?apikey='+songkick.api_key+'&per_page=10',
    json:true
    }, function(error, response, body){
      if(!error && response.statusCode == 200) {
        var results = body.resultsPage.results
          , events = [];
        if(results){
          events = results.event;
        }
        callback(events);
      } else {
        console.log(response);
      }
  });
}
