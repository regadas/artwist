Artwist = Ember.Application.create();

Artwist.Message = Ember.View.create({
  templateName: 'message',
  message: null,
  level: null,
  alert: function (message) {
    this.message = message;
    this.level = "alert alert-error";
    this.show();
  },

  show: function () {
    this.appendTo('#message');
  },
  hide: function () {
    this.remove();
  }
});

Artwist.Artist = Ember.Object.extend({
  id: null,
  songkick: null,
  name: null,
  news: [],
  events: []
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
      success: function( data ) {
        callback(data);
      },
      error: function(data) { console.log(data); }
    });
  },

  fetchEvent: function(artist, callback) {
    $.ajax({
      url: '/artist/'+artist.songkick+'/events',
      success: function( data ) {
        artist.set('events', data.events);
        callback(data);
      },
      error: function(data) { console.log(data); }
    });
  }
});

Artwist.EventsButton = Ember.Button.extend({
  click: function(){
    var that = this
      , artist = that.get('artist');
    Artwist.ArtistController.fetchEvent(artist, function(data){
      if(data) {
        that.remove();
      } else {
        //TODO: show no data message;
      }
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
          if(data){
            data.forEach(function(item){
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
