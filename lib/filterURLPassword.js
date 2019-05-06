'use strict';

/**
 * filter the auth of url string
 * @param {URL} input url
 * @return {String} filtered url
 * @see https://docs.mongodb.com/manual/reference/connection-string/
 */
module.exports = function filterURLPassword(input) {
  const index = input.indexOf('@');
  if (index === -1) return input;
  const startIndex = input.lastIndexOf(':', index);
  return input.substring(0, startIndex + 1) + '******' + input.substring(index);
};
