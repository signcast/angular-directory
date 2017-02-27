'use strict';

angular.module('residentsApp')
  .controller('AdminLoginCtrl', function($scope, Auth, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          username: $scope.user.username,
          password: $scope.user.password
        })
        .then(function() {
          // Logged in, redirect to home
          $state.go('admin.residents.list');
        })
        .catch(function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
