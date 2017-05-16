'use strict';

const assert = require('assert');
const path = require('path');
const mongoose = require('mongoose');
const EventEmitter = require('events');
const awaitEvent = require('await-event');

module.exports = app => {
  const config = app.config.mongoose;
  assert(config.url, '[egg-mongoose] url is required on config');
  app.coreLogger.info('[egg-mongoose] connecting %s', config.url);

  mongoose.Promise = Promise;

  // mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);
  const db = mongoose.createConnection(config.url, config.options);
  db.Schema = mongoose.Schema;
  app.mongoose = db;

  const heartEvent = new EventEmitter();
  heartEvent.await = awaitEvent;

  db.on('error', err => {
    err.message = `[egg-mongoose]${err.message}`;
    app.coreLogger.error(err);
  });

  db.on('disconnected', () => {
    app.coreLogger.error(`[egg-mongoose] ${config.url} disconnected`);
  });

  db.on('connected', () => {
    heartEvent.emit('connected');
    app.coreLogger.info(`[egg-mongoose] ${config.url} connected successfully`);
  });

  db.on('reconnected', () => {
    app.coreLogger.info(`[egg-mongoose] ${config.url} reconnected successfully`);
  });

  loadModel(app);

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-mongoose] starting...');
    yield heartEvent.await('connected');
    /*
     *remove heartbeat to avoid no authentication
    const serverStatus = yield db.db.command({
      serverStatus: 1,
    });

    assert(serverStatus.ok === 1, '[egg-mongoose] server status is not ok, please check mongodb service!');
    */
    app.coreLogger.info('[egg-mongoose] start successfully and server status is ok');
  });
};

function loadModel(app) {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app,
    caseStyle: 'upper',
    filter(model) {
      return (model.modelName && model.base && model.base.Mongoose);
    },
  });
}
