'use strict';

/**
 * @ngdoc function
 * @name puzzleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the puzzleApp
 */
angular.module('puzzleApp')
    .controller('MainCtrl', ['$scope', 'service','$location', function($scope, service, $location) {
         if (localStorage.getItem("hasSavedGame")) {
            $scope.resumebutton = true; //condition for toggle resume button.
         }
        $scope.players = service.players;
        $scope.isBot = service.isBot;
        // function responsible for adding new player in the game
        $scope.add = function(index) {
            service.players.push({
                name: $scope.name,
                score: 0,
                active: false,
                words: [],
                pass: false,
                avator: $scope.avator[$scope.players.length - 1]
            });
            $scope.name = null;
            localStorage.removeItem("playersList");
            localStorage.setItem('playersList', JSON.stringify($scope.players));
        }
        // function responsible for adding Bot Player
        $scope.addBot = function() {
            service.players.push({
                name: "bot",
                score: 0,
                active: false,
                words: [],
                pass: false,
                avator: "https://www.gravatar.com/avatar/d4ab75d77a9a82e179397fd7964dc36e?s=328&d=identicon&r=PG"
            });
            $scope.isBot = true;
            service.isBot = true;
            localStorage.removeItem("playersList");
        }
        // // function responsible for removing all players except Admin.
        $scope.clearPlayers = function(){
          localStorage.removeItem("playersList");
          window.location.reload();
         }
         // function responsible for resuming  the game
         $scope.resume = function(){
           service.resume = true;
           $location.path('/game');
         }
         // function responsible for starting new game
         $scope.startGame = function(){
            service.resume = false;
            service.players.map(function(p){
              p.score= 0;
              p.active =false;
              p.words= [];
              p.pass= false;
            });
            $location.path('/game');
         }
         //avator list
        $scope.avator = ["https://i.stack.imgur.com/DVW9g.jpg?s=328&g=1", "https://i.stack.imgur.com/vXG1F.png?s=328&g=1", "https://i.stack.imgur.com/203qt.png?s=328&g=1", "https://i.stack.imgur.com/wjb79.jpg?s=328&g=1"]

    }]);
