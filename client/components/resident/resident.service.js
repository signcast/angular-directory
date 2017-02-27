'use strict';

angular.module('residentsApp')
  .factory('Resident', function Auth($http, $q) {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    var safeCb = function(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    };

    return {

      create: function(resident, callback) {
        return $http.post('/api/residents', resident)
        .then(function() {
          safeCb(callback)(true);
          return true;
        })
        .catch(function(err) {
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        }.bind(this));
      },

      get: function(id, callback) {
        return $http.get('/api/residents/'+id)
        .then(function(resident) {
          safeCb(callback)(resident.data);
          return resident.data;
        })
        .catch(function(err) {
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        }.bind(this));
      },

      edit: function(id, resident, callback) {
        console.log(resident);
        return $http.put('/api/residents/'+id, resident)
        .then(function(result) {
          safeCb(callback)(result.data);
          return result.data;
        })
        .catch(function(err) {
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        }.bind(this));
      },

      delete: function(id, callback) {
        return $http.delete('/api/residents/'+id)
        .then(function() {
          safeCb(callback)(true);
          return true;
        })
        .catch(function(err) {
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        }.bind(this));
      }

    };
  });
