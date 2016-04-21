/**
 * Arena controller
 */
funfairGameApp.controller('ArenaCtrl', ['$scope', '$http', '$interval', '$window', '$timeout', 'currentGame', function ($scope, $http, $interval, $window, $timeout, currentGame) {

    $scope._refreshPromise = null;
    $scope._imagesAlreadyLoaded = false;
    $scope._gamePlayers = null;
    $scope._scoreTexts = null;
    $scope._players = null;
    $scope._numbers = null;
    /**
     * Refresh informations
     */
    $scope._refreshInformations = function () {
        console.log("currentGame.startOfGame",currentGame.startOfGame);
        //if (currentGame.startOfGame) {

            $http.get('/games/latest')
                .success(function (response) {
                    //console.log("Informations loaded");

                    if (response) {
                        console.log("Entering _refreshGame...");
                        if (!$scope._imagesAlreadyLoaded) {
                            
                            // Create game
                            $scope._game = new Phaser.Game($scope.configuration.arena.width, $scope.configuration.arena.height, Phaser.AUTO, '', {
                                "preload": $scope._preloadGame,
                                "create": $scope._createGame, //function () {},
                                "update": $scope._updateGame
                            });

                       }
                       $scope._refreshGame(response);
                    }
                })
                .error(function (response) {
                    console.log("Error while loading game information");
                });         
        //}

    };

    /*
     * Refresh game
     */
    $scope._refreshGame = function (response) {
        if (currentGame.endOfGame) {
            return;
        }

        $scope._players =[];
        var _player = null, _winners = [];
        currentGame.startOfGame = !(0 >= response.players.length);
        // Players
        for (var idx in response.players) {
            _player = angular.copy(response.players[idx]);

            _player.ratio = _player.points / $scope.configuration.totalPoints;

            $scope._players.push(_player);

            if ($scope.configuration.totalPoints <= _player.points) {
                _winners.push(_player.name);
            }
        }

        if (0 < _winners.length) {
            $http.post("/games/winners", {'winners': _winners[0]})
                .success(function (response) {
                    console.log(new Date().toISOString(), "- Player(s) '" + _winners.join(", ") + "' won the game");
                 })
                .error(function (response) {
                    console.log("Error while posting game winners");
                });
            _player.points=0;
            // End of game
            currentGame.endOfGame = true;
        }

        // Update game
        //$scope._updateGame(_players);
    };

 
    /**
     * Preload game
     */
    $scope._preloadGame = function () {
        if (!$scope._imagesAlreadyLoaded) {
console.log("Entering _preloadGame");
            var _imageName = null;
            var num=0;
            console.log("players=", $scope._players);

            var _imgIndex = 2;//Math.floor(Math.random() * 2) + 1;
            $scope._game.load.atlasJSONHash('back', 'images/arena/back' + _imgIndex + '.png', 'images/arena/back' + _imgIndex + '.json');
            $scope._numbers = {};
            // Players
            for (var idx in $scope._players) {
            // console.log("_imagePath",_imagePath);
            _imageName = $scope._players[idx].image.split('/').reverse()[0].split('.')[0];
//            console.log("ADD", _imageName, 'images/characters/sprites/run/'+_imageName+'.png', 'images/characters/sprites/run/'+_imageName+'.json');
                $scope._game.load.atlasJSONHash(_imageName, 'images/characters/sprites/'+$scope._players[idx].action+'/'+_imageName+'.png', 'images/characters/sprites/'+$scope._players[idx].action+'/'+_imageName+'.json');
                $scope._game.load.atlasJSONHash(_imageName+'_idle', 'images/characters/sprites/idle/'+_imageName+'.png', 'images/characters/sprites/idle/'+_imageName+'.json');
                num=eval(idx)+1;
//            console.log("ADD", 'b' + num, 'images/numbers/' + num + '.png');
                $scope._game.load.image('b' + num, 'images/numbers/' + num + '.png');
            }
            $scope._imagesAlreadyLoaded = true;
        }
    };

    /**
     * Create game
     */
    $scope._createGame = function () {
        var _imageName = null;
        var players = $scope._players;
        var num=0;
console.log("Entering _createGame",players);
        if (!$scope._gamePlayers) {
            $scope._gamePlayers = {};
            $scope._scoreTexts = {};

            // Background
            $scope._game.add.sprite(0, 0, 'back', 'background');

            // Players
            for (var idx in players) {
                _imageName = players[idx].image.split('/').reverse()[0].split('.')[0]+'_idle';
                $scope._gamePlayers[idx] = $scope._game.add.sprite((players.length-idx)*$scope.configuration.character[players[idx].action].x, $scope.configuration.character[players[idx].action].y+idx * 20, _imageName, '0001.png');
                $scope._gamePlayers[idx].animations.add('idle');
                $scope._gamePlayers[idx].animations.play('idle',10,true);
                num = eval(idx)+1;
                $scope._numbers['b' + num] = $scope._game.add.image($scope._gamePlayers[idx].x+20, $scope._gamePlayers[idx].y-20, 'b' + num);
                $scope._numbers['b' + num].anchor.set(0.1);

                $scope._scoreTexts[idx] = $scope._game.add.text(10, idx * 40, players[idx].name + ': 0', { font: '34px Arial', fill: '#fff' });
            }
        }
    }
    /**
     * Update game
     */
    $scope._updateGame = function () {
        var players = $scope._players;
        // Move
        for (var idx in players) {
            //_imageName = players[idx].image.substring(players[idx].image.lastIndexOf("/") + 1, players[idx].image.lastIndexOf("."));
            _imageRun = players[idx].image.split('/').reverse()[0].split('.')[0];
            _imageIdle = players[idx].image.split('/').reverse()[0].split('.')[0]+'_idle';

            _newPos=((players.length-idx)*20)+(players[idx].ratio * $scope.configuration.arena.width);
            num = eval(idx)+1;
            if ($scope._gamePlayers[idx].x < _newPos) {
//                console.log("$scope._gamePlayers[idx].key",$scope._gamePlayers[idx].key);
                if ($scope._gamePlayers[idx].key === _imageIdle) {
                    $scope._gamePlayers[idx].loadTexture(_imageRun, 0, false)
                }
                $scope._gamePlayers[idx].x += 1;
//                $scope._gamePlayers[idx].alpha=70;
                $scope._numbers['b' + num].x = $scope._gamePlayers[idx].x+20;
                $scope._numbers['b' + num].y = $scope._gamePlayers[idx].y-20;
//                $scope._numbers['b' + num].alpha = 0;
            } else {
                if ($scope._gamePlayers[idx].key === _imageRun) {
                    $scope._gamePlayers[idx].loadTexture(_imageIdle, 0, false)
//                console.log("_imageName",_imageName);
                }
              // $scope._gamePlayers[idx].play(_imageName, 10, true);

            }
            $scope._scoreTexts[idx].setText(players[idx].name + ': ' + players[idx].points);
        }
    };

    /**
     * On destroy view
     */
    $scope.$on('$destroy', function () {
        if ($scope._refreshPromise) {
            $interval.cancel($scope._refreshPromise);
        }
    });

    /**
     * Initialize
     */
    $scope.init = function () {
console.log("ArenaCtrl init");        
        $scope._refreshInformations();

        // Set interval
        /*
        $scope.refreshPromise = $timeout(
            function() {
                console.log('In refreshPromise', $scope.configuration.refreshInterval);
                $scope._refreshInformations();
            },
            $scope.configuration.refreshInterval
        );
        */
        setInterval(function() {
                console.log('In refreshPromise', $scope.configuration.refreshInterval);
                $scope._refreshInformations();
            },
            $scope.configuration.refreshInterval
        );

    };

    $scope.init();
}]);