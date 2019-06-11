'use strict';
const request = require('request-promise');
const VError = require('verror');

/**
 * Call MBaaS
 * @param  {Object} params arguments for service call
 * @return {Promise} resolves to an object
 */
module.exports = function callService(params) {
  const url = urlPathJoin(params.guid, params.path);
  const options = {
    url: url,
    headers: params.headers || {'accept': 'application/json'},
    method: params.method,
    json: true,
    timeout: params.timeout || 20000,
    resolveWithFullResponse: true
  };
  if (params.method.toLowerCase() === 'get') {
    options.qs = params.params;
  } else {
    options.body =  params.params;
  }
    return request(options)
      .then(function(res) {
        if (res.statusCode && res.statusCode !== 200) {
          console.log('test');
          throw new VError('Status %s returned from call to Service %s', res.statusCode, params.guid);;
        } else {
          return res.body;
        }
    });
};


function urlPathJoin(pathPart1, pathPart2) {
  var pathStr = pathPart1;
  if (pathStr.substr(-1) !== '/') { // doesn't already have trailing slash
    pathStr += '/';
  }
  if (pathPart2.substr(0, 1) === '/') {  // has a leading slash
    pathStr += pathPart2.substr(1); // append without leading slash
  } else { // does not have leading slash
    pathStr += pathPart2;
  }
  return pathStr;
}