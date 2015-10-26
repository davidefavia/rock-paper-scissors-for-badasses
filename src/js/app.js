/**
 * Rock, paper, scissors hand game!
 */
(function() {
  'use strict';
  angular.module('app', ['ngRoute'])
    /**
     * Routes and configurations
     */
    .config(['$compileProvider', '$routeProvider', function($compileProvider, $routeProvider) {
      $compileProvider.debugInfoEnabled(false);
      $routeProvider.when('/home', {
        templateUrl: 'tmpl/home.html',
        controller: 'HomeController'
      });
      $routeProvider.when('/:player1/vs/:player2', {
        templateUrl: 'tmpl/play.html',
        controller: 'PlayController'
      });
      $routeProvider.otherwise('/home');
    }])
    .controller('HomeController', ['$scope', '$filter', '$interval', '$window', 'Game', function($scope, $filter, $interval, $window, Game) {
      $scope.badassesList = Game.getBadasses();

      $scope.selectPlayer1 = function(index) {
        if (!$scope.player1) {
          $scope.player1 = $scope.badassesList[index].key;
          $scope.selectPlayer2();
        }
      }

      $scope.selectPlayer2 = function() {
        var chosen = $window.Math.floor($window.Math.random() * ($scope.badassesList.length - 1));
        var choice = $filter('filter')($scope.badassesList, {
          key: '!' + $scope.player1
        })[chosen];
        $scope.player2 = choice.key;
      }

    }])
    .controller('PlayController', ['$scope', '$interval', '$location', '$window', '$routeParams', 'Game', function($scope, $interval, $location, $window, $routeParams, Game) {
      $scope.player1Choice = Game.getBadassByKey($routeParams.player1);
      $scope.player2Choice = Game.getBadassByKey($routeParams.player2);

      if(!$scope.player1Choice || !$scope.player2Choice) {
        $location.path('/home');
      }

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
        $scope.player1Status = '';
        $scope.player2Status = '';
        $scope.player1Weapon = '';
        $scope.player2Weapon = '';
      }

      $scope.setPlayer1Weapon = function(w) {
        if(!$scope.player1Weapon) {
          $scope.player1Weapon = w;
          $scope.setPlayer2Weapon();
        }
      }

      $scope.setPlayer2Weapon = function() {
        var index = $window.Math.floor($window.Math.random() * $scope.weapons.length);
        $scope.player2Weapon = $scope.weapons[index];
        $scope.calculate();
      }

      $scope.calculate = function() {
        $scope.playAgain = true;
        var result = Game.getResults($scope.player1Weapon, $scope.player2Weapon);
        $scope.player1Status = result.player1;
        $scope.player2Status = result.player2;
      }

      $scope.reset();

      $scope.weapons = Game.getWeapons();

    }])
    /**
     * Services!
     */
    .service('Game', ['$filter', function($filter) {
      var weaponsList = ['rock', 'paper', 'scissors'];

      var badassesList = [{
        key: 'steven',
        label: 'Steven'
      }, {
        key: 'jeanclaude',
        label: 'Jean Claude'
      }, {
        key: 'chuck',
        label: 'Chuck'
      }];

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
        },
        getBadasses: function() {
          return badassesList;
        },
        getBadassByKey: function(key) {
          return $filter('filter')(badassesList, {key:key})[0];
        }
      }
    }])
    /**
     * Directives
     */
    .directive('badass', [function() {
      return {
        restrict: 'E',
        template: '<a href="" class="badass btn"><img ng-src="img/{{player1.key}}{{s}}.jpg" class="img-circle img-thumbnail" /></a>',
        replace: true,
        scope: {
          player1: '=',
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
            img.src = 'img/' + $scope.player1.key + s + '.jpg';
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
