var module = angular.module('riakadmin', []);
module.config(function ($routeProvider) {
    $routeProvider.
        when('/riak', {controller: RiakCtrl, templateUrl: 'riak.html'}).
        when('/buckets', {controller: BucketsCtrl, templateUrl: 'buckets.html'}).
        when('/buckets/:bucket', {controller: BucketCtrl, templateUrl: 'bucket.html'}).
        otherwise({redirectTo: '/riak'});
});
module.directive('quorum', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attribute, ngModel) {
            function fromField(value) {
                if (value === null || value === 0) {
                    return "quorum";
                }
                return value;
            }

            ngModel.$parsers.push(fromField);
        }
    }
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
    $scope.bucketName = $routeParams.bucket
    $http({method: 'GET', url: '/buckets/' + $routeParams.bucket + "/props"}).
        success(function(data, status, headers, config) {
            $scope.props = data.props;
        });

    $http({method: 'GET', url: '/buckets/' + $routeParams.bucket + '/keys?keys=true'}).
        success(function(data, status, headers, config) {
            $scope.keys = data.keys;
        });

    $scope.saveProps = function() {
        $http({method: 'PUT', url: '/buckets/' + $scope.bucketName + '/props', data: {props: $scope.props} }).
            success(function(data, status, headers, config) {
                console.log('status: ' + status);
            });
    };
}
