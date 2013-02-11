angular.module('riakadmin', []).
    config(function($routeProvider) {
        $routeProvider.
            when('/riak', {controller:RiakCtrl, templateUrl:'riak.html'}).
            when('/buckets', {controller:BucketsCtrl, templateUrl:'buckets.html'}).
            when('/buckets/:bucket', {controller:BucketCtrl, templateUrl:'bucket.html'}).
            otherwise({redirectTo:'/riak'});
    });

function RiakCtrl($scope) {
}

function BucketsCtrl($scope, $http) {
    $http({method: 'GET', url:'/buckets?buckets=true'}).
        success(function(data, status, headers, config) {
            $scope.buckets = data.buckets;
        });
}

function BucketCtrl($scope, $routeParams, $http) {
    $http({method: 'GET', url:'/buckets/' + $routeParams.bucket + '/keys?keys=true'}).
        success(function(data, status, headers, config) {
            $scope.props = data.props;
            $scope.keys = data.keys;
        })
}
