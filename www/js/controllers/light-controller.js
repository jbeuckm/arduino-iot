angular.module('arduino-iot')
    .controller('LightController', function($scope, $http){

        var arduino = "http://192.168.0.177";

        $http.get(arduino).then(function(response){

            $scope.temperature = response.data.temperature;
            $scope.humidity = response.data.humidity;

            $scope.light = (response.data.pinD4 == 1);

        }, console.error);


        $scope.$watch('light', function(newValue, oldValue) {

            $http({
                method: 'POST',
                url: arduino,
                data: "pinD4="+((newValue)? "On" : "Off"),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }}).then(function(response) {
                    console.log("post responded "+response);
                }, console.error);

        });

    });
