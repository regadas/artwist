Artwist = Ember.Application.create();

Artwist.Message = Ember.View.create({
  templateName: 'message',
  message: null,
  level: null,
  alert: function (message) {
    this.message = message;
    this.level = "alert";
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
  name: null,
  url: null,
  news: [],
  events: []
});

Artwist.ArtistController = Ember.ArrayProxy.create({
  content: [],

  createArtist: function(values) {
    var artist = Artwist.Artist.create(values);
    this.pushObject(artist);
  },

  clear: function() {
    this.forEach(this.removeObject, this.content);
  }
});

Artwist.ArtistsView = Ember.View.extend({

});

Artwist.SearchArtistsView = Ember.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

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
        values.forEach(function(item){
          Artwist.ArtistController.createArtist({name: item});
        });
      } else {
        Artwist.Message.alert("You have to provide at least 5 artist names!");
      }
    } else {
      Artwist.Message.alert("You have to provide at least 5 artist names!");
    }
  }
});
