'use strict';

/**
 * filter the auth of url string
 * @param {URL} input filtered url
 */
module.exports = function filterURLPassword(input) {
  const url = new URL(input);
  url.password = '*****';
  return url.toString();
};
