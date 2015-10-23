/**
 * Rock, paper, scissors hand game!
 */
(function() {
  angular.module('app', ['ngRoute'])
    /**
     * Constants and values
     */
    .constant('Badasses', [{
      key: 'steven',
      label: 'Steven'
    }, {
      key: 'jeanclaude',
      label: 'Jean Claude'
    }, {
      key: 'chuck',
      label: 'Chuck'
    }])
    /**
     * Routes and configurations
     */
    .config(['$compileProvider', '$routeProvider', function($compileProvider, $routeProvider) {
      $compileProvider.debugInfoEnabled(false);
      $routeProvider.when('/home', {
        templateUrl: 'tmpl/home.html',
        controller: 'HomeController'
      });
      $routeProvider.when('/play', {
        templateUrl: 'tmpl/play.html',
        controller: 'PlayController',
        resolve: {
          registered: function($q, Player) {
            var q = $q.defer();
            if (Player.areRegistered()) {
              q.resolve();
            } else {
              q.reject();
            }
            return q.promise;
          }
        }
      });
      $routeProvider.otherwise('/home');
    }])
    .controller('HomeController', ['$scope', '$filter', '$interval', '$location', 'Badasses', 'Player', function($scope, $filter, $interval, $location, Badasses, Player) {
      $scope.badassesList = Badasses;
      Player.setUserBadass(null);
      Player.setComputerBadass(null);

      $scope.selectBadass = function(index) {
        if (!$scope.userChoice) {
          Player.setUserBadass($scope.badassesList[index]);
          $scope.userChoice = Player.getUserBadass();
          $scope.selectComputerBadass(index);
        }
      }

      $scope.selectComputerBadass = function(excludedIndex) {
        var chosen = Math.floor(Math.random() * ($scope.badassesList.length - 1));
        var choice = $filter('filter')($scope.badassesList, {
          key: '!' + $scope.userChoice.key
        })[chosen];
        Player.setComputerBadass(choice);
        $scope.computerChoice = Player.getComputerBadass();
      }

    }])
    .controller('PlayController', ['$scope', '$interval', 'Game', 'Player', function($scope, $interval, Game, Player) {
      $scope.userChoice = Player.getUserBadass();
      $scope.computerChoice = Player.getComputerBadass();

      $scope.startCountdown = function() {
        $scope.countdown = [3,2,1,'Fight!'];
        var m = $scope.countdown.length;
        $scope.countdownEnd = false;
        var i = 0;
        var promise = $interval(function() {
          $scope.countdownEnd = false;
          if(i<m) {
            $scope.actualCount = $scope.countdown[i];
            i++;
          } else {
            $interval.cancel(promise);
            $scope.countdownEnd = true;
          }
        }, 400);
      }

      $scope.startCountdown();

      $scope.reset = function() {
        $scope.playAgain = false;
        $scope.userStatus = '';
        $scope.computerStatus = '';
        $scope.userWeapon = '';
        $scope.computerWeapon = '';
      }

      $scope.setUserWeapon = function(w) {
        $scope.userWeapon = w;
        $scope.setComputerWeapon();
      }

      $scope.setComputerWeapon = function() {
        var index = Math.floor(Math.random() * $scope.weapons.length);
        $scope.computerWeapon = $scope.weapons[index];
        $scope.calculate();
      }

      $scope.calculate = function() {
        $scope.playAgain = true;
        var result = Game.getResults($scope.userWeapon, $scope.computerWeapon);
        $scope.userStatus = result.player1;
        $scope.computerStatus = result.player2;
      }

      $scope.reset();

      $scope.weapons = Game.getWeapons();

    }])
    /**
     * Services!
     */
    .service('Game', [function() {
      var weaponsList = ['rock', 'paper', 'scissors'];

      var tie = {
        player1: 'tie',
        player2: 'tie'
      };
      var player1Wins = {
        player1: 'winner',
        player2: 'loser'
      };
      var player2Wins = {
        player1: 'loser',
        player2: 'winner'
      };
      var winnings = [
        [tie, player2Wins, player1Wins],
        [player1Wins, tie, player2Wins],
        [player2Wins, player1Wins, tie]
      ];
      return {
        getWeapons: function() {
          return weaponsList;
        },
        getResults: function(firstWeapon, secondWeapon) {
          var first = weaponsList.indexOf(firstWeapon);
          var second = weaponsList.indexOf(secondWeapon);
          return winnings[first][second];
        }
      }
    }])
    .service('Player', ['$localStorage', function($localStorage) {
      return {
        getUserBadass: function(a) {
          return JSON.parse($localStorage.getItem('user')).data;
        },
        getComputerBadass: function(a) {
          return JSON.parse($localStorage.getItem('computer')).data;
        },
        setUserBadass: function(a) {
          $localStorage.setItem('user', JSON.stringify({
            data: a
          }));
        },
        setComputerBadass: function(a) {
          $localStorage.setItem('computer', JSON.stringify({
            data: a
          }));
        },
        areRegistered: function() {
          return !!this.getUserBadass() && !!this.getComputerBadass();
        }
      }
    }])
    .service('$localStorage', ['$window', function($window) {
      return $window.localStorage;
    }])
    /**
     * Directives
     */
    .directive('badass', [function() {
      return {
        restrict: 'E',
        template: '<a href="" class="badass btn"><img ng-src="img/{{user.key}}{{s}}.jpg" class="img-circle img-thumbnail" /></a>',
        replace: true,
        scope: {
          user: '=',
          ngClick: '&',
          status: '='
        },
        controller: function($scope) {
          $scope.$watch('status', function(n) {
            var s = (n && n!='tie' ? '-' + n : '');
            var img = new Image();
            img.onload = function() {
              $scope.s = s;
              $scope.$apply();
            }
            img.src = 'img/' + $scope.user.key + s + '.jpg';
          }, true);
        }
      }
    }])
    /**
     * Run
     */
    .run(['$rootScope', '$location', function($rootScope, $location) {
      $rootScope.$on('$routeChangeError', function(e, data) {
        $location.path('/home');
      })
    }]);
})()
