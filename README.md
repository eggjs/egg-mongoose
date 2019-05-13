# egg-mongoose
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-mongoose.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-mongoose
[travis-image]: https://img.shields.io/travis/eggjs/egg-mongoose.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-mongoose
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-mongoose.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-mongoose?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-mongoose.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-mongoose
[snyk-image]: https://snyk.io/test/npm/egg-mongoose/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-mongoose
[download-image]: https://img.shields.io/npm/dm/egg-mongoose.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-mongoose

Egg's mongoose plugin.

## Install

```bash
$ npm i egg-mongoose --save
```

## Configuration

Change `{app_root}/config/plugin.js` to enable `egg-mongoose` plugin:

```js
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
```

## Simple connection

### Config

```js
// {app_root}/config/config.default.js
exports.mongoose = {
  url: 'mongodb://127.0.0.1/example',
  options: {},
  // mongoose global plugins, expected a function or an array of function and options
  plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
};
// recommended
exports.mongoose = {
  client: {
    url: 'mongodb://127.0.0.1/example',
    options: {},
    // mongoose global plugins, expected a function or an array of function and options
    plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
  },
};
```

### Example

```js
// {app_root}/app/model/user.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userName: { type: String  },
    password: { type: String  },
  });

  return mongoose.model('User', UserSchema);
}

// {app_root}/app/controller/user.js
exports.index = function* (ctx) {
  ctx.body = yield ctx.model.User.find({});
}
```

## Multiple connections

### Config

```js
// {app_root}/config/config.default.js
exports.mongoose = {
  clients: {
    // clientId, access the client instance by app.mongooseDB.get('clientId')
    db1: {
      url: 'mongodb://127.0.0.1/example1',
      options: {},
    },
    db2: {
      url: 'mongodb://127.0.0.1/example2',
      options: {},
    },
  },
};
```

### Example

```js
// {app_root}/app/model/user.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('db1'); 

  const UserSchema = new Schema({
    userName: { type: String  },
    password: { type: String  },
  });

  return conn.model('User', UserSchema);
}

// {app_root}/app/model/book.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('db2');

  const BookSchema = new Schema({
    name: { type: String },
  });

  return conn.model('Book', BookSchema);
}

// app/controller/user.js
exports.index = function* (ctx) {
  ctx.body = yield ctx.model.User.find({}); // get data from db1
}

// app/controller/book.js
exports.index = function* (ctx) {
  ctx.body = yield ctx.model.Book.find({}); // get data from db2
}
```

### Default config

see [config/config.default.js](config/config.default.js) for more detail.

## Multi-mongos support

```js
// {app_root}/config/config.default.js
exports.mongoose = {
  client: {
    url: 'mongodb://mongosA:27501,mongosB:27501',
    options: {
      mongos: true,
    },
  },
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg-mongoose/issues).

## Contribution

If you are a contributor, follow [CONTRIBUTING](https://eggjs.org/zh-cn/contributing.html).

## License

[MIT](LICENSE)
