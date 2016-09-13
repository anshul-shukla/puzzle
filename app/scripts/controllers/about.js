'use strict';

/**
 * @ngdoc function
 * @name puzzleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the puzzleApp
 */
angular.module('puzzleApp')
    .controller('AboutCtrl', ['$scope', 'service','$location', function($scope, service, $location) {
      $scope.about = [
        "Anshul is the default admin of the game.",
        "You can add maximum 5 players and minimum 2 are allowed.",
        "Remove all button will remove all players for that game except admin.",
        "Resume game will take you to the saved game.",
        "Bot is always correct and you can't save the game playering with Bot.",
        "You can select a word horizontally, vertically and diagonally.",
        "If all players consecutively passes their chance once, Game will over.",
        "After successfully detecting all words gave will over.",
        "There are minimum 10 and maximum 20 words are present in game.",
        "Once if, you have selected a character you can not remove it, either pass or submit it."

      ]
    }]);
