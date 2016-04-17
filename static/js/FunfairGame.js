var funfairGameApp = angular.module('funfairGameApp', ['ngRoute']);

/**
 * Router
 */
funfairGameApp.config(['$routeProvider', '$locationProvider', '$interpolateProvider',
    function ($routeProvider, $locationProvider, $interpolateProvider) {

    $routeProvider.when('/arena', {
        templateUrl: 'views/arena',
        controller: 'ArenaCtrl'
    });

    $routeProvider.when('/new-game', {
        templateUrl: 'views/new-game',
        controller: 'NewGameCtrl'
    });

    $routeProvider.otherwise('/arena');

    // Interpolate symbols
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}]);
