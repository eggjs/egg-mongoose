'use strict';

module.exports = app => {
  class BookController extends app.Controller {
    * index() {
      const books = yield this.ctx.mongoModel.Book.find({});
      this.ctx.body = books;
    }

    * create() {
      const book = new this.ctx.mongoModel.Book({
        name: this.ctx.request.body.name,
      });
      yield book.save();
      this.ctx.body = book;
    }
  }

  return BookController;

};
