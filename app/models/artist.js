
const request = require('request');

var Artist = {}
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
  echonest.artist.search({ 
    name: name, 
    results: 1 , 
    bucket: 'id:songkick'
  }, function(error, response) {
    var status = response.status.code;
    if(error || status){
      //something wrong during request
      console.log(error, response);
      return callback(status, undefined);
    }
    var meta = response.artists[0]
      , sk = (function(){
        if(meta.foreign_ids[0]) {
          return meta.foreign_ids[0].foreign_id.split(':')[2];
        }
      })();
    callback(undefined, new Artist(meta.id, meta.name, sk));
  });
}

Artist.news = function(id, callback) {
  echonest.artist.news({ id: id, results: 1 }, function(error, response) {
    var status = response.status.code;
    //well diferent status could be retrieved from echonest
    // we will consider all of them besides 0 as errors
    if(error || status){
      //something wrong during request
      console.log(error, response);
      return callback(status, undefined);
    }
    var news = response.news[0]
    callback(undefined, news);
  });

}

//finds an artist for a given songkick id
//callback(error, data)
Artist.events = function(id, options, callback) {
  //the id required is a songkick id which is a 'number'
  if(isNaN(id)) {
    return callback({error: 'the id supplied is not a valid id'}, undefined);
  }

  //still ugly !! I should improve the lib for songkick.
  var pathname = 'artists/'+id+'/calendar.json';
  request({
    url: songkick.url(pathname, options),
    json:true
    }, function(error, response, body){
      if(!error && response.statusCode == 200) {
        var results = body.resultsPage.results
          , events = [];
        if(results){
          events = results.event;
        }
        callback(undefined, events);
      } else {
        callback({
          error: error,
          response: response
        }, undefined);
      }
  });
}
