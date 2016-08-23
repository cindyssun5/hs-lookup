angular.module("hs", ['ngRoute'])

.config(function($httpProvider, $routeProvider) {
  $httpProvider.defaults.headers.get = {
    'X-Mashape-Authorization': 'arTq6BLPQRmshAdHvIgnuloUhDTip1im2OqjsnQ0KISzmHOFJ2'
  };

  $routeProvider
    .when('/cardsearch', {
      templateUrl: 'client/views/cardsearch.html',
      controller: 'mainController'
    })
    .when('/othersearch', {
      templateUrl: 'client/views/othersearch.html',
      controller: 'mainController'
    })
})

.controller("mainController", function($scope, CardDB) {
  $scope.title = 'Hearthstone Lookup';

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

  return {
    getCardsByName: getCardsByName
  };

});
