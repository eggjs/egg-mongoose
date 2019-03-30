'use strict';

const { URL } = require('url');

/**
 * filter the auth of url string
 * @param {URL} input filtered url
 */
module.exports = function filterURLPassword(input) {
  const url = new URL(input);
  url.password = '*****';
  return url.toString();
};
