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
    })
  });
});