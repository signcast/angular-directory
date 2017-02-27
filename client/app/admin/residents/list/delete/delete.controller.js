'use strict';

angular.module('residentsApp')
  .controller('AdminResidentsDeleteCtrl', function($scope, Resident, id) {

    Resident.get(id, function(resident) {
      $scope.resident = resident;
    });

    $scope.delete = function() {
      Resident.delete(id)
        .then(function() {
          $scope.$dismiss();
        })
        .catch(function(err) {
          alert(err);
        });
    };
  });