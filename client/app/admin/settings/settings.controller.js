'use strict';

angular.module('residentsApp')
  .controller('AdminSettingsCtrl', function($scope, $http, Auth) {

    $scope.customizeErrors = {};
    $scope.passwordErrors = {};
    $scope.passwordSubmitted = false;
    $scope.customizeSubmitted = false;
    $scope.customizeHasError = false;
    $scope.passwordHasError = false;

    $http.get('/api/config').then(function(response) {
      $scope.configs = response.data;
      // socket.syncUpdates('config', $rootScope.config);
    });

    $scope.changeSettings = function(form) {
      $scope.customizeSubmitted = true;
      if (form.$valid) {

       	$http.put('/api/config', $scope.configs)
          .success(function() {
            $scope.customizeSubmitted = false;
            $scope.customizeErrors = {};
            $scope.customizeHasError = false;
            $scope.customizeMessage = 'Settings successfully changed.';
          })
          .catch(function(err) {
            $scope.customizeHasError = true;
            $scope.customizeMessage = '';
            $scope.customizeErrors = {};

            if(err && err.errors) {
                console.log(err)
                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.customizeErrors[field] = error.message;
                });
            }
          });
      }
    };

    $scope.changePassword = function(form) {
      $scope.passwordSubmitted = true;
      if (form.$valid) {
        Auth.changePassword($scope.oldPassword, $scope.newPassword, function(err) {
          if(!err) {
            $scope.passwordSubmitted = false;
            $scope.passwordErrors = {};
            $scope.passwordHasError = false;
            $scope.oldPassword = '';
            $scope.newPassword = '';
            $scope.newPasswordConfirm = '';
            $scope.passwordMessage = 'Password successfully changed.';
          }else{
            $scope.passwordHasError = true;
            $scope.passwordMessage = '';
            $scope.passwordErrors = {};

            if(err && err.errors) {
                console.log(err)
                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.passwordErrors[field] = error.message;
                });
            }
          }
        });
      }
    };
    
  });
