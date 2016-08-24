angular.module("hs", ['ngRoute'])

.config(function($httpProvider, $routeProvider) {
  $httpProvider.defaults.headers.get = {
    'X-Mashape-Authorization': 'arTq6BLPQRmshAdHvIgnuloUhDTip1im2OqjsnQ0KISzmHOFJ2'
  };

  $routeProvider
    .when('/cardsearch', {
      templateUrl: 'client/views/cardsearch.html',
      controller: 'cardSearch'
    })
    .when('/othersearch', {
      templateUrl: 'client/views/othersearch.html',
      controller: 'otherSearch'
    })
    .when('/decks', {
      templateUrl: 'client/views/decks.html',
      controller: 'decks'
    });
})

.filter('startFrom', function() {
  return function(input, start) {
    return input.slice(start);
  };
})

.controller("cardSearch", function($scope, CardDB, Deck) {
  $scope.title = 'Hearthstone Lookup';

  $scope.toggle = true;

  $scope.cardsInfo = {};

  $scope.getCardInfo = function(name) {
    CardDB.getCardsByName(name)
      .then(function(data) {
        $scope.cardsInfo = data;
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  $scope.addToDeck = function(name){
    Deck.addToDeck(name);
  };

})

.controller("otherSearch", function($scope, CardDB, Deck) {
  $scope.cardsInfo = {};

  $scope.toggle = true;

  $scope.currentPage = 0;
  $scope.pageSize = 5;

  $scope.makeIntoArray = function(num) {
    return new Array(num);
  };

  $scope.currentPage = function(currentPage) {
    $scope.currentPage = currentPage;
  };

  $scope.totalPages = function() {
    return Math.ceil($scope.cardsInfo.length / $scope.pageSize);
  };


  $scope.getCardsByClass = function(classname, cost, attack, health) {
    CardDB.getCardsByClass(classname, cost, attack, health)
      .then(function(data) {
        $scope.cardsInfo = data;
      })
      .then(function() {
        $scope.cardclass = "";
        $scope.cardcost = "";
        $scope.cardattack = "";
        $scope.cardhealth = "";
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  $scope.addToDeck = function(name){
    Deck.addToDeck(name);
  };

})

.controller("decks", function($scope, Deck){

  $scope.$watch('Deck.deckArray', function(){
    $scope.deck = Deck.deckArray;
  });

  $scope.saveDeckToDB = function(name){
    console.log("entered first saveDeckToDB function")
    Deck.addToDB(name)
      .then(function(resp){
        if(resp.status === 302){
          console.log("Tried to post but error");
          $scope.resp = "Name already exists! Try again.";
        } else {
          Deck.deckArray = [];
          console.log("Posted");
          $scope.resp = resp.deckName + "Saved!";
        }
      });
  };

})

.factory("CardDB", function($http) {

  var getCardsByName = function(name) {
    return $http({
        method: 'GET',
        url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/' + name
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var getCardsByClass = function(cardclass, cost, attack, health) {
    var suffix = '';

    cardCap = cardclass.charAt(0).toUpperCase() + cardclass.slice(1);
    if (cost) {
      suffix = suffix.concat('cost=', cost, '&');
    }
    if (attack) {
      suffix = suffix.concat('attack=', attack, '&');
    }
    if (health) {
      suffix = suffix.concat('health=', health, '&');
    }
    return $http({
        method: 'GET',
        url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/' + cardCap + '?' +
          suffix
      })
      .then(function(resp) {
        console.log('Success GET/ at https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/' + cardclass + suffix);
        return resp.data;
      });
  };

  return {
    getCardsByName: getCardsByName,
    getCardsByClass: getCardsByClass
  };

})

.factory('Deck', function($http){
  var deckArray = [

  ];

  var addToDeck = function(name){
    deckArray.push(name);
    console.log(deckArray);
  };

  var addToDB = function(name){
    console.log('entered addToDB function & name is', name);
    return $http({
      method: 'POST',
      url: '/saveDeck',
      data: {
          'deckName': name,
          'deckArray': deckArray
    }
  })
    .then(function(resp){
      console.log("post successful");
      return resp;
    });
  };

  var getFromDB = function(name){

  };

  return {
    addToDeck: addToDeck,
    deckArray: deckArray,
    addToDB: addToDB
  };
});
