// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('stedr', ['ionic', 'stedr.controllers', 'vjs.video', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      if (ionic.Platform.isAndroid()) {
        Statusbar.backgroundColorByHexString("#40B0D2");
      }

    }
  });
})

.filter('trustUrl', function($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  }
})

.constant('ApiEndpoint', {
  url: 'http://stedr-beta2.herokuapp.com'
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'PlacesMapCtrl'
        }
      }
    })

    .state('app.places', {
      url: '/places',
      views: {
        'menuContent': {
          templateUrl: 'templates/places.html',
          controller: 'PlacesCtrl'
        }
      }
    })

  .state('app.place', {
    url: '/places/:placeId',
    views: {
      'menuContent': {
        templateUrl: 'templates/place.html',
        controller: 'PlaceCtrl'
      }
    }
  })

  .state('app.story', {
    url: '/stories/:storyId',
    views: {
      'menuContent': {
        templateUrl: 'templates/story.html',
        controller: 'StoryCtrl'
      }
    }
  })

  .state('app.image', {
    url: '/images/:placeId/:placeTag',
    views: {
      'menuContent': {
        templateUrl: 'templates/image.html',
        controller: 'ImageCtrl'
      }
    }
  })

  .state('app.sound', {
    url: '/sounds/:placeId/:placeTag',
    views: {
      'menuContent': {
        templateUrl: 'templates/sound.html',
        controller: 'SoundCtrl'
      }
    }
  })

  .state('app.collections', {
    url: '/collections',
    views: {
      'menuContent': {
        templateUrl: 'templates/collections.html',
        controller: 'CollectionsCtrl'
      }
    }
  })

  .state('app.collection', {
    url: '/collections/:collectionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/collection.html',
        controller: 'CollectionCtrl'
      }
    }
  })

  .state('app.help', {
    url: '/help',
    views: {
      'menuContent': {
        templateUrl: 'templates/help.html',
        controller: 'HelpCtrl'
      }
    }
  })

  .state('app.help_tutorial', {
    url: '/help/tutorial',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-tutorial.html'
      }
    }
  })

  .state('app.help_about', {
    url: '/help/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-about.html'
      }
    }
  })

  .state('app.help_picture', {
    url: '/help/picture',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-add-picture.html'
      }
    }
  })

  .state('app.help_sound', {
    url: '/help/sound',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-add-sound.html'
      }
    }
  })

  .state('app.help_place', {
    url: '/help/place',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-add-place.html'
      }
    }
  })

  .state('app.help_collection', {
    url: '/help/collection',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-add-collection.html'
      }
    }
  })

  .state('app.help_tech_news', {
    url: '/help/tech_news',
    views: {
      'menuContent': {
        templateUrl: 'templates/help-tech-news.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/map');
});
