var app = angular.module('calc', []);
app.controller("calcController", function ($scope) {
	$scope.keys = [
		{label: "1", value: 1}, {label: "2", value: 2}, {label: "3", value: 3},
		{label: "4", value: 4}, {label: "5", value: 5}, {label: "6", value: 6},
		{label: "7", value: 7}, {label: "8", value: 8}, {label: "9", value: 9},
		{label: "0", value: 0}
	];
	$scope.equa = {label: "="};
	$scope.operations = [
		{label: "/", operation: function (a, b) {return a / b}},
		{label: "*", operation: function (a, b) {return a * b}},
		{label: "+", operation: function (a, b) {return a + b}},
		{label: "-", operation: function (a, b) {return a - b}}
	];
	
	$scope.digitClicked = function(digit){
		if ($scope.clearValue) {
			$scope.displayValue = digit;
			$scope.clearValue = false;
		} else {
			$scope.displayValue = $scope.displayValue * 10 + digit;
		}
		if($scope.clearHistory){
			$scope.display_history_Value = '';
		}
		
		$scope.valueB = $scope.displayValue
		$scope.display_history_Value += digit;
		if($scope.display_history_Value.length == 2 && $scope.display_history_Value.indexOf('0') == 0) 
		$scope.display_history_Value = digit;
		$scope.clearHistory = false;
	}
	
	$scope.operationClicked = function (op) {
		$scope.selectedOperation = op.operation;
		$scope.valueA = $scope.displayValue;
		$scope.valueB = $scope.displayValue;
		$scope.clearValue = true;
		$scope.display_history_Value += op.label.toString();
	};

	$scope.compute = function () {
		var history = $scope.display_history_Value;
		if($scope.display_history_Value == ''){
			$scope.displayValue = 0;
		}else {
			$scope.displayValue = eval(history);
			$scope.display_history_Value += '='+$scope.displayValue;
		}
		$scope.clearValue = true;
		$scope.clearHistory = true;
	}
	
	$scope.clear = function(){
		$scope.displayValue = 0;
		$scope.display_history_Value = '';
	}
	
	$scope.display_history_Value = '';
	$scope.displayValue = 0;
	$scope.valueA = 0;
	$scope.valueB = 0;
	$scope.selectedOperation = null;
	$scope.clearValue = true;
	$scope.clearHistory = true;
});