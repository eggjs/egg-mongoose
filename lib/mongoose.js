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

  db.on('error', err => {
    err.message = `[egg-mongoose]${err.message}`;
    app.coreLogger.info(err);
  });

  db.on('disconnected', () => {
    app.coreLogger.warn('[egg-mongoose] %s disconnected', config.url);
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
    app.coreLogger.info('[egg-mongoose] starting...');
    yield db.open(config.url, config.options);

    const serverStatus = yield db.db.command({ serverStatus: 1 });
    let status = 'bad';
    if (serverStatus.ok === 1) status = 'ok';

    app.coreLogger.info('[egg-mongoose] start successfully and server status is %s', status);
  });
};

function loadModel(app) {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app.mongoose,
  });
}
