'use strict';

angular.module('residentsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',,
  'ngTouch',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'angular-virtual-keyboard',
  'ui.bootstrap.pagination'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, VKI_CONFIG) {

    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    VKI_CONFIG['layout']['US International']['keys'] = [
        [['q', 'Q', '\u00e4', '\u00c4'], ['w', 'W', '\u00e5', '\u00c5'], ['e', 'E', '\u00e9', '\u00c9'], ['r', 'R', '\u00ae'], ['t', 'T', '\u00fe', '\u00de'], ['y', 'Y', '\u00fc', '\u00dc'], ['u', 'U', '\u00fa', '\u00da'], ['i', 'I', '\u00ed', '\u00cd'], ['o', 'O', '\u00f3', '\u00d3'], ['p', 'P', '\u00f6', '\u00d6'], ['Bksp', 'Bksp']],
        [['Caps', 'Caps'], ['a', 'A', '\u00e1', '\u00c1'], ['s', 'S', '\u00df', '\u00a7'], ['d', 'D', '\u00f0', '\u00d0'], ['f', 'F'], ['g', 'G'], ['h', 'H'], ['j', 'J'], ['k', 'K'], ['l', 'L', '\u00f8', '\u00d8'], ['Enter', 'Enter']],
        [['Shift', 'Shift'], ['z', 'Z', '\u00e6', '\u00c6'], ['x', 'X'], ['c', 'C', '\u00a9', '\u00a2'], ['v', 'V'], ['b', 'B'], ['n', 'N', '\u00f1', '\u00d1'], ['m', 'M', '\u00b5']],
        [[' ']]
    ];
    VKI_CONFIG.sizeAdj = false;

  })

  .factory('authInterceptor', function($rootScope, $q, $cookies, $injector, $location) {
    var state;
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401 && $location.path() !== '/admin') {
          (state || (state = $injector.get('$state'))).go('main');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $state, Auth, $http, socket) {
    // Redirect to login if route requires auth and the user is not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (next.authenticate) {
        Auth.isLoggedIn(function(loggedIn) {
          if (!loggedIn) {
            event.preventDefault();
            $state.go('main');
          }
        });
      }
    });

    $http.get('/api/config').then(function(response) {
      $rootScope.config = response.data;
      socket.syncUpdates('config', $rootScope.config, function(e, item, array) {
        $rootScope.config = item;
      });
    });

    $rootScope.$on('$destroy', function() {
      socket.unsyncUpdates('config');
    });

  })

  .directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);

                scope.$watch('fileread', function(file) {
                  if(!file) {
                    element[0].value = null;
                  } 
                });
            });
        }
    }
}])
.directive('sameAs', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {

      function validate(value) {
        var isValid = scope.$eval(attrs.sameAs) === value;
        console.log(isValid)
        ngModel.$setValidity('same-as', isValid);
        return isValid ? value : undefined;
      }

      ngModel.$parsers.unshift(validate);

      // Force-trigger the parsing pipeline.
      scope.$watch(attrs.sameAs, function() {
        ngModel.$setViewValue(ngModel.$viewValue);
      });
    }
  };
})

.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
})
