/**
 * Index controller
 */
funfairGameApp.controller('IndexCtrl', ['$scope', function ($scope) {

    /**
     * Attributes
     */
    $scope.configuration = {
        "refreshInterval": 1000,
        "totalPoints": 10,
        "body": {
            "widthPercent": 90
        },
        "player": {
            "width": 50
        },
        "arena": {
           "width": 1200,
           "height": 600
        },
        "character":{
            "run": {
                "x": 20,
                "y": 390
            },
            "fly": {
                "x": 20,
                "y": 225
            },
            "runner":{
                "sprite": {
                    "filename" : "runner.png",
                    "json": "runner.json",
                    "imagecount":8
                }
            },
            "maya":{
                "sprite": {
                    "filename" : "maya.png",
                    "json": "maya.json",
                    "imagecount":2
                }
            }
        },
        "background":{
            "back1":{
                "filename" : "back1.png"
            },
            "back2":{
                "filename" : "back2.png"
            }
        }
    };

    /**
     * Initialize
     */
    $scope.init = function () {
        $scope.startOfGame = false;
    };

    $scope.init();
}]);
