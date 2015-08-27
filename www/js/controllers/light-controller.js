angular.module('arduino-iot')
    .controller('LightController', function($scope, $http){

        $http.get("http://192.168.0.177").then(function(response){

            $scope.temperature = response.data.temperature;
            $scope.humidity = response.data.humidity;

        }, function(err){
            console.error(err);
        });

    });
