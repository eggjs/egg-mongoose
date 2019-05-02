'use strict';

const semver = require('semver');

/**
 * filter the auth of url string
 * @param {URL} input url
 * @return {String} filtered url
 */
module.exports = function filterURLPassword(input) {
  if (semver.lt(process.version, '6.13.0')) {
    const urlTool = require('url');
    const url = urlTool.parse(input);
    url.password = '*****';
    url.auth = url.auth && (url.auth.split(':')[0] + ':*****');
    return urlTool.format(url);
  }
  const { URL } = require('url');
  const url = new URL(input);
  url.password = '*****';
  return url.toString();
};
