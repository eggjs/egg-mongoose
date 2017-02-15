'use strict';

const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/mongoose.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/mongoose-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);
  afterEach(function* () {
    yield app.model.user.remove({});
  });

  it('should get data from create', function* () {
    app.mockCsrf();

    yield request(app.callback())
      .post('/users')
      .send({ name: 'mongoose' })
      .expect(200);

    const res = yield request(app.callback())
    .get('/users');

    assert(res.body[0].name === 'mongoose');
  });

  it('should get data from create with capitalized model file name', function* () {
    app.mockCsrf();

    yield request(app.callback())
      .post('/books')
      .send({ name: 'mongoose' })
      .expect(200);

    const res = yield request(app.callback())
    .get('/books');

    assert(res.body[0].name === 'mongoose');
  });
});
