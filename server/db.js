var pmongo = require('promised-mongo');

var uri = 'mongodb://austinArt:granite@ds023475.mlab.com:23475/art';

var db = pmongo(uri, {
  authMechanism: 'ScramSHA1'
});

module.exports = db