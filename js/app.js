var app = angular.module('calc', ['ngMaterial']);
	
app.controller('calcController', ['$scope', '$mdSidenav',function($scope, $mdSidenav){
	var _this = this;
	$scope.result = 0;
	$scope.storage = 0;
	$scope.type = 'advanced';
	$scope.isCalcDisplay = true;
	_this.selected = 1;
	
	_this.toggleList = function () {
  	$mdSidenav('left').toggle();
  }
	_this.turnOnCalc = function () {
		$scope.isCalcDisplay = !$scope.isCalcDisplay;
		_this.selected = $scope.isCalcDisplay ? 1 : 2;
	}
}]).config(function( $mdIconProvider ){
  $mdIconProvider.icon("menu", "./assets/svg/menu.svg", 24);
  $mdIconProvider.icon("list", "./assets/svg/list.svg", 24);
  $mdIconProvider.icon("calc", "./assets/svg/calc.svg", 24);
});