'use strict';

const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

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
      assert.ok(app.model);
      assert.ok(app.model.User);
      assert.equal(app.model.user, undefined);
      assert.ok(app.model.Book);
      assert.equal(app.model.book, undefined);
      assert.equal(app.model.Other, undefined);
    });

    it('should has app ctx property', function* () {
      const ctx = app.mockContext();
      assert.ok(ctx.model);
      assert.ok(ctx.model.User);
      assert.equal(ctx.model.user, undefined);
      assert.ok(ctx.model.Book);
      assert.equal(ctx.model.book, undefined);
      assert.equal(ctx.model.Other, undefined);
    });

    it('should has sub model', function* () {
      assert.ok(app.model.Animal.Dog);
      assert.ok(app.model.Animal.Cat);
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
  });

  describe('custom promise', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-custom',
      });
      yield app.ready();
    });

    after(() => {
      app.close();
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

    after(() => {
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

  describe('multi client default db', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/mongoose-multi-defaultDB',
      });
      yield app.ready();
    });

    after(() => {
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
});
