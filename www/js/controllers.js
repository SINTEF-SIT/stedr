angular.module('stedr.controllers', ['stedr.services', 'ngCordova', 'ksSwiper'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('PlacesCtrl', function($scope, Place) {
  $scope.places = [];
  Place.list().then(function(places) {
    $scope.places = places;
  });
})

.controller('PlacesMapCtrl', function($scope, $state, $cordovaGeolocation, Place) {
  $scope.places = [];
  var markers = [];

  $scope.loading = true;

  var mapOptions = {
    center: new google.maps.LatLng(52.316523, 5.259705),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: false,
    styles: [{
      featureType:"poi",
      stylers: [{
        visibility: "off"
      }]
    }]
  };

  $scope.$on('$ionicView.loaded', function() {
    ionic.Platform.ready(function() {
      if (navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
    });
  });

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  var deleteMarkers = function() {
    clearMarkers();
    markers = [];
  }

  var loadPlaces = function(refresh) {
    Place.list(refresh).then(function(places) {
      var infoWindow = new InfoBubble({
        content: 'This item has no title',
        padding: 0,
        overflowY: 'hidden',
        borderRadius: 0,
        hideCloseButton: true,
      });

      for(var i = 0; i < places.length; i++) {
        var place = places[i];
        var latLng = new google.maps.LatLng(place.latitude, place.longitude);

        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });

        markers.push(marker);

        var content = '<a href="#/app/places/' + place.id + '"><div class="mapMarker"><span class="title">' + place.title + '</span><img src="' + place.thumbnailUrl + '" /></div></a>';

        google.maps.event.addListener(marker, 'click', (function (marker, content, infoWindow) {
          return function() {
            infoWindow.setContent(content);
            infoWindow.open($scope.map, marker);
          };
        })(marker, content, infoWindow));

        google.maps.event.addListener($scope.map, 'click', function() {
          infoWindow.close();
        });
      }

      $scope.loading = false;
    });
  }

  loadPlaces(false);

  $scope.refresh = function() {
    deleteMarkers();
    $scope.loading = true;
    loadPlaces(true);
  }

  var options = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  var toMe = function() {
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      $scope.map.setCenter(latLng);
    }, function(error) {
      console.log("Could not get location");
    });
  }

  toMe();

  $scope.toMe = function() {
    toMe();
  }
})

.controller('PlaceCtrl', function($scope, $stateParams, $window, $ionicLoading, Place, Story, Image, Sound) {
  var id = $stateParams.placeId;

  $scope.place = Place.get(id);
  $scope.loading = true;
  var storiesLoaded = false;
  var imagesLoaded = false;
  var soundsLoaded = false;

  var loadingFinished = function() {
    if (storiesLoaded && imagesLoaded && soundsLoaded) {
      $scope.loading = false;
    }
  }

  Story.list(id).then(function(stories) {
    $scope.stories = stories;
    storiesLoaded = true;
    loadingFinished();
  })

  var tag = JSON.parse(JSON.stringify($scope.place.title));
  tag = 'stedr_' + tag.replace(/a+\?/gi, "å").replace(/00oe/g, "ø").replace(/00ae/g, "æ").replace(/00OE/g, "Ø").replace(/00AE/g, "Æ").replace(/00aa/g, "å").replace(/00AA/g, "Å").replace(/ /g, "_");
  
  console.log("TAG: ", tag);
  
  Image.list(tag).then(function(images) {
    $scope.images = images;
    imagesLoaded = true;
    loadingFinished();
  })

  Sound.list(tag).then(function(sounds) {
    $scope.sounds = sounds;
    soundsLoaded = true;
    loadingFinished();
  })

  var width = ($window.innerWidth * 0.44);

  $scope.cardHeight = width + 'px';
  $scope.cardTitle = (width / 4) + 'px';
})

.controller('StoryCtrl', function($scope, $stateParams, $window, $sce, Story) {
  var id = $stateParams.storyId;

  $scope.story = Story.get(id);

  $scope.hasVideo = function(videos) {
    return !(videos.length == 0);
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  var mediaType = function(url) {
    if (url.indexOf("youtube.com") > -1) {
      return 'video/youtube';
    } else if (url.indexOf(".mp4") > -1) {
      return 'video/mp4';
    } else if (url.indexOf(".webm") > -1) {
      return 'video/webm';
    } else if (url.indexOf(".ogg") > -1) {
      return 'video/ogg';
    } else if(url.indexOf("vimeo.com") > -1) {
      return 'video/vimeo';
    }
  }

  $scope.videos = [];

  $scope.isYoutube = function(wrapper) {
    var url = wrapper.url;
    return 'video/youtube' == mediaType(url);
  }

  $scope.youtubeSrc = function(wrapper) {
    var url = wrapper.url;

    var id = urlParser.parse(url).id;
    return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + id);
  }

  $scope.isVimeo = function(wrapper) {
    var url = wrapper.url;
    return 'video/vimeo' == mediaType(url);
  }

  $scope.vimeoSrc = function(wrapper) {
    var url = wrapper.url;

    var id = urlParser.parse(url).id;
    return $sce.trustAsResourceUrl("https://player.vimeo.com/video/" + id);
  }

  $scope.isHtmlVideo = function(wrapper) {
    var url = wrapper.url;
    var type = mediaType(url);
    if (type == 'video/mp4') {
      return true;
    } else if (type == 'video/webm') {
      return true;
    } else if (type == 'video/ogg') {
      return true;
    }

    return false;
  }

  for(var i = 0; i < $scope.story.videos.length; i++) {
    var url = $scope.story.videos[i];
    if (url) {
      var wrapper = {};
      wrapper.url = url;
      var videoDef = {};
      videoDef.sources = [{
        src: url,
        type: mediaType(url)
      }];

      if (mediaType(url) == 'video/youtube') {
        videoDef.techOrder = ["youtube"];
        wrapper.youtube = '{"techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "' + url + '"}]}';
      }

      wrapper.video = videoDef;

      $scope.videos.push(wrapper);
    }
  }

  $scope.width = $window.innerWidth;

})

.controller('ImageCtrl', function($scope, $stateParams, Place, Image) {
  var tag = $stateParams.placeTag;
  var id = $stateParams.placeId;

  $scope.place = Place.get(id);
  $scope.image = Image.get(tag);
})

.controller('SoundCtrl', function($scope, $stateParams, Place, Sound) {
  var tag = $stateParams.placeTag;
  var id = $stateParams.placeId;

  $scope.place = Place.get(id);
  $scope.sound = Sound.get(tag);
  $scope.image = $scope.sound.artworkURL.replace("-large", "-t500x500");
})

.controller('CollectionsCtrl', function($scope, Collection) {
  $scope.collections = [];
  $scope.loading = true;

  Collection.list().then(function(collections) {
    $scope.collections = collections;
    $scope.loading = false;
  });
})

.controller('CollectionCtrl', function($scope, $stateParams, $window, Collection, Story) {
  var id = $stateParams.collectionId;

  $scope.collection = Collection.get(id);
  $scope.loading = true;

  var tag = 'collection_' + $scope.collection.title.replace(/ /gi,"_");

  Story.list(tag, true).then(function(stories) {
    $scope.stories = stories;
    $scope.loading = false;
  })

  var width = ($window.innerWidth * 0.44);

  $scope.cardHeight = width + 'px';
  $scope.cardTitle = (width / 4) + 'px';
})

.controller('HelpCtrl', function($scope, $window) {
  var width = ($window.innerWidth * 0.44);

  $scope.cardHeight = width + 'px';
  $scope.cardTitle = (width / 4) + 'px';
});
