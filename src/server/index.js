const request = require('request');

/**
 * For debug use:
 * request.debug = true;
 */

function TeleCube(options) {
  Object.assign(this, options);
}

TeleCube.prototype.check = function check() {
  if (!this.secret)
    return 'config: secret is required';
  if (!this.apiUrl)
    return 'config: apiUrl is required';
  if (!this.number)
    return 'config: number is required';
}

TeleCube.prototype.call = function call(client) {
  const self = this;
  return new Promise(function(resolve, reject) {
    const err = self.validate();

    if (err) {
      reject(err);
    };

    const data = {
      form: {
        api_key: self.secret,
        caller_id: self.number,
        contact_a: self.agent,
        contact_b: client,
        set_caller_id_leg: 'ab'
      }
    }

    const parseBody = (body) => {
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch(e) {
          console.error(e)
          body = body;
        }
      }
      return body;
    }

    request.post(self.apiUrl, data, function (err, res, body) {
      if (err)
        return reject(err);

      body = parseBody(body);

      if (res.statusCode == 200 && body.error == "OK")
        return resolve(body);

      return reject(body)
    });
  });
}

module.exports = function instance(options) {
  if (!options) throw 'Bad options parameter';
  return new TeleCube(options);
};