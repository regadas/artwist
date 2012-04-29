
const request = require('request')
    , errors = require('../inner_errors');

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
    if(error || (response && response.status.code)){
      //something wrong during request
      return callback(errors.System(), undefined);
    }
    var meta = response.artists[0]
      , sk = function(){
        if(meta.foreign_ids && meta.foreign_ids[0]) {
          return meta.foreign_ids[0].foreign_id.split(':')[2];
        }
      };
    if(!meta) {
      return callback(errors.NotFound("Oh Noes! we didn't find a artist"), undefined)
    }
    callback(undefined, new Artist(meta.id, meta.name, sk()));
  });
}

//we could provide an options argument here to pass options to the request
Artist.news = function(id, callback) {
  echonest.artist.news({ id: id, results: 1 }, function(error, response) {
    if(error || (response && response.status.code)){
      //something wrong during request
      console.log(error, response);
      return callback(errors.System(), undefined);
    }
    callback(undefined, response.news || []);
  });

}

//finds an artist for a given songkick id
//callback(error, data)
Artist.events = function(id, options, callback) {
  //the id required is a songkick id which is a 'number'
  if(isNaN(id)) {
    //return a regular not found
    return callback(errors.NotFound("Wrong if format"), undefined);
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
        if(results && results.event){
          events = results.event;
        }
        callback(undefined, events);
      } else {
        callback(errors.System(), undefined);
      }
  });
}
