'use strict';

angular.module('residentsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.residents', {
        url: '/residents',
        template: '<div ui-view/>',
        abstract: true
      })
        .state('admin.residents.list', {
          url: '',
          templateUrl: 'app/admin/residents/list/list.html',
          controller: 'AdminResidentsListCtrl',
          authenticate: true
        })
        .state('admin.residents.create', {
          url: '/create',
          templateUrl: 'app/admin/residents/create/create.html',
          controller: 'AdminResidentsCreateCtrl',
          authenticate: true
        });
  });
