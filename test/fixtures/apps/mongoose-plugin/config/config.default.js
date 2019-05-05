'use strict';

const { lastModifiedPlugin } = require('../lib/mongoose');

exports.mongoose = {
  url: process.env.MONGODB_URL,
  options: {},
  plugins: [ lastModifiedPlugin ],
};

exports.keys = 'aaa';
