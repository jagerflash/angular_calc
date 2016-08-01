var app = angular.module('calc', []);
        
app.controller('calcController', ['$scope',function($scope){
    $scope.storage = false;
	$scope.result = 0;
	$scope.type = 'simple';
}]);