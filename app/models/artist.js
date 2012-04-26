
var Artist = {}
  , app
  , echonest
  , songkick_key;

module.exports = function( _app ) {
  app = _app;
  echonest = app.set('echonest');
  return Artist;
}

Artist.find = function(name, callback) {
  echonest.artist.search({ name: name, results: 1 }, function(error, response) {
    if (error) { //fetch || connection error
      console.log(error, response);
    } else {
      callback(response.artists[0]);
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

}
