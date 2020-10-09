'use strict';

exports.mongoose = {
  loadModel: false,
  modelDir: 'app/mongo',
};

exports.mymongoose = {
  url: process.env.MONGODB_URL,
  options: {},
};

exports.keys = 'aaa';
