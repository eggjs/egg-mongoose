# egg-mongoose

[![NPM version][npm-image]][npm-url]
[![Run tests](https://github.com/eggjs/egg-mongoose/actions/workflows/autoUnitTest.yml/badge.svg)](https://github.com/eggjs/egg-mongoose/actions/workflows/autoUnitTest.yml)
[![Test coverage][codecov-image]][codecov-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-mongoose.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-mongoose
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-mongoose.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-mongoose?branch=master
[snyk-image]: https://snyk.io/test/npm/egg-mongoose/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-mongoose
[download-image]: https://img.shields.io/npm/dm/egg-mongoose.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-mongoose

Egg's mongoose plugin.

## Install

```bash
npm i egg-mongoose --save
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
      // client scope plugin array
      plugins: []
    },
    db2: {
      url: 'mongodb://127.0.0.1/example2',
      options: {},
    },
  },
  // public scope plugin array
  plugins: []
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
    userName: { type: String },
    password: { type: String },
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

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/893152?v=4" width="100px;"/><br/><sub><b>jtyjty99999</b></sub>](https://github.com/jtyjty99999)<br/>|[<img src="https://avatars.githubusercontent.com/u/360661?v=4" width="100px;"/><br/><sub><b>popomore</b></sub>](https://github.com/popomore)<br/>|[<img src="https://avatars.githubusercontent.com/u/227713?v=4" width="100px;"/><br/><sub><b>atian25</b></sub>](https://github.com/atian25)<br/>|[<img src="https://avatars.githubusercontent.com/u/985607?v=4" width="100px;"/><br/><sub><b>dead-horse</b></sub>](https://github.com/dead-horse)<br/>|[<img src="https://avatars.githubusercontent.com/u/17738556?v=4" width="100px;"/><br/><sub><b>BaffinLee</b></sub>](https://github.com/BaffinLee)<br/>|[<img src="https://avatars.githubusercontent.com/u/13268073?v=4" width="100px;"/><br/><sub><b>trylovetom</b></sub>](https://github.com/trylovetom)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
|[<img src="https://avatars.githubusercontent.com/u/9605663?v=4" width="100px;"/><br/><sub><b>ChangedenCZD</b></sub>](https://github.com/ChangedenCZD)<br/>|[<img src="https://avatars.githubusercontent.com/u/954064?v=4" width="100px;"/><br/><sub><b>hardywu</b></sub>](https://github.com/hardywu)<br/>|[<img src="https://avatars.githubusercontent.com/u/7105264?v=4" width="100px;"/><br/><sub><b>JasinYip</b></sub>](https://github.com/JasinYip)<br/>|[<img src="https://avatars.githubusercontent.com/u/549979?v=4" width="100px;"/><br/><sub><b>netputer</b></sub>](https://github.com/netputer)<br/>|[<img src="https://avatars.githubusercontent.com/u/52018749?v=4" width="100px;"/><br/><sub><b>Wai-Dung</b></sub>](https://github.com/Wai-Dung)<br/>|[<img src="https://avatars.githubusercontent.com/u/7284558?v=4" width="100px;"/><br/><sub><b>duncup</b></sub>](https://github.com/duncup)<br/>|
[<img src="https://avatars.githubusercontent.com/u/5010606?v=4" width="100px;"/><br/><sub><b>jinasonlin</b></sub>](https://github.com/jinasonlin)<br/>|[<img src="https://avatars.githubusercontent.com/u/8500303?v=4" width="100px;"/><br/><sub><b>legendecas</b></sub>](https://github.com/legendecas)<br/>|[<img src="https://avatars.githubusercontent.com/u/20775828?v=4" width="100px;"/><br/><sub><b>lzqmyb</b></sub>](https://github.com/lzqmyb)<br/>|[<img src="https://avatars.githubusercontent.com/u/70498637?v=4" width="100px;"/><br/><sub><b>DevXiaolan</b></sub>](https://github.com/DevXiaolan)<br/>|[<img src="https://avatars.githubusercontent.com/u/1774223?v=4" width="100px;"/><br/><sub><b>villins</b></sub>](https://github.com/villins)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Sat Aug 12 2023 11:16:17 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
