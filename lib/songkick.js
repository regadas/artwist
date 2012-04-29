const request = require('request')
    , url = require('url')
    , qs = require('querystring');

Songkick = function(options) {
  this.api_key = options.api_key;
  this.version = options.version || '3.0';
  this.base_url = options.base_url || 'http://api.songkick.com/api';
};

Songkick.prototype.url = function(pathname, options) {
  var path = [this.base_url, this.version, pathname].join('/');
  options['apikey'] = this.api_key;

  var req_url = url.parse(path);
  req_url.search = qs.stringify(options);

  return url.format(req_url);
};

module.exports = Songkick;


