'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
require('sinon-as-promised')(require('bluebird'));

let requires;
let modProxy;

describe(__filename, function() {
  beforeEach(function() {
    modProxy = null;
    requires = null;

    requires = {
      'request-promise': sinon.stub()
    };

    delete require.cache[require.resolve('./index.js')];
    modProxy = proxyquire('./index.js', requires);
  });

  describe('#callService', function() {
    const inputGetParams = {
      guid: '1234',
      path: '/some/path',
      method: 'GET',
      headers: {Authorization: '123'},
      params: {emailAddress: 'colton.cave@noemail.com'},
      timeout: 20000
    };
    const inputPostParams = {
      guid: '1234',
      path: '/some/path',
      method: 'POST',
      headers: {Authorization: '123'},
      params: {emailAddress: 'colton.cave@noemail.com'},
      timeout: 20000
    };
    const expectedGetParams = {
      url: '1234/some/path',
      method: 'GET',
      headers: {Authorization: '123'},
      qs: {emailAddress: 'colton.cave@noemail.com'},
      timeout: 20000,
      json: true,
      resolveWithFullResponse: true
    };
    const expectedPostParams = {
      url: '1234/some/path',
      method: 'POST',
      headers: {Authorization: '123'},
      body: {emailAddress: 'colton.cave@noemail.com'},
      timeout: 20000,
      json: true,
      resolveWithFullResponse: true
    };
    const inputParamsNoHeaders = {
      guid: '1234',
      path: '/some/path',
      method: 'GET',
      params: {emailAddress: 'colton.cave@noemail.com'}
    };
    const expectedParamsNoHeaders = {
      url: '1234/some/path',
      method: 'GET',
      qs: {emailAddress: 'colton.cave@noemail.com'},
      headers: {'accept': 'application/json'},
      timeout: 20000,
      json: true,
      resolveWithFullResponse: true
    };
    const statusCode = 404;

    it('should call request once', function() {
      requires['request-promise'].resolves({statusCode: 200, body: {}});
      return modProxy(inputGetParams)
      .then(function() {
        expect(requires['request-promise'].callCount).to.eql(1);
        const call1 = requires['request-promise'].getCall(0).args[0];
        expect(call1).to.eql(expectedGetParams);
      });
    });

    it('should call request once for Post call', function() {
      requires['request-promise'].resolves({statusCode: 200, body: {}});
      return modProxy(inputPostParams)
      .then(function() {
        expect(requires['request-promise'].callCount).to.eql(1);
        const call1 = requires['request-promise'].getCall(0).args[0];
        expect(call1).to.eql(expectedPostParams);
      });
    });

    it('should call fh.service once and prepopulate the accept header', function() {
      requires['request-promise'].resolves({statusCode: 200, body: {}});
      return modProxy(inputParamsNoHeaders)
      .then(function() {
        expect(requires['request-promise'].callCount).to.eql(1);
        const call1 = requires['request-promise'].getCall(0).args[0];
        expect(call1).to.eql(expectedParamsNoHeaders);
      });
    });

    it('should return an error and send an error back if a non 200 statusCode is returned', function() {
      requires['request-promise'].resolves({statusCode: statusCode, body: undefined});
      return modProxy(inputGetParams)
      .catch(function(err) {
        expect(JSON.stringify(err)).to.contain('404');
      });
    });

  });

});