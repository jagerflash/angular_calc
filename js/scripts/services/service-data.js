angular.module('calc').factory('dataService', ['keysService', function(keyboard){
    var storage = 0;// память
	var keys = [
		{label: keyboard.DIGIT1, type:"digital", value: 1}, 
		{label: keyboard.DIGIT2, type:"digital", value: 2}, 
		{label: keyboard.DIGIT3, type:"digital", value: 3},
		{label: keyboard.DIGIT4, type:"digital", value: 4}, 
		{label: keyboard.DIGIT5, type:"digital", value: 5}, 
		{label: keyboard.DIGIT6, type:"digital", value: 6},
		{label: keyboard.DIGIT7, type:"digital", value: 7}, 
		{label: keyboard.DIGIT8, type:"digital", value: 8}, 
		{label: keyboard.DIGIT9, type:"digital", value: 9},
		{label: keyboard.DIGIT0, type:"digital", value: 0},
		{label: keyboard.OP_PNT, type:"digital", value: "."}, 
		{label: keyboard.OP_DIV, type:"operand", operation: "/"}, 
		{label: keyboard.OP_MUL, type:"operand", operation: "*"},
		{label: keyboard.OP_MNS, type:"operand", operation: "-"}, 
		{label: keyboard.OP_PLS, type:"operand", operation: "+"},
		{label: keyboard.OP_LBR, type:"operand", operation: "("},
		{label: keyboard.OP_RBR, type:"operand", operation: ")"}, 
		{label: keyboard.OP_BCK, type:"selective", operation: "back"},
		{label: keyboard.OP_CLR, type:"selective", operation: "clear"}, 
		{label: keyboard.OP_EQL, type:"selective", operation: "equal"},
		{label: keyboard.OP_PST, type:"modifiers", operation: function(a){ return a / 100 }},
		{label: keyboard.OP_SQT, type:"modifiers", operation: function(a){ return Math.sqrt(a) }},
		{label: keyboard.OP_SQR, type:"modifiers", operation: function(a){ return Math.pow(a, 2) }},
		{label: keyboard.OP_INV, type:"modifiers", operation: function(a){ 
			if(a == '') throw new Error('empty');
			return (parseFloat(a) * -1)+'' 
		}},
		{label: keyboard.OP_MMS, type:"memory", operation: function(a){ 
			if(storage != undefined){
				storage -= parseFloat(a) ;
			}else {
				storage = parseFloat(a) * -1;
			}
			
			return storage; 
		}},
		{label: keyboard.OP_MPL, type:"memory", operation: function(a){ 
			if(storage != undefined){
				storage += parseFloat(a) ;
			}else {
				storage = parseFloat(a) ;
			}
			
			return storage; 
		}},
		{label: keyboard.OP_MCL, type:"memory", operation: function(){ 
			storage = 0;
			
			return storage;
		}},
		{label: keyboard.OP_MRD, type:"memory", operation: function(){ 
			return storage;
		}}
	];
    	
    return {
        getKey : function(keyName){
      		for(var key in keys){
      			if(keys[key].label == keyName.toString()) {
      				return keys[key];
      			}
      		}
      		
      		return null;
      	},
      	getKeys : function(_keys){
      		var keys_arr = [];
      		for(var key in _keys){
      			var k = this.getKey(_keys[key]);
      			if(k){
      				keys_arr.push(k);
      			}
      		}
      		
      		return keys_arr;
      	},
      	getStorage: function(){ 
      	    return storage 
      	}
    };
}]);