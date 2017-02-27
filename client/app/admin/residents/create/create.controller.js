'use strict';

angular.module('residentsApp')
  .controller('AdminResidentsCreateCtrl', function($scope, Resident) {
    $scope.resident = {};
    $scope.errors = {};
    $scope.submitted = false;
    $scope.hasError = false;

    $scope.create = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        Resident.create($scope.resident)
          .then(function() {
            $scope.resident = {};
            $scope.errors = {};
            $scope.hasError = false;
            $scope.message = 'Resident successfully created.';
          })
          .catch(function(err) {
            $scope.hasError = true;
            $scope.message = '';
            $scope.errors = {};

            if(err && err.errors) {
                console.log(err)
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