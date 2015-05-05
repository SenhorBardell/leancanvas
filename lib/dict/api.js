// Generated by CoffeeScript 1.9.0
(function() {
  var API;

  API = (function() {
    function API() {}

    API.prototype.search = function(loader, query, page, success, error) {
      return loader.sendrequest("get", "/api/search?q=" + query + "&p=" + page, {}, null, success, error);
    };

    API.prototype.like = function(loader, albumid, success, error) {
      return loader.sendrequest("get", "/api/like?albumid=" + albumid, {}, null, success, error);
    };

    API.prototype.dislike = function(loader, albumid, success, error) {
      return loader.sendrequest("get", "/api/dislike?albumid=" + albumid, {}, null, success, error);
    };

    API.prototype.reset = function(loader, albumid, success, error) {
      return loader.sendrequest("get", "/api/reset?albumid=" + albumid, {}, null, success, error);
    };

    API.prototype.myalbums = function(loader, success, error) {
      return loader.sendrequest("get", "/api/myalbums", {}, null, success, error);
    };

    return API;

  })();

  if (this.api == null) {
    this.api = new API;
  }

}).call(this);