'use strict';

const { lastModifiedPlugin } = require('../lib/mongoose');

exports.mongoose = {
  clients: {
    db1: {
      url: process.env.MONGODB_URL_1,
      options: {},
    },
    db2: {
      url: process.env.MONGODB_URL,
      options: {},
      plugins: [[ lastModifiedPlugin, { field: 'updatedAt' }]],
    },
  },
  plugins: [ lastModifiedPlugin ],
};

exports.keys = 'aaa';
