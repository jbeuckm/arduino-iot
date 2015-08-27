angular.module('arduino-iot')
    .directive('logsGraph', function(){


        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {

                alert('hi')
            }

        };

    });
