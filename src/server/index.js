const request = require('request');

/**
 * For debug use:
 * request.debug = true;
 */

function TeleCube(options) {
  Object.assign(this, options);
}

TeleCube.prototype.check = function check(callPromise) {
  if(!this.secret) callPromise.reject('config: secret is required');
  if(!this.apiUrl) callPromise.reject('config: apiUrl is required');
  if(!this.number) callPromise.reject('config: number is required');
  return this;
}

TeleCube.prototype.call = function call(client) {
  const callPromise = Promise.defer();
  
  this.check(callPromise);

  const data = {
    form: {
      api_key: this.secret,
      caller_id: this.number,
      contact_a: this.agent,
      contact_b: client,
      set_caller_id_leg: 'ab'
    }
  }

  const parseBody = (body) => {
    if(typeof body === 'string') {
      try{
        body = JSON.parse(body);
      }catch(e){
        console.error(e)
        body = body;
      }
    }
    return body;
  }

  request.post(this.apiUrl, data, function (err, res, body) {
    if(err) return callPromise.reject(err);
    body = parseBody(body);
    if(res.statusCode == 200 && body.error == "OK") {
      return callPromise.resolve(body);
    }
    return callPromise.reject(body)
  });

  return callPromise.promise;
}

module.exports = function instance(options) {
  if(!options) throw 'Bad options parameter';
  return new TeleCube(options);
};