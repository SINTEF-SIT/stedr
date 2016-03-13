angular.module('stedr.services', ['ngCordova'])


.factory('Place', function($http, $q, ApiEndpoint) {
  var places;

  var inArray = function(item) {
    for (var i = 0; i < places.length; i++) {
      if (item.id == places[i].id) {
        return true;
      }
    }
    return false;
  }

  return {
    list: function(refresh) {
      var deferred = $q.defer();

      if(!places || refresh) {
        places = [];
        $http.get(ApiEndpoint.url + '/places.json').then(function(response) {
          for(var i = 0; i < response.data.length; i++) {
            var item = response.data[i];
            if (!inArray(item)) {
              places.push(item);
            }
          }
          deferred.resolve(places);
        });
      } else {
        deferred.resolve(places);
      }

      return deferred.promise;
    },
    get: function(id) {
      for(var i = 0; i < places.length; i++) {
        if(places[i].id == id) {
          return places[i];
        }
      }
    }
  };
})


.factory('Story', function ($http, $q, ApiEndpoint) {
  var stories;

  return {
    list: function(id, collection) {
      var deferred = $q.defer();
      var url = '/stories.json?placeId=';
      if(collection) {
        url = '/getCollection.json?tag=';
      }

      $http.get(ApiEndpoint.url + url + id).then(function(response) {
        for(var i = 0; i < response.data.length; i++) {
          var img = response.data[i].pictures;
          response.data[i].id = i;
          if(img.length > 0) {
            response.data[i].featuredImage = img[0];
          } else {
            response.data[i].featuredImage = "";
          }
        }
        stories = response.data;

        deferred.resolve(stories);
      });

      return deferred.promise;
    },
    get: function(id) {
      for(var i = 0; i < stories.length; i++) {
        if (stories[i].id == id) {
          return stories[i];
        }
      }
    }
  }
})


.factory('Image', function ($http, $q, ApiEndpoint) {
  var images;

  return {
    list: function(placeTag) {
      var deferred = $q.defer();

      $http.get(ApiEndpoint.url + '/images.json?tag=' + placeTag).then(function(response) {
        images = response.data;

        for (var i = 0; i < images.length; i++) {
          images[i].id = i;
        }

        deferred.resolve(images);
      });

      return deferred.promise;
    },
    get: function(id) {
      return images[id];
    }
  }
})

.factory('Sound', function ($http, $q, ApiEndpoint) {
  var sounds;

  return {
    list: function(placeTag) {
      var deferred = $q.defer();

      $http.get(ApiEndpoint.url + '/sounds.json?tag=' + placeTag).then(function(response) {
        sounds = response.data;

        for (var i = 0; i < sounds.length; i++) {
          sounds[i].id = i;
        }

        deferred.resolve(sounds);
      });

      return deferred.promise;
    },
    get: function(id) {
      return sounds[id];
    }
  }
})

.factory('TwitterApp', function($q, $cordovaAppAvailability, $cordovaDevice) {
  var appInstalled = false;
  var hasChecked = false;

  return {
    isAvailable: function() {
      var deferred = $q.defer();
      if (hasChecked) {
        deferred.resolve(appInstalled);
      }

      var link = "";
      if (window.cordova) {
        if($cordovaDevice.getPlatform() === 'iOS') {
          link = "twitter://";
        } else if ($cordovaDevice.getPlatform() === 'Android') {
          link = "com.twitter.android";
        }


        $cordovaAppAvailability.check(link).then(function() {
          appInstalled = true;
          hasChecked = true;
          deferred.resolve(appInstalled);
        }, function() {
          appInstalled = false;
          hasChecked = true;
          deferred.resolve(appInstalled);
        });
      } else {
        deferred.resolve(false);
      }

      return deferred.promise;
    },
    createLink: function(tag, url) {
      var link = "";
      if(device.Platform === 'iOS') {
        link = "twitter://";
      } else if (device.Platform === 'Android') {
        link = "com.twitter.android";
      }

      link += '/intent/tweet?url=' + url + '&hashtags=' + tag;

      return link;
    }
  }
})

.factory('Collection', function($http, $q, ApiEndpoint) {
  var collections;

  return {
    list: function(placeTag) {
      var deferred = $q.defer();

      $http.get(ApiEndpoint.url + '/listCollections.json').then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].id = i;

          var img = response.data[i].pictures;
          response.data[i].id = i;
          if(img.length > 0) {
            response.data[i].featuredImage = img[0];
          } else {
            response.data[i].featuredImage = "";
          }
        }

        collections = response.data;

        deferred.resolve(collections);
      });

      return deferred.promise;
    },
    get: function(id) {
      return collections[id];
    }
  }
})
