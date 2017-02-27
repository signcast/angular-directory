'use strict';

angular.module('residentsApp')
  .controller('AdminResidentsEditCtrl', function($scope, Resident, id, $timeout) {
    $scope.resident = {};
    $scope.errors = {};
    $scope.submitted = false;
    $scope.hasError = false;

    Resident.get(id, function(resident) {
      $scope.resident = resident;
    });

    $scope.removeImage = function() {
      $timeout(function() {
        $scope.$apply(function() {
          // $scope.image = false;
          delete $scope.resident.picture;
        });
      });      
    };

    $scope.edit = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        if(!$scope.resident.image) {
          delete $scope.resident.image;
        }
        Resident.edit(id, $scope.resident)
          .then(function(data) {
            $scope.resident = data;
            $scope.errors = {};
            $scope.hasError = false;
            $scope.message = 'Resident successfully created.';
            delete $scope.resident.image;
          })
          .catch(function(err) {
            $scope.hasError = true;
            $scope.message = '';
            // console.log(err)
            // err = err.data;
            $scope.errors = {};

            if(err && err.errors) {
                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                });
            }
          });
      }
    };
  });