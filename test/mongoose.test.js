'use strict';

require('dotenv').config();
const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');
const mongoose = require('mongoose');
const EventEmitter = require('events');

describe('test/mongoose.test.js', () => {
  describe('base', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose',
      });
      yield app.ready();
    });

    after(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should has app model property', function* () {
      assert(app.model);
      assert(app.model.User.prototype instanceof app.mongoose.Model);
      assert(app.model.user === undefined);
      assert(app.model.Book.prototype instanceof app.mongoose.Model);
      assert(app.model.book === undefined);
      assert(app.model.Other === undefined);
    });

    it('should has app ctx property', function* () {
      const ctx = app.mockContext();
      assert(ctx.model);
      assert(ctx.model.User.prototype instanceof app.mongoose.Model);
      assert(ctx.model.user === undefined);
      assert(ctx.model.Book.prototype instanceof app.mongoose.Model);
      assert(ctx.model.book === undefined);
      assert(ctx.model.Other === undefined);
    });

    it('should has sub model', function* () {
      assert(app.model.Animal.prototype instanceof app.mongoose.Model);
      assert(app.model.Animal.Dog.prototype instanceof app.mongoose.Model);
      assert(app.model.Animal.Cat.prototype instanceof app.mongoose.Model);
    });

    it('should get data from create', function* () {
      app.mockCsrf();

      yield request(app.callback())
        .post('/users')
        .send({ name: 'mongoose' })
        .expect(200);

      const res = yield request(app.callback()).get('/users');
      assert(res.body[0].name === 'mongoose');
    });

    it('should get data from create with capitalized model file name', function* () {
      app.mockCsrf();

      yield request(app.callback())
        .post('/books')
        .send({ name: 'mongoose' })
        .expect(200);

      const res = yield request(app.callback()).get('/books');
      assert(res.body[0].name === 'mongoose');
    });

    it('should load promise', function* () {
      const query = app.model.User.findOne({});
      assert.equal(query.exec().constructor, Promise);
    });

    it('should filter password of url', () => {
      const filterURLPassword = require('../lib/filterURLPassword');
      assert(filterURLPassword('https://example.com/') === 'https://example.com/');
      assert(filterURLPassword('https://abc:xyz@example.com/') === 'https://abc:******@example.com/');
      assert(filterURLPassword('mongodb://abc:xyz@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/admin?replicaSet=myRepl') === 'mongodb://abc:******@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/admin?replicaSet=myRepl');
    });
  });

  describe('custom promise', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-custom',
      });
      yield app.ready();
    });

    after(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should load custom promise', function* () {
      const query = app.model.User.findOne({});
      assert.equal(query.exec().constructor, require('bluebird'));
    });
  });

  describe('multi client', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-multi',
      });
      yield app.ready();
    });

    after(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should get user from book', function* () {
      app.mockCsrf();

      const { body: user } = yield app.httpRequest()
        .post('/users')
        .send({ name: 'mongoose' });

      const { body: book } = yield app.httpRequest()
        .post('/books')
        .send({ name: 'mongoose', user: user._id });

      const { body: res } = yield app.httpRequest().get(`/books/${book._id}`);
      assert(res.user.name === 'mongoose');
    });
  });

  describe('multi client default db', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-multi-defaultDB',
      });
      yield app.ready();
    });

    after(function* () {
      app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should get user from book', function* () {
      app.mockCsrf();

      const { body: user } = yield app.httpRequest()
        .post('/users')
        .send({ name: 'mongoose' });

      const { body: book } = yield app.httpRequest()
        .post('/books')
        .send({ name: 'mongoose', user: user._id });

      const { body: res } = yield app.httpRequest().get(`/books/${book._id}`);
      assert(res.user.name === 'mongoose');
    });
  });

  describe('custom loadModel', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-loadModel',
      });
      yield app.ready();
    });

    after(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should has app custom mymongoose', function* () {
      assert(app.mymongoose);
    });

    it('should has app model property', function* () {
      assert(app.model);
      assert(app.model.User.prototype instanceof app.mongoose.Model);
      assert(app.model.user === undefined);
      assert(app.model.Book.prototype instanceof app.mongoose.Model);
      assert(app.model.book === undefined);
      assert(app.model.Other === undefined);
    });
  });

  describe('throws on first connection', () => {
    let app;
    const createConnection = mongoose.createConnection;
    let connection;
    let onCreateConnection;
    beforeEach(function* () {
      connection = new EventEmitter();
      mongoose.createConnection = () => {
        setTimeout(onCreateConnection, 10);
        return connection;
      };
    });

    afterEach(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(() => {
      connection = null;
      onCreateConnection = null;
      mongoose.createConnection = createConnection;
    });

    it('should establish first connection', function* () {
      app = mm.app({
        baseDir: 'apps/mongoose',
      });
      onCreateConnection = () => {
        connection.emit('connected');
      };
      yield app.ready();
    });

    it('should rethrow on first connection', function* () {
      app = mm.app({
        baseDir: 'apps/mongoose',
      });
      onCreateConnection = () => {
        connection.emit('error', new Error('foobar'));
      };
      try {
        yield app.ready();
      } catch (err) {
        assert(err != null);
        assert(err.message === '[egg-mongoose]foobar');
        return;
      }
      assert.fail('shall not succeeded');
    });
  });

  describe('global plugins', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-plugin',
      });
      yield app.ready();
    });

    after(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should has model extra property', function* () {
      const user = yield app.model.User.create({});
      const book = yield app.model.Book.create({});
      assert(user);
      assert(user.lastMod instanceof Date);
      assert(user.updatedAt instanceof Date);
      assert(book);
      assert(book.lastMod instanceof Date);
      assert(book.updatedAt instanceof Date);
    });
  });


  describe('multi client plugins', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-multi-client-plugins',
      });
      yield app.ready();
    });

    after(function* () {
      yield app.close();
    });
    afterEach(mm.restore);
    afterEach(function* () {
      yield app.model.Book.remove({});
      yield app.model.User.remove({});
    });

    it('should has model extra property', function* () {
      const user = yield app.model.User.create({});
      const book = yield app.model.Book.create({});
      assert(user);
      assert(user.lastMod instanceof Date);
      assert(user.updatedAt instanceof Date);
      assert(book);
      assert(book.lastMod instanceof Date);
      assert(book.updatedAt instanceof Date);
    });
  });
});
