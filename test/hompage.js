var expect  = require('chai').expect;
var request = require('request');


describe('Welcome page' , function() {
  var homeUrl = 'http://localhost:3000/';
  var settingsUrl = 'http://localhost:3000/settings/';

  it('returns status 200 for homepage', function(done) {
    request(homeUrl, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('shout has demo text', function(done) {
    request(homeUrl, function(err, res, body) {
      expect(body).to.contain('welcomeStep1');
      expect(body).to.contain('welcomeStep2');
      expect(body).to.contain('welcomeStep3');
      done();
    });
  });

  describe('Settings', function() {

    it('should save settings', function(done){
      request
        .post({url: settingsUrl, form: {path: '/app/project/stylesheets/'}}, function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          done();
        })
    });

    it('should read settings', function(done){
      request(settingsUrl, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(res.getHeader('content-type')).to.equal('application/json');
        expect(body).to.include.keys("path");
        expect(body).to.include.property("/app/project/stylesheets/");
      });
    });
  });
});
