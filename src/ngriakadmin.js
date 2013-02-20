var module = angular.module('riakadmin', []);
module.config(function ($routeProvider) {
    $routeProvider.
        when('/', {controller: HomeCtrl, templateUrl: 'home.html'}).
        when('/riak', {controller: RiakCtrl, templateUrl: 'riak.html'}).
        when('/settings', {controller: SettingsCtrl, templateUrl: 'settings.html'}).
        when('/buckets', {controller: BucketsCtrl, templateUrl: 'buckets.html'}).
        when('/buckets/:bucket', {controller: BucketCtrl, templateUrl: 'bucket.html'}).
        when('/buckets/:bucket/keys/:key', {controller: KeyCtrl, templateUrl: 'key.html'}).
        otherwise({redirectTo: '/'});
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

function HomeCtrl($scope) {
}

function RiakCtrl($scope, $http) {
    $http({method: 'GET', url: '/stats'}).
        success(function (data, status, headers, config) {
            $scope.stats = data;
        });
}

function SettingsCtrl($scope) {

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

    updateBucketKeys($scope.bucketName);

    $scope.saveProps = function() {
        $http({method: 'PUT', url: '/buckets/' + $scope.bucketName + '/props', data: {props: $scope.props} }).
            success(function(data, status, headers, config) {
                console.log('status: ' + status);
            });
    };

    $scope.deleteKey = function(key) {
        //TODO: confirm by user
        $http({method: 'DELETE', url: '/buckets/' + $scope.bucketName + '/keys/' + key}).
            success(function (data, status, headers, config) {
                $scope.keys = _.without($scope.keys, key)
            });
    }

    function updateBucketKeys(bucket) {
        $http({method: 'GET', url: '/buckets/' + bucket + '/keys?keys=true'}).
            success(function(data, status, headers, config) {
                $scope.keys = data.keys;
            });
    }
}

function KeyCtrl($scope, $routeParams, $http) {
    $scope.bucketName = $routeParams.bucket;
    $scope.keyName = $routeParams.key

    $http({method: 'GET', url: '/buckets/' + $scope.bucketName + '/keys/' + $scope.keyName}).
        success(function(data, status, headers, config) {
            $scope.data = data;
        });
}
