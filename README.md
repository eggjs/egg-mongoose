# egg-mongoose
mongoose plugin in egg
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

## Usage

```js
// {app_root}/config/plugin.js
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.mongoose = {
  url: 'mongodb://127.0.0.1/example',
  options: {}
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example
```js
// app/model/user.js
module.exports = mongoose => {
  const UserSchema = new mongoose.Schema({
    userName: { type: String  },
    password: { type: String  }
  });

  return mongoose.model('User', UserSchema);
}

// app/controller/user.js
exports.index = function* () {
  this.body = yield this.model.user.find({});
}
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
