var expect  = require('chai').expect;
var request = require('request');


describe('Colors page' , function() {
  var colorsUrl = 'http://localhost:3000/colors';


  it('returns status 200', function(done) {
    request(colorsUrl, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

});
