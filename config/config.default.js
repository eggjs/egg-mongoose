'use strict';

/**
  * mongoose default config
  * http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection
  * @member Config#mongoose
  * @property {String} url - connect url
  * @property {Object} options - options to pass to the driver and mongoose-specific
  */
exports.mongoose = {
  url: '',
  options: {},
  plugins: [],
  loadModel: true,
  modelDir: 'model', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
  delegate: 'model', // load all files in `app/${baseDir}` as models, default to `model`
  app: true,
  agent: false,
};
