'use strict';

module.exports = app => {
  class BookController extends app.Controller {
    * index() {
      let books = yield this.ctx.model.Book.find({})
      this.ctx.body = books;
    }

    * create() {
      let book = new this.ctx.model.Book({
        name: this.ctx.request.body.name
      })
      yield book.save()
      this.ctx.body = book;
    }
  }

  return BookController;
}
