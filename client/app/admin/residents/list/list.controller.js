'use strict';

angular.module('residentsApp')
	.controller('AdminResidentsListCtrl', function($scope, $http, socket, $modal, $filter) {

		$scope.sortingOrder = '_id';
		$scope.reverse = false;
		$scope.filteredItems = [];
		$scope.groupedItems = [];
		$scope.itemsPerPage = 25;
		$scope.pagedItems = [];
		$scope.currentPage = 0;

		$http.get('/api/residents').then(function(response) {
			$scope.items = response.data;
			socket.syncUpdates('resident', $scope.items);

			$scope.$watch('items', function() {
				$scope.filteredItems = $scope.items;
				$scope.groupToPages();
			}, true);

			var searchMatch = function (haystack, needle) {
				if (!needle || typeof(haystack) !== 'string') {
					return true;
				}
				// console.log(haystack.toLowerCase(), needle.toLowerCase(), haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1)
				return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
			};

			// init the filtered items
			$scope.search = function () {
				$scope.filteredItems = $filter('filter')($scope.items, function (item) {
					if(searchMatch(item['firstName'], $scope.query) || searchMatch(item['lastName'], $scope.query)) {
						return true;
					}
					return false;
				});
				// take care of the sorting order
				if ($scope.sortingOrder !== '') {
						$scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
				}
				$scope.currentPage = 0;
				// now group by pages
				$scope.groupToPages();
			};
			
			// calculate page in place
			$scope.groupToPages = function () {
				$scope.pagedItems = [];
				
				for (var i = 0; i < $scope.filteredItems.length; i++) {
					if (i % $scope.itemsPerPage === 0) {
						$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
					} else {
						$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
					}
				}
			};
			
			$scope.range = function (start, end) {
				var ret = [];
				if (!end) {
					end = start;
					start = 0;
				}
				for (var i = start; i < end; i++) {
					ret.push(i);
				}
				return ret;
			};
			
			$scope.prevPage = function () {
				if ($scope.currentPage > 0) {
					$scope.currentPage--;
				}
			};
			
			$scope.nextPage = function () {
				if ($scope.currentPage < $scope.pagedItems.length - 1) {
					$scope.currentPage++;
				}
			};
			
			$scope.setPage = function () {
				$scope.currentPage = this.n;
			};

			// functions have been describe process the data for display
			$scope.search();

			// change sorting order
			$scope.sort_by = function(newSortingOrder) {
			    if ($scope.sortingOrder == newSortingOrder){
			    	$scope.reverse = !$scope.reverse;
			    }
			
			    $scope.sortingOrder = newSortingOrder;

			    // icon setup
			    $('th i').each(function(){
			        // icon reset
			        $(this).removeClass().addClass('fa fa-sort');
			    });
			    if ($scope.reverse)
			        $('th.'+newSortingOrder+' i').removeClass().addClass('fa fa-sort-desc');
			    else
			        $('th.'+newSortingOrder+' i').removeClass().addClass('fa fa-sort-asc');
			};

		});

		$scope.$on('$destroy', function() {
			socket.unsyncUpdates('resident');
		});

		$scope.edit = function (id) {
			var modalInstance = $modal.open({
				templateUrl: 'app/admin/residents/list/edit/edit.html',
				controller: 'AdminResidentsEditCtrl',
				resolve: {
					id: function () {
						return id;
					}
				}
			});
		};

		$scope.delete = function (id) {
			var modalInstance = $modal.open({
				templateUrl: 'app/admin/residents/list/delete/delete.html',
				controller: 'AdminResidentsDeleteCtrl',
				resolve: {
					id: function () {
						return id;
					}
				}
			});
		};
		
	});
