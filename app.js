'use strict';

module.exports = app => {
  if (app.config.mongoose.app) require('./lib/mongoose')(app);
};
