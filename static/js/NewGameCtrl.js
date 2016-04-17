/**
 * New game controller
 */
funfairGameApp.controller('NewGameCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    /**
     * Get array number
     */
    $scope.getArrayNumber = function (number) {
        var _values = [];

        if ("undefined" === typeof(number)) {
            return _values;
        }

        for (var idx = 1; idx <= parseInt(number, 10); idx++) {
            _values.push(idx);
        }

        return _values;
    };

    /**
     * On game validated
     */
    $scope.onGameValidated = function () {
        // Display popin
        angular.element("#new-game-dialog").modal("show");
    };

    /**
     * On game confirmed
     */
    $scope.onGameConfirmed = function () {
        var _players = angular.copy($scope.newPlayers);

        // Hide popin
        angular.element("#new-game-dialog").modal("hide");
        angular.element('body').removeClass('modal-open');
        angular.element('.modal-backdrop').remove();

        $http.post("/games", {'players': _players})
            .success(function (response) {
                $location.url("/arena");
            })
            .error(function (response) {
                console.log("Error while posting game information");
            });
        console.log(new Date().toISOString(),"- Game starting..." + $scope.configuration.totalPoints + " points to complete");
        $http.post("/games/start", {'totalPoints': $scope.configuration.totalPoints, 'nbPlayers':_players.length})
//        $http.post("/games/start", $scope.configuration.totalPoints)
                .success(function (response) {
                    console.log(new Date().toISOString(),"- Game started");
                })
                .error(function (response) {
                    console.log("Error while posting game start");
                });
        $scope.endOfGame = false;
        $scope.startOfGame = true;
        console.log("onGameConfirmed : $scope.startOfGame",$scope.startOfGame);
    };

	/**
	 * Load characters
	 */
	$scope._loadCharacters = function () {
		$http.get("/characters")
            .success(function (response) {
        console.log("_loadCharacters");
                $scope.characters = response;
        console.log("$scope.characters",$scope.characters);
            })
            .error(function (response) {
                console.log("Error while loading characters");
            });
	};

    /**
     * Initialize
     */
    $scope.init = function () {
        $scope.newPlayers = {};
		$scope._loadCharacters();
        $scope.endOfGame = true;
        $scope.startOfGame = false;
    };

    $scope.init();
}]);
