'use strict';

module.exports = app => {
  class BookController extends app.Controller {
    * create() {
      const book = new this.ctx.model.Book({
        name: this.ctx.request.body.name,
        user: this.ctx.request.body.user,
      });
      yield book.save();
      this.ctx.body = book;
    }

    * show() {
      const id = this.ctx.params.id;
      const book = yield this.ctx.model.Book.findById(id)
        .populate({
          path: 'user',
        })
        .exec();
      this.ctx.body = book;
    }
  }

  return BookController;

};
