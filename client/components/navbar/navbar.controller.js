'use strict';

angular.module('residentsApp')
  .controller('NavbarCtrl', function ($scope, Auth, $state) {
    $scope.menu = [
    {
      'title': 'List',
      'state': 'admin.residents.list'
    },    
    {
      'title': 'Create',
      'state': 'admin.residents.create'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $state.go('admin.login');
    }
  });
