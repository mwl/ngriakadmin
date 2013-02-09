angular.module('riakadmin', []).
    config(function($routeProvider) {
        $routeProvider.
            when('/riak', {controller:RiakCtrl, templateUrl:'riak.html'}).
            otherwise({redirectTo:'/riak'});
    });

function RiakCtrl($scope, $http) {
    $http({method: 'GET', url:'/riak?buckets=true'}).
        success(function(data, status, headers, config) {
            $scope.buckets = data.buckets;
        });
}