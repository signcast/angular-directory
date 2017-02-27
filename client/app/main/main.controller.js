'use strict';

angular.module('residentsApp')
  .controller('MainCtrl', function($scope, $http, socket, $timeout) {
    $scope.active = [];
    var residents = [];
    $scope.grid = [];
    $scope.residents = [];
    $http.get('/api/residents').then(function(response) {
      residents = response.data;
      buildGrid(residents);
      $scope.residents = residents;
      $scope.loaded = true;
      socket.syncUpdates('resident', residents, function() {
        buildGrid(residents);
      });
    });

    $scope.setActive = function() {
      $scope.active[2] = {
        active: true
      };
    }
    $scope.buildGrid = function(data) {
      buildGrid(data);
    }
    var buildGrid = function(data) {

      var key = 0;
      var counter = 0;

      var isFirst = true;
      angular.forEach(_.sortBy(data, function(item){
        return item.lastName.toLowerCase();
      }), function(resident){
        if(isFirst) {
          $scope.grid[key] = null;
          isFirst = false;
        }

        $timeout(function() {
          $scope.$apply(function() {
            if(counter/36 == 1){
              counter = 0;
              key++;
              $scope.grid[key] = null;
            }
            if(!$scope.grid[key]) $scope.grid[key] = [];
            $scope.grid[key].push(resident);
            counter++;
          });
        });
      });
    };

    $scope.updateGrid = function() {
      var data = residents;
      data = _.filter(data, function(item){
        return s.include(item.firstName.toLowerCase(), $scope.searchResident.toLowerCase()) || s.include(item.lastName.toLowerCase(), $scope.searchResident.toLowerCase());
      });
      buildGrid(data);
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('resident');
    });

  });
