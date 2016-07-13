var storage = 0; // память

var key = {}; // кнопки
key.DIGIT1 = "1";
key.DIGIT2 = "2";
key.DIGIT3 = "3";
key.DIGIT4 = "4";
key.DIGIT5 = "5";
key.DIGIT6 = "6";
key.DIGIT7 = "7";
key.DIGIT8 = "8";
key.DIGIT9 = "9";
key.DIGIT0 = "0";
key.OP_DIV = "/";
key.OP_MUL = "*";
key.OP_MNS = "-";
key.OP_PLS = "+";
key.OP_PNT = ".";
key.OP_LBR = "(";
key.OP_RBR = ")";
key.OP_BCK = "←";
key.OP_CLR = "C";
key.OP_EQL = "=";
key.OP_PST = "%";
key.OP_SQT = "√";
key.OP_SQR = "x²";
key.OP_INV = "+-";
key.OP_MMS = "M-";
key.OP_MPL = "M+";
key.OP_MCL = "MC";
key.OP_MRD = "MR";

var model = function(){
	var keys = [
		{label: key.DIGIT1, type:"digital", value: 1}, 
		{label: key.DIGIT2, type:"digital", value: 2}, 
		{label: key.DIGIT3, type:"digital", value: 3},
		{label: key.DIGIT4, type:"digital", value: 4}, 
		{label: key.DIGIT5, type:"digital", value: 5}, 
		{label: key.DIGIT6, type:"digital", value: 6},
		{label: key.DIGIT7, type:"digital", value: 7}, 
		{label: key.DIGIT8, type:"digital", value: 8}, 
		{label: key.DIGIT9, type:"digital", value: 9},
		{label: key.DIGIT0, type:"digital", value: 0},
		{label: key.OP_PNT, type:"digital", value: "."}, 
		{label: key.OP_DIV, type:"operand", operation: "/"}, 
		{label: key.OP_MUL, type:"operand", operation: "*"},
		{label: key.OP_MNS, type:"operand", operation: "-"}, 
		{label: key.OP_PLS, type:"operand", operation: "+"},
		{label: key.OP_LBR, type:"operand", operation: "("},
		{label: key.OP_RBR, type:"operand", operation: ")"}, 
		{label: key.OP_BCK, type:"selective", operation: "back"},
		{label: key.OP_CLR, type:"selective", operation: "clear"}, 
		{label: key.OP_EQL, type:"selective", operation: "equal"},
		{label: key.OP_PST, type:"modifiers", operation: function(a){ return a / 100 }},
		{label: key.OP_SQT, type:"modifiers", operation: function(a){ return Math.sqrt(a) }},
		{label: key.OP_SQR, type:"modifiers", operation: function(a){ return Math.pow(a, 2) }},
		{label: key.OP_INV, type:"modifiers", operation: function(a){ 
			if(a == '') throw new Error('empty');
			return (parseFloat(a) * -1)+'' 
		}},
		{label: key.OP_MMS, type:"memory", operation: function(a){ 
			if(storage != undefined){
				storage -= parseFloat(a) ;
			}else {
				storage = parseFloat(a) * -1;
			}
			
			return storage; 
		}},
		{label: key.OP_MPL, type:"memory", operation: function(a){ 
			if(storage != undefined){
				storage += parseFloat(a) ;
			}else {
				storage = parseFloat(a) ;
			}
			
			return storage; 
		}},
		{label: key.OP_MCL, type:"memory", operation: function(){ 
			storage = 0;
			
			return storage;
		}},
		{label: key.OP_MRD, type:"memory", operation: function(){ 
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
  	}
	}
}();

var calc = function(){
  //private
	var error           = 'Error',
    	calc_type       = 'simple',
    	result          = '0',
    	expression      = '0',
    	clearValue      = true
    	
  // обработка введенных данных
  function enterKey(key) {
    if(key.type != 'digital'){
      reset();
    } 
    
    switch (key.type) {
      case 'digital':
        var digit = key.value;
        
        if(expression.toString().length > 17) return;
        
  		  if (clearValue == true) {
    			clearValue = false;
    			result = digit+'';
    			expression = digit+'';
    		}else{
    			expression += digit+'';
    			result += digit+'';
    		}
    		console.log(result);
    		result = clear_first_zero(result);
    		console.log(result);
        break;
      case 'operand':
        result += key.operation;
			  expression = '';
			  reset();
        break;
      case 'selective':
        if(key.operation == 'back'){ // удалить символ
          result = (result+'').slice(0, (result+'').length-1);
					expression = '';
        }else if(key.operation == 'clear'){ // очистить окно
          result = clear(result);
					expression = '';
        }else if(key.operation == 'equal'){ // вычислить выражение
          result = compute(result);
        }
        break;
      case 'modifiers': 
        try {
					var r = new RegExp(expression + '$');
					expression = key.operation(expression);  // выполняет функцию
					result = (''+result).replace(r, expression); // заменяет старое число, обработанным функцией
				} catch (e) {
					result = error;
					clearValue = true;
				}
        break;
      case 'memory':
        if(key.label == model.OP_MCL){ // очистка памяти
          key.operation();
        }else if(key.label == model.OP_MRD){ // чтение из памяти
          result += key.operation();
        }else { // запись в память
          compute();
					if(result !== error){
						key.operation(result);
					}
        }
        break;
      
      default:
        break;
    }
    
    return result;
  }
  //
  function reset(value) {
    if (clearValue == true) {
			clearValue = false;
			if(result == error){
				result = '';
				expression = '';
			}
		}
  }
  //закрывает скобки, ставит * между скобками и числом
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
	
	//убирает первым символом ноль
	function clear_first_zero(val){
		return (val+'').replace( /^0+/, '');
	}
	
  //форматирование числа (укорачивание)
	function reduce(val){
		if(val.toString().length > 10){
			return val.toExponential(9);
		}
			
		return val;
	}
	
	//чистка вывода, переменных
  function clear (result) {
    result = 0;
		clearValue = true;
		
		return result;
  }
  
  //расчет
  function compute (result) {
    var res = result;
		
		try{
			res = close_brackets(res);
			res = eval(res);
			result = reduce(res);
			expression = result;
		}catch (e){
			result = error; //Malformed expression
		}
		clearValue = true;
		
		return result;
  }
  
  //public
  return {
    SIMPLE: 'simple',
    ADVANCED: 'advanced',
    //меняет тип
    setType: function (type) {
      var key_config;
      
      calc_type = type;
      if(calc_type == 'simple') {
  			key_config = model.getKeys([
  				key.DIGIT1, key.DIGIT2, key.DIGIT3, key.OP_BCK, key.OP_CLR,
  				key.DIGIT4, key.DIGIT5, key.DIGIT6, key.OP_MNS, key.OP_PLS,
  				key.DIGIT7, key.DIGIT8, key.DIGIT9, key.OP_DIV, key.OP_MUL,
  				key.DIGIT0, key.OP_INV, key.OP_PNT, key.OP_EQL	
  			]);
  		}else {
  			key_config = model.getKeys([
  				key.OP_MPL, key.OP_MMS, key.OP_MCL, key.OP_MRD, key.OP_CLR,
  				key.OP_SQR, key.OP_SQT, key.OP_PST, key.OP_BCK, 
  				key.DIGIT1, key.DIGIT2, key.DIGIT3, key.OP_LBR, key.OP_RBR, 
  				key.DIGIT4, key.DIGIT5, key.DIGIT6, key.OP_MNS, key.OP_PLS,
  				key.DIGIT7, key.DIGIT8, key.DIGIT9, key.OP_DIV, key.OP_MUL,
  				key.OP_PNT, key.DIGIT0, key.OP_INV, key.OP_EQL
  			]);
  		}
  		
  		return key_config;
    },
    //ввод данных
    enterKey: function(digit) {
      return enterKey(digit);
    }
  }
}();