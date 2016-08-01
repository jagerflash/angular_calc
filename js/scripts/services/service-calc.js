angular.module('calc').factory('calcService', ['keysService', 'dataService', function(keyboard, model){
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
    	var expr = /\d\(/;
    	var r = new RegExp(expr, 'g');
    
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
    		console.log(e);
    		result = error; //Malformed expression
    	}
    	clearValue = true;
    	
    	return result;
    }
      
    return{
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
          return {result: enterKey(digit), storage: model.getStorage()};
        }
    };
}])