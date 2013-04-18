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

function RiakCtrl($scope, $http, $log) {
    var timeSeries = [
        [new Date(new Date().getTime() - (10 * 60000)), null, null]
    ];

    var g = new Dygraph(
        document.getElementById("graphdiv"),
        timeSeries,
        {labels: ["Time", "node_gets", "node_puts", "d"]}

      );

    fetchStats()

    window.setInterval(function () {
        var x1 = Math.random() * 10;
        var x2 = Math.random() * 10;
        fetchStats()
        $log.info("New data, " + x1 + ", " + x2);
    }, 60000);

    function fetchStats() {
        $http({method: 'GET', url: '/stats'}).
            success(function (data, status, headers, config) {
                $scope.stats = data;
                timeSeries.push([ new Date(), data.node_gets, data.node_puts]);
                $log.info("Inserted " + data.node_gets + ", " + data.node_puts)
                g.updateOptions({'file': timeSeries});
            });
    }
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

    $scope.openBucket = function() {
        $location.path('/buckets/' + $scope.gotoBucket)
    };
}

function BucketCtrl($scope, $routeParams, $http, $location, production) {
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
        production.check(
            function() {
                $http({method: 'GET', url: '/buckets/' + bucket + '/keys?keys=true'}).
                    success(function(data, status, headers, config) {
                        $scope.keys = data.keys;
                    });
            }
        );
    }

    $scope.openKey = function() {
        $location.path('/buckets/' + $scope.bucketName + '/keys/' + $scope.gotoKey)
    };
}

function KeyCtrl($scope, $routeParams, $http) {
    $scope.bucketName = $routeParams.bucket;
    $scope.keyName = $routeParams.key

    $http({method: 'GET', url: '/buckets/' + $scope.bucketName + '/keys/' + $scope.keyName}).
        success(function(data, status, headers, config) {
            $scope.data = data;
        });
}
