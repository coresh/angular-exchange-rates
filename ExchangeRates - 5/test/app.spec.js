// Only test the controller in isolation, (i.e. mock out the getRateInfo service)
describe('AppController', function() {
  var controller, $scope;
  
  beforeEach(function() {
    // Create a test module with a mock getRateInfo function 
    angular.module('test', ['app']).factory('getRateInfo', function() {
      // Use jasmine's spies to track whether this service gets called
      return jasmine.createSpy('getRateInfo').andReturn({ then: function() { return { rates: [] }; } });
    });
  });

  beforeEach(module('test'));
  beforeEach(inject(function($rootScope, $controller, getRateInfo) {
    $scope = $rootScope;
    controller = $controller('AppController', {$scope: $scope});
  }));

  it("should set up currencies", inject(function(getRateInfo) {
    // Check that the service got called twice
    expect(getRateInfo).toHaveBeenCalled();
    expect(getRateInfo.calls.length).toEqual(2);

    // Check that we have initialized the from and to currencies
    expect($scope.fromCurrency).toBeUndefined();
    expect($scope.toCurrency).toBeUndefined();
  }));

  it("should calculate the currency values correctly", function() {
    // Mock up the currencies
    $scope.fromCurrency = { rate: 0.5 };
    $scope.toCurrency = { rate: 0.8 };

    $scope.fromVal = 40;
    $scope.updateToVal();
    expect($scope.toVal).toEqual(64);

    $scope.toVal = 40;
    $scope.updateFromVal();
    expect($scope.fromVal).toEqual(25);
  });

  it('should update toVal when to or from currency changes', function() {
  // Mock up the currencies
    $scope.fromCurrency = { rate: 0.5 };
    $scope.toCurrency = { rate: 0.8 };
    $scope.fromVal = 40;

    $scope.$digest();
    expect($scope.toVal).toEqual(64);

    $scope.fromCurrency = { rate: 0.2 };
    $scope.$digest();
    expect($scope.toVal).toEqual(160);

    $scope.toCurrency = { rate: 0.5 };
    $scope.$digest();
    expect($scope.toVal).toEqual(100);
  });
});