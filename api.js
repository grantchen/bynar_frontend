'use strict';

var fs = require('fs');
var path = require('path');

exports.get = function(event, context, callback) {
  var result = {
    statusCode: 200,
    body: '<h1>TEST API</h1>',
    headers: {'content-type': 'text/html'}
  };

  callback(null, result);
};
