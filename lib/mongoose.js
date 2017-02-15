'use strict';

const assert = require('assert');
const path = require('path');
const mongoose = require('mongoose');

module.exports = app => {
  const config = app.config.mongoose;
  assert(config.url, '[egg-mongoose] url is required on config');
  app.coreLogger.info('[egg-mongoose] connecting %s', config.url);

  const db = mongoose.createConnection();
  db.Schema = mongoose.Schema;
  app.mongoose = db;

  function connect() {
    db.open(config.url, config.options);
  }

  connect();

  db.on('error', err => {
    app.coreLogger.info('[egg-mongoose] %s error: ', err.message);
  });

  db.on('disconnected', () => {
    app.coreLogger.info('[egg-mongoose] %s disconnected', config.url);
    connect();
  });

  db.on('connected', () => {
    app.coreLogger.info('[egg-mongoose] connected %s successfully', config.url);
  });

  db.on('reconnected', () => {
    app.coreLogger.info('[egg-mongoose] reconnected %s successfully', config.url);
  });

  loadModel(app);

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-mongoose] start success');
  });
};

function loadModel(app) {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app.mongoose,
  });
}
