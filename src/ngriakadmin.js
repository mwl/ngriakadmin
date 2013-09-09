var module = angular.module('riakadmin', ['restangular']);
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
module.factory('production', function($http) {
    return {
        check: function(notProductionCallback, isProductionCallback) {
            $http({method: 'GET', url:'settings.json', cache:'settings'}).
                success(function(data, status, headers, config) {
                    if (data.insecure) {
                        notProductionCallback()
                    }
                    else if (isProductionCallback) {
                        isProductionCallback()
                    }
                });
        }
    };
});

function HomeCtrl($scope) {
}

function RiakCtrl($scope, $http) {
    $http({method: 'GET', url: '/stats'}).
        success(function (data, status, headers, config) {
            $scope.stats = data;
        });
}

function SettingsCtrl($scope, production) {
}

function BucketsCtrl($scope, $http, $location, production) {
    production.check(
        function() {
            $http({method: 'GET', url:'/buckets?buckets=true'}).
                success(function(data, status, headers, config) {
                    $scope.buckets = data.buckets;
                });
        }
    )

    $scope.openBucket = function(bucket) {
        $location.path('/buckets/' + encodeURIComponent(bucket));
    };
}

function BucketCtrl($scope, $routeParams, $http, $location, production, $log) {
    $scope.bucketName = decodeURIComponent($routeParams.bucket);
    $http({method: 'GET', url: '/buckets/' + $routeParams.bucket + "/props"}).
        success(function(data, status, headers, config) {
            $scope.props = data.props;
        });

    updateBucketKeys($scope.bucketName);

    $scope.saveProps = function() {
        $http({method: 'PUT', url: '/buckets/' + encodeURIComponent($scope.bucketName) + '/props', data: {props: $scope.props} }).
            success(function(data, status, headers, config) {
                console.log('status: ' + status);
            });
    };

    $scope.deleteKey = function(key) {
        //TODO: confirm by user
        $http({method: 'DELETE', url: '/buckets/' + encodeURIComponent($scope.bucketName) + '/keys/' + encodeURIComponent(key.key)}).
            success(function (data, status, headers, config) {
                $scope.keys = _.without($scope.keys, key)
            });
    }

    $scope.deleteSelected = function() {
        _.chain($scope.keys).filter(function (key) { return key.selected }).each($scope.deleteKey);
    };

    $scope.selectAll = function() {
        _.each($scope.keys, function(key) { key.selected = $scope.allSelected})
    }

    $scope.$watch(
        function(scope) {
            return _.chain(scope.keys).map(function(key) { return key.selected}).every().value()
        },
        function(allIsSelected, oldValue, scope) {
            scope.allSelected = allIsSelected
        }
    )

    function updateBucketKeys(bucket) {
        production.check(
            function() {
                $http({method: 'GET', url: '/buckets/' + encodeURIComponent(bucket) + '/keys?keys=true'}).
                    success(function(data, status, headers, config) {
                        $scope.keys = _(data.keys).map(function(key) { return {key: key}; });
                    });
            }
        );
    }

    $scope.openKey = function(bucket, key) {
        $location.path('/buckets/' + encodeURIComponent(bucket) + '/keys/' + encodeURIComponent(key))
    };
}

function KeyCtrl($scope, $routeParams, $http, Restangular) {
    $scope.bucketName = decodeURIComponent($routeParams.bucket);
    $scope.keyName = decodeURIComponent($routeParams.key)
    var Key = Restangular.one('buckets', encodeURIComponent($scope.bucketName)).one('keys', encodeURIComponent($scope.keyName));

    Key.get().then(
        function(data, status, headers, config) {
            $scope.data = data;
        }
    )
}
