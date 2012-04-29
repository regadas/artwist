Artwist = Ember.Application.create();

Artwist.GeneralMessage = Ember.View.extend({
  templateName: 'message',
  message: null,
  level: null,

  show: function () {
    this.appendTo('#message');
  },
  hide: function () {
    this.remove();
  }
});

Artwist.Message = Artwist.GeneralMessage.create({
  level: "alert alert-error",
  alert: function (message) {
    this.message = message;
    this.show();
  }
});

Artwist.Artist = Ember.Object.extend({
  id: null,
  songkick: null,
  name: null,
  news: null,
  events: null,
  //hack ... temporary till i see how ember 
  //can append a view to sepecifc elem on collection
  hasNoEvents: function() {
    if(this.get('events') instanceof Array && !this.get('events').length) {
      return true;
    }
    return false;
  }.property('events')
});

Artwist.ArtistController = Ember.ArrayProxy.create({
  content: [],

  createArtist: function(values) {
    var artist = Artwist.Artist.create(values);
    this.pushObject(artist);
  },

  fetchNews: function(values, callback){
    $.ajax({
      url: '/artists',
      type: 'POST',
      data: { "artists": values },
      success: function( data ) { callback(data); },
      error: function(data) { console.log(data); }
    });
  },

  fetchEvent: function(artist, callback) {
    if(artist.songkick){
      $.ajax({
        url: '/artist/'+artist.songkick+'/events',
        success: function( data ) { callback(data); },
        error: function(data) { console.log(data); }
      });
    } else {
      //TODO: not possible to fetch events since there isn't a map between echo & sk
    }
  }
});


Artwist.EventsButton = Ember.Button.extend({
  click: function(){
    var that = this
      , artist = that.get('artist');
    Artwist.ArtistController.fetchEvent(artist, function(data){
      //TODO: we should check for error to see if the mepty events are really empty
      artist.set('events', data.events);
      that.remove();
    });
  }
});

Artwist.SearchArtistsView = Ember.TextField.extend({
  insertNewline: function() {
    var that = this
      , value = that.get('value');

    if(value) {
      Artwist.Message.hide();
      var values = value.split(',').map(function(item, index, self) {
        match = item.match(/[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*/)
          if(match) { return match[0]; }
        }).filter(function(item){ 
          if(item) { return item; }
        });
      if(values.length >= 5) {
        //fetch info from server
        Artwist.ArtistController.fetchNews(values, function(data){
          if(!data.error){
            data.results.forEach(function(item){
              Artwist.ArtistController.createArtist(item);
            });
            that.set('value', '');
          } 
        });
      } else {
        Artwist.Message.alert("You have to provide at least 5 artist names!");
      }
    } else {
      Artwist.Message.alert("You have to provide at least 5 artist names!");
    }
  }
});
