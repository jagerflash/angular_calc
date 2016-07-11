var app = angular.module('calc', []);
var storage = undefined;
var Model = function(){
	this.DIGIT1 = "1";
	this.DIGIT2 = "2";
	this.DIGIT3 = "3";
	this.DIGIT4 = "4";
	this.DIGIT5 = "5";
	this.DIGIT6 = "6";
	this.DIGIT7 = "7";
	this.DIGIT8 = "8";
	this.DIGIT9 = "9";
	this.DIGIT0 = "0";
	this.OP_DIV = "/";
	this.OP_MUL = "*";
	this.OP_MNS = "-";
	this.OP_PLS = "+";
	this.OP_PNT = ".";
	this.OP_LBR = "(";
	this.OP_RBR = ")";
	this.OP_BCK = "←";
	this.OP_CLR = "C";
	this.OP_EQL = "=";
	this.OP_PST = "%";
	this.OP_SQT = "√";
	this.OP_SQR = "x²";
	this.OP_INV = "+-";
	this.OP_MMS = "M-";
	this.OP_MPL = "M+";
	this.OP_MCL = "MC";
	
	var _this = this;
	var keys = [
		{label: this.DIGIT1, value: 1}, 
		{label: this.DIGIT2, value: 2}, 
		{label: this.DIGIT3, value: 3},
		{label: this.DIGIT4, value: 4}, 
		{label: this.DIGIT5, value: 5}, 
		{label: this.DIGIT6, value: 6},
		{label: this.DIGIT7, value: 7}, 
		{label: this.DIGIT8, value: 8}, 
		{label: this.DIGIT9, value: 9},
		{label: this.DIGIT0, value: 0},
		{label: this.OP_DIV, operation: "/"}, 
		{label: this.OP_MUL, operation: "*"},
		{label: this.OP_MNS, operation: "-"}, 
		{label: this.OP_PLS, operation: "+"},
		{label: this.OP_PNT, operation: "."}, 
		{label: this.OP_LBR, operation: "("},
		{label: this.OP_RBR, operation: ")"}, 
		{label: this.OP_BCK, operation: "back"},
		{label: this.OP_CLR, operation: "clear"}, 
		{label: this.OP_EQL, operation: "equal"},
		{label: this.OP_PST, operation: function(a, b){ return Math.floor((a / b) * 100) }},
		{label: this.OP_SQT, operation: function(a){ return Math.sqrt(a) }},
		{label: this.OP_SQR, operation: function(a){ return Math.pow(a, 2) }},
		{label: this.OP_INV, operation: function(a){ return a * -1 }},
		{label: this.OP_MMS, operation: function(a){ 
			if(storage != undefined){
				storage -= a;
			}else {
				storage = a * -1;
			}
			
			return storage; 
		}},
		{label: this.OP_MPL, operation: function(a){ 
			if(storage != undefined){
				storage += a;
			}else {
				storage = a;
			}
			
			return storage; 
		}},
		{label: this.OP_MCL, operation: function(a){ 
			storage = undefined;
			
			return storage;
		}},
	];
	
	this.getKey =function(keyName){
		for(var key in keys){
			if(keys[key].label == keyName.toString()) {
				return keys[key];
			}
		}
		
		return null;
	}
	
	this.getKeys = function(_keys){
		var keys_arr = [];
		for(var key in _keys){
			var k = _this.getKey(_keys[key]);
			if(k){
				keys_arr.push(k);
			}
		}
		
		return keys_arr;
	}
}

var data_model = new Model();

app.controller("calcController", function ($scope) {
	$scope.equa = {label: "="};
	$scope.operations = [
		{label: "/", operation: function (a, b) {return a / b}},
		{label: "*", operation: function (a, b) {return a * b}},
		{label: "+", operation: function (a, b) {return a + b}},
		{label: "-", operation: function (a, b) {return a - b}}
	];
	
/*data_model.DIGIT1, data_model.DIGIT2, data_model.DIGIT3, data_model.OP_BCK, data_model.OP_CLR,
data_model.DIGIT4, data_model.DIGIT5, data_model.DIGIT6, data_model.OP_MNS, data_model.OP_PLS,
data_model.DIGIT7, data_model.DIGIT8, data_model.DIGIT9, data_model.OP_DIV, data_model.OP_MUL,
data_model.DIGIT0, data_model.OP_INV, data_model.OP_PNT, data_model.OP_EQL*/
	
	$scope.keys = data_model.getKeys([
		data_model.OP_MPL, data_model.OP_MMS, data_model.OP_MCL, data_model.OP_BCK,
		data_model.OP_SQR, data_model.OP_SQT, data_model.OP_PST, data_model.OP_CLR, 
		data_model.DIGIT1, data_model.DIGIT2, data_model.DIGIT3, data_model.OP_LBR, data_model.OP_RBR, 
		data_model.DIGIT4, data_model.DIGIT5, data_model.DIGIT6, data_model.OP_MNS, data_model.OP_PLS,
		data_model.DIGIT7, data_model.DIGIT8, data_model.DIGIT9, data_model.OP_DIV, data_model.OP_MUL,
		data_model.DIGIT0, data_model.OP_INV, data_model.OP_PNT, data_model.OP_EQL
	]);
	
	$scope.keyClicked = function(key) {
		if(key.value !== undefined) {
			$scope.digitClicked(key.value)
		} else if (key.operation !== undefined) {
			$scope.operationClicked(key.operation);
		}
	}
	
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
		if(typeof op == 'function') {
			
		}else if(typeof op == 'string'){
			switch (op) {
				case 'back':
					// code
					break;
				case 'clear':
					$scope.clear();
					break;
				case 'equal':
					$scope.compute();
					break;
				
				default:
					$scope.selectedOperation = op.operation;
					$scope.valueA = $scope.displayValue;
					$scope.valueB = $scope.displayValue;
					$scope.clearValue = true;
					$scope.display_history_Value += op;
			}
		}
		return;
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
			var res = eval(history);
			$scope.displayValue = reduce(res);
			$scope.display_history_Value += '='+$scope.displayValue;
		}
		$scope.clearValue = true;
		$scope.clearHistory = true;
	}
	
	$scope.clear = function(){
		$scope.displayValue = 0;
		$scope.display_history_Value = '';
	}
	function reduce(val){
		if(val>1E16 || val<1E-16) {
			return val.toExponential(10);
		}
			
		return val;
	}
	$scope.type = 'simple';
	$scope.display_history_Value = '';
	$scope.displayValue = 0;
	$scope.valueA = 0;
	$scope.valueB = 0;
	$scope.selectedOperation = null;
	$scope.clearValue = true;
	$scope.clearHistory = true;
});