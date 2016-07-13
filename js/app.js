var app = angular.module('calc', []);
app.controller("calcController", function ($scope) {
	//размеры
	$scope.type;
	$scope.result = '0';
	
	$scope.setType = function() {
		if($scope.type == calc.SIMPLE || $scope.type == undefined) {
			 $scope.type = calc.ADVANCED;
		}
		else if($scope.type == calc.ADVANCED) {
			$scope.type = calc.SIMPLE;
		}
		
		$scope.keys = calc.setType($scope.type);
	}
	$scope.keyClicked = function(key){
		var res = calc.enterKey(key);
		$scope.result = resToStr(res);
		setSize();
	}
	
	function setSize() {
		$scope.middle_size = resToStr($scope.result).length > 16;
		$scope.small_size = resToStr($scope.result).length > 21;
	}
	function resToStr(res) {
		return res + '';
	}
	
	$scope.setType();
});

/*

$scope.keyClicked = function(key) {
		if(key.value !== undefined) {
			$scope.digitClicked(key.value)
		} else if (key.operation !== undefined) {
			$scope.operationClicked(key);
		}
	}
	
	$scope.digitClicked = function(digit) {
		if($scope.valueA.toString().length > 17) return;
		if ($scope.clearValue == true) {
			$scope.clearValue = false;
			$scope.display_history = digit;
			$scope.displayValue = 0;
			$scope.valueA = digit+'';
		}else{
			$scope.valueA += digit+'';
			$scope.display_history += digit+'';
		}
		
		clear_first_zero($scope.display_history);
	}
	
	$scope.operationClicked = function (key) {
		if ($scope.clearValue == true) {
			$scope.clearValue = false;
			if($scope.display_history == 'Error'){
				$scope.display_history = '';
				$scope.valueA = '';
			}
		}
		if(typeof key.operation == 'function') {
			switch (key.label) {
				case data_model.OP_MCL:
					key.operation();
					break;
				case data_model.OP_MMS:
					$scope.compute();
					if($scope.display_history !== 'Error'){
						key.operation($scope.display_history);
					}
					break;
				case data_model.OP_MPL:
					$scope.compute();
					if($scope.display_history !== 'Error'){
						key.operation($scope.display_history);
					}
					break;
				case data_model.OP_MRD:
					$scope.display_history += key.operation();
					break;
				
				default:
					try {
						var r = new RegExp($scope.valueA + '$');
						$scope.valueA = key.operation($scope.valueA);
						$scope.display_history = (''+$scope.display_history).replace(r, $scope.valueA);
					} catch (e) {
						$scope.display_history = 'Error';
						$scope.clearValue = true;
					}
			}
			
		}else if(typeof key.operation == 'string'){
			switch (key.operation) {
				case 'back':
					$scope.display_history = (''+$scope.display_history).slice(0, (''+$scope.display_history).length-1);
					$scope.valueA = '';
					break;
				case 'clear':
					$scope.clear();
					$scope.valueA = '';
					break;
				case 'equal':
					$scope.compute();
					break;
				
				default:
					$scope.display_history += key.operation;
					$scope.valueA = '';
			}
		}
		$scope.small_size = $scope.display_history.length > 16;
		$scope.mikro_size = $scope.display_history.length > 21;
	};

	$scope.compute = function () {
		var history = $scope.display_history;
		if(history == ''){
			$scope.displayValue = 0;
		}else {
			try{
				history = close_brackets(history);
				var res = eval(history);
				// $scope.displayValue = reduce(res);
				// $scope.display_history = history;
				$scope.display_history = reduce(res);
				$scope.valueA = $scope.display_history;
			}catch (e){
				$scope.displayValue = 0; 
				$scope.display_history = 'Error';//Malformed expression
			}
		}
		$scope.clearValue = true;
		$scope.small_size = $scope.display_history.length > 16;
		$scope.mikro_size = $scope.display_history.length > 21;
	}
	
	$scope.clear = function(){
		$scope.displayValue = 0;
		$scope.display_history = 0;
		$scope.clearValue = true;
	}
	$scope.setType = function(val){
		$scope.type = val;
		
		if($scope.type == 'simple') {
			$scope.keys = data_model.getKeys([
				data_model.DIGIT1, data_model.DIGIT2, data_model.DIGIT3, data_model.OP_BCK, data_model.OP_CLR,
				data_model.DIGIT4, data_model.DIGIT5, data_model.DIGIT6, data_model.OP_MNS, data_model.OP_PLS,
				data_model.DIGIT7, data_model.DIGIT8, data_model.DIGIT9, data_model.OP_DIV, data_model.OP_MUL,
				data_model.DIGIT0, data_model.OP_INV, data_model.OP_PNT, data_model.OP_EQL	
			]);
		}else {
			$scope.keys = data_model.getKeys([
				data_model.OP_MPL, data_model.OP_MMS, data_model.OP_MCL, data_model.OP_MRD, data_model.OP_CLR,
				data_model.OP_SQR, data_model.OP_SQT, data_model.OP_PST, data_model.OP_BCK, 
				data_model.DIGIT1, data_model.DIGIT2, data_model.DIGIT3, data_model.OP_LBR, data_model.OP_RBR, 
				data_model.DIGIT4, data_model.DIGIT5, data_model.DIGIT6, data_model.OP_MNS, data_model.OP_PLS,
				data_model.DIGIT7, data_model.DIGIT8, data_model.DIGIT9, data_model.OP_DIV, data_model.OP_MUL,
				data_model.OP_PNT, data_model.DIGIT0, data_model.OP_INV, data_model.OP_EQL
			]);
		}
	}
	
	
	function close_brackets(str){
		str+='';
		while (str.split('(').length > str.split(')').length){
			str = str.concat(')');
		}
		while (str.split('(').length < str.split(')').length){
			str = ('(').concat(str);
		}

		var r = /\d\(/g;

		str = str.replace(r, function(str){
		  return str.replace('(','*(');
		})
		
		return str;
	}
	function clear_first_zero(val){
		val = (''+val).search( /^0+/, '');
	}
	function reduce(val){
		if(val.toString().length > 10){
			return val.toExponential(10);
		}
			
		return val;
	}
*/