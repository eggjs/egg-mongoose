'use strict';

exports.mongoose = {
  url: process.env.MONGODB_URL,
  options: {},
  customPromise: require('bluebird'),
};

exports.keys = 'aaa';
