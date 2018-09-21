'use strict';

exports.mongoose = {
  clients: {
    db1: {
      url: process.env.MONGODB_URL_1,
      options: {},
    },
    db2: {
      url: process.env.MONGODB_URL_2,
      options: {},
    },
  },
};

exports.keys = 'aaa';
