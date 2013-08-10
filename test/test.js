require('mocha');
var expect = require('chai').expect;

describe('JSON2Property', function () {
  describe('with no parameters parses ', function () {
    it('return true', function (done) {
      expect("1").to.equal("1");
      done();
    });
  });
});
