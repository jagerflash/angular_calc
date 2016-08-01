angular.module('calc').directive('displayCalc', ['calcService', function(calc, $scope){
    'use strict';
    
    return {
    	link: function (scope, element, attr) {
    		scope.setType = function() {
        		if(scope.type == calc.SIMPLE) {
        			 scope.type = calc.ADVANCED;
        		}
        		else if(scope.type == calc.ADVANCED || scope.type == undefined) {
        		    scope.type = calc.SIMPLE;
        		}
        		
        		scope.keys = calc.setType(scope.type);
        	}
        	scope.keyClicked = function(key){
        		var data = calc.enterKey(key);
        		scope.result = resToStr(data.result);
        		scope.storage = data.storage;
        		setSize();
        	}
        	
        	function setSize() {
        		scope.middle_size = resToStr(scope.result).length > 16;
        		scope.small_size = resToStr(scope.result).length > 21;
        	}
        	function resToStr(res) {
        		return res + '';
        	}
        	
        	scope.setType();
    	},
    	restrict: "AE",
        templateUrl: 'patterns/simple.html'
    }
}]);