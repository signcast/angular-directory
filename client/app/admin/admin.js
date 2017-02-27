'use strict';

angular.module('residentsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,
        template: '<div ui-view/>',
      })
        .state('admin.login', {
          url: '',
          templateUrl: 'app/admin/login/login.html',
          controller: 'AdminLoginCtrl'
        })
        .state('admin.settings', {
          url: '/settings',
          templateUrl: 'app/admin/settings/settings.html',
          controller: 'AdminSettingsCtrl'
        })
  });
