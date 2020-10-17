'use strict';

exports.mongoose = {
  loadModel: false,
  delegate: 'mongo',
};

exports.mymongoose = {
  url: process.env.MONGODB_URL,
  options: {},
};

exports.keys = 'aaa';
