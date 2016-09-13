'use strict';

/**
 * @ngdoc service
 * @name puzzleApp.service.js
 * @description
 * # service.js
 * Service in the puzzleApp.
 */
angular.module('puzzleApp')
    .service('service', [function($scope,$mdToast) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var service = {};
        service.isBot = false;
        service.resume = false;
        service.words = [ "the", "of", "and", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part" ];
        service.players =  [{
            name: "Anshul",
            score: 0,
            active: true,
            words: [],
            avator: "https://www.gravatar.com/avatar/1be6d1f474f79a6bb38696f3f69b879d?s=328&d=identicon&r=PG"
        }];


        return service;

        //------------------------PRIVATE FUNCTIONS-------------------------------//
        function createRequest(options) {
            var reqObject = {};

            reqObject['url'] = options.url;
            reqObject['method'] = options.method;
            reqObject['crossDomain'] = true;

            if (reqObject.method.toLowerCase() == "post" || reqObject.method.toLowerCase() == "put") {
                reqObject['data'] = options.data;
                reqObject['dataType'] = 'application/json';
                reqObject['contentType'] = 'application/json';
            }
            return $http(reqObject);
        }
    }]);
