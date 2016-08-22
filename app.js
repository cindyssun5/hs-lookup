angular.module("hs", [])

.config(function($httpProvider) {
  $httpProvider.defaults.headers.get = {
    'X-Mashape-Authorization': 'arTq6BLPQRmshAdHvIgnuloUhDTip1im2OqjsnQ0KISzmHOFJ2'
  };
})

.controller("mainController", function($scope, CardDB) {
  $scope.title = 'Hello World!';

  $scope.cardInfo = {};

  $scope.getCardInfo = function(name) {
    CardDB.getCardsByName(name)
      .then(function(data) {
        $scope.cardInfo = data;
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
