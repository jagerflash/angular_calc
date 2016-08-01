/*describe('calculator', function () {
    
  beforeEach(module('calculatorApp'));
  var $controller;
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));
  describe('sum', function () {
    it('1 + 1 should equal 2', function () {
      var $scope = {};
      var controller = $controller('CalculatorController', { $scope: $scope });
      $scope.x = 1;
      $scope.y = 1;
      $scope.sum();
      expect($scope.z).toBe(3);
    }); 
  });
});*/

describe('calculator', function () {
  beforeEach(module('calc'));
  var $controller,
      $keysService,
      $dataService,
      $calcService;
      
  beforeEach(inject(function(_$controller_, _keysService_, _dataService_, _calcService_){
    $controller = _$controller_;
    $keysService = _keysService_;
    $dataService = _dataService_;
    $calcService = _calcService_;
  }));
  
  describe('default_params', function () {
    it('start params must have', function () {
      var $scope = {};
      var controller = $controller('calcController', { $scope: $scope });
      expect($scope.result).toBe(0);
      expect($scope.type).toBe('simple');
    }); 
  });
  describe('services', function () {
    it('have keys', function () {
      expect($keysService).toBeDefined();
    }); 
    it('have data', function () {
      expect($dataService).toBeDefined();
    });
    it('have calc', function () {
      expect($calcService).toBeDefined();
    });
  });
  
  describe('model-test', function () {
    it('has all keys', function(){
      var havnt_key = false;
      for(var i in $keysService){
        if($dataService.getKey($keysService[i]) == null) {
          havnt_key = true; 
          break;
        }
      }
      expect(havnt_key).toBeFalsy();
    });
    it('has a storage', function() {
        expect($dataService.getStorage()).toBeDefined();
    })
  });
  
  describe('calc-test', function () {
    function enterKey(key) {
      return $calcService.enterKey($dataService.getKey(key));
    }
    function clear_display() {
      $calcService.enterKey($dataService.getKey($keysService.OP_CLR));
    }
    it('cancel key is work', function (){
      expect($calcService.enterKey($dataService.getKey($keysService.OP_CLR)).result).toBe(0);
    });
    it('digit keys works', function () {
      expect(enterKey($keysService.DIGIT0).result).toBe('0');
      clear_display();
      expect(enterKey($keysService.DIGIT1).result).toBe('1');
      clear_display();
      expect(enterKey($keysService.DIGIT2).result).toBe('2');
      clear_display();
      expect(enterKey($keysService.DIGIT3).result).toBe('3');
      clear_display();
      expect(enterKey($keysService.DIGIT4).result).toBe('4');
      clear_display();
      expect(enterKey($keysService.DIGIT5).result).toBe('5');
      clear_display();
      expect(enterKey($keysService.DIGIT6).result).toBe('6');
      clear_display();
      expect(enterKey($keysService.DIGIT7).result).toBe('7');
      clear_display();
      expect(enterKey($keysService.DIGIT8).result).toBe('8');
      clear_display();
      expect(enterKey($keysService.DIGIT9).result).toBe('9');
      clear_display();
    });
    it('sum is good', function () {
      enterKey($keysService.DIGIT1);
      enterKey($keysService.OP_PLS);
      enterKey($keysService.DIGIT1);
      
      expect(enterKey($keysService.OP_EQL).result).toBe(2);
    });
    it('mulpty point test', function () {
      enterKey($keysService.DIGIT1);
      enterKey($keysService.OP_PNT);
      enterKey($keysService.OP_PNT);
      
      expect(enterKey($keysService.DIGIT1).result).toBe('1.1');
    });
    it('mulpty operation test', function () {
      enterKey($keysService.DIGIT1);
      enterKey($keysService.OP_MUL);
      enterKey($keysService.OP_DIV);
      
      expect(enterKey($keysService.DIGIT1).result).toBe('1/1');
    });
    it('backspace operation test', function () {
      enterKey($keysService.DIGIT1);
      enterKey($keysService.DIGIT0);
      
      expect(enterKey($keysService.OP_BCK).result).toBe('1');
    });
  });
});