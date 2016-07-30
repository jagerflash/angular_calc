var storage = 0; // память

var keyboard = {}; // кнопки
keyboard.DIGIT1 = "1";
keyboard.DIGIT2 = "2";
keyboard.DIGIT3 = "3";
keyboard.DIGIT4 = "4";
keyboard.DIGIT5 = "5";
keyboard.DIGIT6 = "6";
keyboard.DIGIT7 = "7";
keyboard.DIGIT8 = "8";
keyboard.DIGIT9 = "9";
keyboard.DIGIT0 = "0";
keyboard.OP_DIV = "/";
keyboard.OP_MUL = "*";
keyboard.OP_MNS = "-";
keyboard.OP_PLS = "+";
keyboard.OP_PNT = ".";
keyboard.OP_LBR = "(";
keyboard.OP_RBR = ")";
keyboard.OP_BCK = "←";
keyboard.OP_CLR = "C";
keyboard.OP_EQL = "=";
keyboard.OP_PST = "%";
keyboard.OP_SQT = "√";
keyboard.OP_SQR = "x²";
keyboard.OP_INV = "+-";
keyboard.OP_MMS = "M-";
keyboard.OP_MPL = "M+";
keyboard.OP_MCL = "MC";
keyboard.OP_MRD = "MR";

var model = function(){
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
        
        if(expression.toString().length > 15) break;
        if(result.toString().length > 30) break;
        
  		  if (clearValue == true) {
    			clearValue = false;
    			result = digit+'';
    			expression = digit+'';
    		}else{
    			expression += digit+'';
    			result += digit+'';
    		}
    		result = clear_first_zero(result);
    		
    		result = result.replace(new RegExp(expression+'$','ig'), pointTest(expression));
    		expression = pointTest(expression);
        break;
      case 'operand':
        result = simpleOperator(result, key.operation);
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
        if(key.label == keyboard.OP_MCL){ // очистка памяти
          key.operation();
        }else if(key.label == keyboard.OP_MRD){ // чтение из памяти
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
		if(val.length <= 1) return val;// единственный ноль возвращает назад
		return (val+'').replace( /^0+/, '');
	}
	
  //форматирование числа (укорачивание)
	function reduce(val){
		if(val.toString().length > 10){
			return val.toExponential(9);
		}
			
		return val;
	}
	// только один оператор после числа
	function simpleOperator(result, operator) {
		result+='';
		return (result.search(/([-,+,*,\/])$/) > 0 ? result.slice(0,-1) : result) + operator;
	}
	// проверка на несколько точек
	function pointTest(result){
	  return result.replace(/^([^\.]*\.)|\./g, '$1');
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
  				keyboard.DIGIT1, keyboard.DIGIT2, keyboard.DIGIT3, keyboard.OP_BCK, keyboard.OP_CLR,
  				keyboard.DIGIT4, keyboard.DIGIT5, keyboard.DIGIT6, keyboard.OP_MNS, keyboard.OP_PLS,
  				keyboard.DIGIT7, keyboard.DIGIT8, keyboard.DIGIT9, keyboard.OP_DIV, keyboard.OP_MUL,
  				keyboard.DIGIT0, keyboard.OP_INV, keyboard.OP_PNT, keyboard.OP_EQL	
  			]);
  		}else {
  			key_config = model.getKeys([
  				keyboard.OP_MPL, keyboard.OP_MMS, keyboard.OP_MCL, keyboard.OP_MRD, keyboard.OP_CLR,
  				keyboard.OP_SQR, keyboard.OP_SQT, keyboard.OP_PST, keyboard.OP_BCK, 
  				keyboard.DIGIT1, keyboard.DIGIT2, keyboard.DIGIT3, keyboard.OP_LBR, keyboard.OP_RBR, 
  				keyboard.DIGIT4, keyboard.DIGIT5, keyboard.DIGIT6, keyboard.OP_MNS, keyboard.OP_PLS,
  				keyboard.DIGIT7, keyboard.DIGIT8, keyboard.DIGIT9, keyboard.OP_DIV, keyboard.OP_MUL,
  				keyboard.OP_PNT, keyboard.DIGIT0, keyboard.OP_INV, keyboard.OP_EQL
  			]);
  		}
  		
  		return key_config;
    },
    //ввод данных
    enterKey: function(digit) {
      return {result: enterKey(digit), storage: storage};
    }
  }
}();