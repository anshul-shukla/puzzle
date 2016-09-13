'use strict';

/**
 * @ngdoc function
 * @name puzzleApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the puzzleApp
 */
angular.module('puzzleApp')
    .controller('GameCtrl', function($scope, service, $mdToast, $location, $mdDialog) {

        $scope.alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('');
        //condition for showing resume button
        if (localStorage.getItem("hasSavedGame")) {
          $scope.resumeButton = true;
        }
        // condition for rendering resumed game
        if(service.resume){
          resume();
        }else{
          // condition for rendering new game.
          if (service.players.length < 2) $location.path('/');
          $scope.players = service.players;
          $scope.word = service.words;
          $scope.gridData = [];
          $scope.activePlayer = $scope.players[0];
          $scope.activeGridList = [];
          $scope.insertedWords = [];
          $scope.detectedWords = [];
          $scope.isOver = false;
          if (service.isBot) {
              $scope.botData = [];
              $scope.isBoat = service.isBot;
          }
          init();
        }
        function init() {
            create15X15Grid();
            fillInitials();
        }

        $scope.resume = function(){
          resume();
        }

        // function responsible for rendering resumed content.
        function resume(){
          if (localStorage.getItem("hasSavedGame")) {
              var hasSavedGame = JSON.parse(localStorage.getItem("hasSavedGame"));
              service.isBot = false;
              $scope.isBot = false;
              $scope.players = hasSavedGame.players;
              service.players = $scope.players;
              $scope.word = hasSavedGame.word;
              $scope.gridData = hasSavedGame.gridData;
              $scope.activePlayer = $scope.players.filter(function(p) {
                  if (p.name === hasSavedGame.activePlayer.name) return p
              })[0];
              $scope.activeGridList = hasSavedGame.activeGridList;
              $scope.insertedWords = hasSavedGame.insertedWords;
              $scope.detectedWords = hasSavedGame.detectedWords;
              $scope.isOver = hasSavedGame.isOver;

          }
        }
        // function responsible for saving game in local storage.
        $scope.save = function() {
            if (!service.isBot) {
            var hasSavedGame = {
                players: $scope.players,
                word: $scope.word,
                gridData: $scope.gridData,
                activePlayer: $scope.activePlayer,
                activeGridList: $scope.activeGridList,
                insertedWords: $scope.insertedWords,
                detectedWords: $scope.detectedWords,
                isOver: $scope.isOver
            }
            localStorage.setItem("hasSavedGame", JSON.stringify(hasSavedGame));
            $scope.resumeButton = true;
            showSimpleToast("Your game is saved.", "success");
          }else{
            showSimpleToast("You can't save Bot game.", "error");
          }
        }

        // function responsible for pass functionality of game.
        $scope.pass = function() {
            $scope.activePlayer.pass = true;
            var isPassedAll = isPassedByAll();
            if (isPassedAll.length) {
                updateActivePlayer();
                showSimpleToast("Successfully passed.", "success");
            } else {
                gaveOver("All of you passed your turn once. Now It's over for you guys.");
            }

            if (service.isBot) {
                setTimeout(function() {
                    botHandler();
                }, 500)
            }

        }
        // function responsible for checking passed by all players or not.
        function isPassedByAll() {
            return $scope.players.filter(function(p) {
                if (!p.pass) {
                    return p;
                }
            })
        }
        // function responsible for computing game is over or not.
        function gaveOver(message) {
            $scope.isOver = true;
            $scope.showAlert(event, message);
        }

        // function responsible for updating active player.
        function updateActivePlayer() {
            $scope.activePlayer.active = false;
            var index = $scope.players.map(function(e) {
                return e.name;
            }).indexOf($scope.activePlayer.name);
            if (index < $scope.players.length - 1) {
                $scope.activePlayer = $scope.players[index + 1];
            } else if (index === $scope.players.length - 1) {
                $scope.activePlayer = $scope.players[0];
            }
            $scope.activePlayer.active = true;
        }
        // function responsible for computing player answer.
        $scope.submit = function() {
            if (!$scope.isOver && $scope.detectedWords.length < $scope.insertedWords.length) {
              var str = "";
                $scope.activeGridList.map(function(g) {
                    str += g.value;
                });
                if (!str) {
                  showSimpleToast("Please select your word.", "error");
                  return;
                }
                if($scope.detectedWords.indexOf(str) !== -1){
                  $scope.activeGridList.map(function(g) {
                      g.active = false;
                  });
                  $scope.activeGridList = [];
                  showSimpleToast("Alredy detected.", "error");
                  return;
                }
                $scope.activePlayer.pass = false;
                if ($scope.word.indexOf(str) !== -1) {
                    showSimpleToast(str + " Right ", "success");
                    $scope.activePlayer.words.push(str);
                    $scope.activePlayer.score += str.length;
                    $scope.detectedWords.push(str);
                    if ($scope.detectedWords.length === $scope.insertedWords.length) {
                        gaveOver("Congratulations !!!, You guys detected all words.");
                        return false;
                    }

                } else {
                    showSimpleToast(str + " Wrong ", "error");
                }
                $scope.activeGridList.map(function(g) {
                    g.active = false;
                });
                $scope.activeGridList = [];
                updateActivePlayer();
                if (service.isBot) {
                    setTimeout(function() {
                        botHandler();
                    }, 500)
                }
            } else {
                gaveOver("No Use !!!. Its already over.");
            }
        }

        $scope.selectGrid = function(that) {
            console.log(this.grid);
            if (validateNext(this.grid)) {
                $scope.activeGridList.push(this.grid);
                this.grid.active = true;
            } else {

            }
        }

        /*Start of Bot related functionality*/

        function botSelectGrid(grid, botWord) {
            console.log(grid);
            $scope.activeGridList.push(grid);
            grid.active = true;
        }

        function botSubmit(botWord) {
            showSimpleToast(botWord.word + " Right ","success");
            $scope.activePlayer.pass = false;
            $scope.activePlayer.words.push(botWord.word);
            $scope.activePlayer.score += botWord.word.length;
            $scope.detectedWords.push(botWord.word);
            if ($scope.detectedWords.length === $scope.insertedWords.length) {
                gaveOver("Congratulations !!!, You guys detected all words.");
                return false;
            }
            $scope.activeGridList.map(function(g) {
                g.active = false;
            });
            $scope.activeGridList = [];
            updateActivePlayer();
        }

        function botHandler() {
            var botWord = $scope.botData.filter(function(b) {
                if ($scope.detectedWords.indexOf(b.word) === -1) {
                    return b;
                }
            })[0];
            console.log("botWord===>" + botWord.word);
            var botGrids = $scope.gridData.filter(function(g) {
                for (var i = 0; i < botWord.gridList.length; i++) {
                    if (g.x === botWord.gridList[i].x && g.y === botWord.gridList[i].y) {
                        botSelectGrid(g, botWord);
                    }
                }

            })
            setTimeout(function() {
                botSubmit(botWord);
            }, 4000);

        }

        /*End  of Bot related functionality*/

        /*Start of validating Click on grid item*/

        function validateNext(grid) {
            switch ($scope.activeGridList.length) {
                case 0:
                    return true;
                    break;
                case 1:
                    return isValidGridClicked(grid);
                    break;
                default:
                    return isUnidirectional(grid);
                    break;
            }
        }

        function isValidGridClicked(grid) {
            var x = $scope.activeGridList[0].x;
            var y = $scope.activeGridList[0].y;
            var valid = [
                [x + 1, y],
                [x - 1, y],
                [x, y + 1],
                [x, y - 1],
                [x + 1, y + 1],
                [x - 1, y - 1],
                [x + 1, y - 1],
                [x - 1, y + 1]
            ];
            return valid.filter(function(v) {
                if (v[0] === grid.x && v[1] === grid.y) {
                    return grid;
                }
            })[0];
        }

        function isUnidirectional(grid) {
            var xRelation = $scope.activeGridList[0].x - $scope.activeGridList[1].x;
            var yRelation = $scope.activeGridList[0].y - $scope.activeGridList[1].y;
            if (($scope.activeGridList[$scope.activeGridList.length - 1].x - grid.x) === xRelation &&
                ($scope.activeGridList[$scope.activeGridList.length - 1].y - grid.y) === yRelation) {
                return true;
            }
            return false;
        }

          /*End of validating Click on grid item*/


        /*Start of Creating a new Grid*/

        function create15X15Grid() {
            var grid = '';
            for (var y = 0; y < 15; y++) {
                for (var x = 0; x < 15; x++) {
                    var gridMap = {};
                    gridMap.x = x;
                    gridMap.y = y;
                    gridMap.value = null;
                    gridMap.active = false;
                    $scope.gridData.push(gridMap);
                }
            }
        }

        function getRandomGrid() {
            return {
                x: Math.floor(Math.random() * (14 - 0 + 1)) + 0,
                y: Math.floor(Math.random() * (14 - 0 + 1)) + 0
            }
        }

        function getRandomWord() {
            return $scope.word[Math.floor(Math.random() * $scope.word.length)];
        }

        function getRandomAlphabet() {
            return $scope.alphabets[Math.floor(Math.random() * $scope.alphabets.length)];
        }

        function getRandomDirection(directions) {
            return $scope.word[Math.floor(Math.random() * $scope.word.length)];
        }

        function getRandomNumer10to20() {
            return  Math.floor(Math.random() * (20 - 10 + 1)) + 10
        }

        function fillInitials() {
            var len = getRandomNumer10to20();
            for (var i = 0; i < len; i++) {
                var word = getValidWord();
                var gridList = getValidGridList(word);
                renderGridList(gridList, word);
            }
            $scope.gridData.map(function(g) {
                if (!g.value) {
                    g.value = getRandomAlphabet();
                }

            })

        }

        function renderGridList(gridList, word) {
            for (var i = 0; i < gridList.length; i++) {
                $("div[data-x='" + gridList[i].x + "'][data-y='" + gridList[i].y + "']").html(word[i]);
                gridList[i].value = word[i];
            }
            if (service.isBot) {
                $scope.botData.push({
                    gridList: gridList,
                    word: word
                });
            }

        }

        function getValidWord() {
            var word = null;
            while (!word) {
                word = isInsertedWord(getRandomWord()); //tends to infinity

            }
            return word;
        }

        function isInsertedWord(word) {
            if ($scope.insertedWords.indexOf(word) !== -1) {
                return false;
            } else {
                $scope.insertedWords.push(word);
            }
            return word;
        }

        function getValidGridList(word) {
            var gridList = null;
            while (!gridList) {
                gridList = isValidGrid(word, getRandomGrid()); //tends to infinity
            }
            return gridList;
        }

        function isValidGrid(word, grid) {
            var directionList = ['left', 'right', 'top', 'bottom'];
            var visitedDirection = [];
            var gridList = null;
            while (!gridList) {
                var direction = getNewDirection();
                if (direction) {
                    gridList = getValidGrid(word, grid, direction);
                } else {
                    return false;
                }
            }
            return gridList;

            function getNewDirection() {
                var direction = getRandomDirection();
                if (visitedDirection.indexOf(direction) === -1) {
                    visitedDirection.push(direction);
                    return direction;
                } else if (visitedDirection.length === 4) {
                    return false;
                } else {
                    getNewDirection();
                }
                return false;
            }

            function getRandomDirection() {
                return directionList[Math.floor(Math.random() * directionList.length)];
            }

        }

        function getValidGrid(word, grid, direction) {
            var wordLength = word.length;
            var validGridList = [];
            var isEmpty = null;
            switch (direction) {
                case 'right':
                    if (grid.x + wordLength < 15) {
                        for (var i = grid.x; i < (grid.x + wordLength); i++) {
                            if (isEmptyGrid([i, grid.y]).length) {
                                validGridList.push(isEmptyGrid([i, grid.y])[0]);
                            } else {
                                return false;
                            }
                        }
                        return validGridList;
                    }
                    return false;
                case 'left':
                    if (grid.x - wordLength > 0) {
                        for (var i = grid.x; i > (grid.x - wordLength); i--) {
                            if (isEmptyGrid([i, grid.y]).length) {
                                validGridList.push(isEmptyGrid([i, grid.y])[0]);
                            } else {
                                return false;
                            }
                        }
                        return validGridList;
                    }
                    return false;
                case 'top':
                    if (grid.y - wordLength > 0) {
                        for (var i = grid.y; i > (grid.y - wordLength); i--) {
                            if (isEmptyGrid([grid.x, i]).length) {
                                validGridList.push(isEmptyGrid([grid.x, i])[0]);
                            } else {
                                return false;
                            }
                        }
                        return validGridList;
                    }
                    return false;
                case 'bottom':
                    if (grid.y + wordLength < 15) {
                        for (var i = grid.y; i < (grid.y + wordLength); i++) {
                            if (isEmptyGrid([grid.x, i]).length) {
                                validGridList.push(isEmptyGrid([grid.x, i])[0]);
                            } else {
                                return false;
                            }
                        }
                        return validGridList;
                    }
                    return false;
                default:
                    return false;
            }
            return false;
        }

        function isEmptyGrid(grid) {
            return $scope.gridData.filter(function(g) {
                if (g.x === grid[0] && g.y === grid[1] && g.value === null) {
                    return g;
                }
            });
        }


        /* start utility functions */

        function showSimpleToast(str,type) {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                .textContent(str)
                .position(pinTo)
                .hideDelay(3000)
                .theme(type+ "-toast")
            );
        };

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({}, last);

        $scope.getToastPosition = function() {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function(pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;

            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;

            last = angular.extend({}, current);
        }

        $scope.go = function(path) {
            $location.path(path);
        };

        $scope.showAlert = function(ev, message) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title('Game Over !!!')
                .textContent(message)
                .ariaLabel('Alert Dialog Demo')
                .targetEvent(ev)
            );
        };
          /* end utility functions */
    });
