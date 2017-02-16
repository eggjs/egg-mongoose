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

  db.on('error', err => {
    err.message = `[egg-mongoose]${err.message}`;
    app.coreLogger.error(err);
  });

  db.on('disconnected', () => {
    app.coreLogger.error(`[egg-mongoose] ${config.url} disconnected`);
  });

  db.on('connected', () => {
    app.coreLogger.info(`[egg-mongoose] ${config.url} connected successfully`);
  });

  db.on('reconnected', () => {
    app.coreLogger.info(`[egg-mongoose] ${config.url} reconnected successfully`);
  });

  loadModel(app);

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-mongoose] starting...');
    yield db.open(config.url, config.options);

    const serverStatus = yield db.db.command({ serverStatus: 1 });
    const status = serverStatus.ok === 1 ? 'ok' : 'not ok';

    app.coreLogger.info('[egg-mongoose] start successfully and server status is %s', status);
  });
};

function loadModel(app) {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app.mongoose,
  });
}
