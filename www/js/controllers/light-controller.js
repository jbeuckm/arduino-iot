angular.module('arduino-iot')
    .controller('LightController', function($scope, $http){

        var arduino = "http://192.168.0.177";

        $scope.light_on = false;

        function refresh() {

            $http.get(arduino).then(function(response){

                $scope.temperature = response.data.temperature;
                $scope.humidity = response.data.humidity;

                $scope.light_on = (response.data.pinD4 == 1);

                $scope.light_sensor = Math.floor(100 * response.data.analog0 / 1023) + "%"

            }, console.error);

        }
        $scope.refresh = refresh;

        $scope.$watch('light_on', function(newValue, oldValue) {

            $http({
                method: 'POST',
                url: arduino,
                data: "pinD4="+((newValue)? "On" : "Off"),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }}).then(function(response) {
                    console.log("post responded "+response);

//                    refresh();

                }, console.error);

        });

        refresh();

    });
