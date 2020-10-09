'use strict';

const assert = require('assert');
const path = require('path');
const mongoose = require('mongoose');
const awaitFirst = require('await-first');
const filterURLPassword = require('./filterURLPassword');

let count = 0;

const globalPlugins = [];

module.exports = app => {
  const { client, clients, url, options, defaultDB, customPromise, loadModel, modelDir, plugins } = app.config.mongoose;

  // compatibility
  if (!client && !clients && url) {
    app.config.mongoose.client = {
      url,
      options,
    };
  }

  mongoose.Promise = customPromise ? customPromise : Promise;

  if (Array.isArray(plugins)) {
    plugins.forEach(plugin => {
      mongoose.plugin.apply(mongoose, Array.isArray(plugin) ? plugin : [ plugin ]);
    });
  }
  globalPlugins.push(...mongoose.plugins || []);

  // TODO addSingleton support config[this.configName]?
  app.addSingleton('mongoose', createOneClient);

  app.mongooseDB = app.mongoose;

  // set default connection(ref models has fixed in mongoose 4.13.7)
  if (app.mongooseDB instanceof mongoose.Connection) {
    mongoose.connection = app.mongooseDB;
  } else if (defaultDB && app.mongooseDB.get(defaultDB) instanceof mongoose.Connection) {
    mongoose.connection = app.mongooseDB.get(defaultDB);
  }

  app.mongoose = mongoose;
  /* deprecated, next primary version remove */
  app.__mongoose = mongoose;

  app.mongoose.loadModel = () => loadModelToApp(app, modelDir);

  if (loadModel) {
    app.beforeStart(() => {
      loadModelToApp(app, modelDir);
    });
  }
};

function createOneClient(config, app) {
  const { url, options, plugins } = config;
  const filteredURL = filterURLPassword(url);

  assert(url, '[egg-mongoose] url is required on config');

  // Notice we MUST add an option arg called `useNewUrlParser` and set to `true`
  // in default, otherwises there'll be a warning since v4.X of mongodb.
  // Ref: https://github.com/eggjs/egg/issues/3081
  if (!options.hasOwnProperty('useNewUrlParser')) {
    options.useNewUrlParser = true;
  }
  app.coreLogger.info('[egg-mongoose] connecting %s', filteredURL);

  // remove all plugins
  const length = Array.isArray(mongoose.plugins) ? mongoose.plugins.length : 0;
  for (let index = length; index > 0; index--) {
    mongoose.plugins.pop();
  }
  // combine clients plugins and public plugins
  [].concat(plugins || [], globalPlugins).forEach(plugin => {
    mongoose.plugin.apply(mongoose, Array.isArray(plugin) ? plugin : [ plugin ]);
  });

  const db = mongoose.createConnection(url, options);

  /* istanbul ignore next */
  db.on('error', err => {
    err.message = `[egg-mongoose]${err.message}`;
    app.coreLogger.error(err);
  });

  /* istanbul ignore next */
  db.on('disconnected', () => {
    app.coreLogger.error(`[egg-mongoose] ${filteredURL} disconnected`);
  });

  db.on('connected', () => {
    app.coreLogger.info(`[egg-mongoose] ${filteredURL} connected successfully`);
  });

  /* istanbul ignore next */
  db.on('reconnected', () => {
    app.coreLogger.info(`[egg-mongoose] ${filteredURL} reconnected successfully`);
  });

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-mongoose] starting...');
    yield awaitFirst(db, [ 'connected', 'error' ]);
    const index = count++;
    /*
     *remove heartbeat to avoid no authentication
      const serverStatus = yield db.db.command({
        serverStatus: 1,
      });

      assert(serverStatus.ok === 1, '[egg-mongoose] server status is not ok, please check mongodb service!');
    */
    app.coreLogger.info(`[egg-mongoose] instance[${index}] start successfully`);
  });

  return db;
}

function loadModelToApp(app, modelDir) {
  const dir = path.join(app.config.baseDir, modelDir ? modelDir : 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app,
    caseStyle: 'upper',
    filter(model) {
      return typeof model === 'function' && model.prototype instanceof app.mongoose.Model;
    },
  });
}
