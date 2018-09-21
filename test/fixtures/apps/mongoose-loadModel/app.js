'use strict';

module.exports = app => {
  app.mymongoose = app.mongooseDB.createInstance(app.config.mymongoose);
  app.mongoose.loadModel();
};
