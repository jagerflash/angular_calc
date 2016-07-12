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
	this.OP_MRD = "MR";
	
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
		{label: this.OP_PNT, value: "."}, 
		{label: this.OP_DIV, operation: "/"}, 
		{label: this.OP_MUL, operation: "*"},
		{label: this.OP_MNS, operation: "-"}, 
		{label: this.OP_PLS, operation: "+"},
		{label: this.OP_LBR, operation: "("},
		{label: this.OP_RBR, operation: ")"}, 
		{label: this.OP_BCK, operation: "back"},
		{label: this.OP_CLR, operation: "clear"}, 
		{label: this.OP_EQL, operation: "equal"},
		{label: this.OP_PST, operation: function(a){ return a / 100 }},
		{label: this.OP_SQT, operation: function(a){ return Math.sqrt(a) }},
		{label: this.OP_SQR, operation: function(a){ return Math.pow(a, 2) }},
		{label: this.OP_INV, operation: function(a){ return a * -1 }},
		{label: this.OP_MMS, operation: function(a){ 
			if(storage != undefined){
				storage -= parseFloat(a) ;
			}else {
				storage = parseFloat(a) * -1;
			}
			
			return storage; 
		}},
		{label: this.OP_MPL, operation: function(a){ 
			if(storage != undefined){
				storage += parseFloat(a) ;
			}else {
				storage = parseFloat(a) ;
			}
			
			return storage; 
		}},
		{label: this.OP_MCL, operation: function(){ 
			storage = 0;
			
			return storage;
		}},
		{label: this.OP_MRD, operation: function(){ 
			return storage;
		}}
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

var data_model = new Model(); //сделать синглтон

var calc = function() {
    
    // добавляет пропущенные скобки, добавляет недостающий оператор
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
	//убирает 0 в начале числа
	function clear_first_zero(val){
		val = (''+val).search( /^0+/, '');
	}
	//обрезает число
	function reduce(val){
		if(val.toString().length > 10){
			return val.toExponential(10);
		}
			
		return val;
	}
	
	$scope.digitClicked = function(digit) {
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
					console.log($scope.valueA);
					var r = new RegExp($scope.valueA + '$');
					$scope.valueA = key.operation($scope.valueA);
					$scope.display_history = (''+$scope.display_history).replace(r, $scope.valueA);
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
	};
	
    return {
        
    }
}();