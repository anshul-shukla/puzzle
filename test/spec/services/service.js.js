'use strict';

describe('Service: service.js', function () {

  // load the service's module
  beforeEach(module('puzzleApp'));

  // instantiate service
  var service.js;
  beforeEach(inject(function (_service.js_) {
    service.js = _service.js_;
  }));

  it('should do something', function () {
    expect(!!service.js).toBe(true);
  });

});
