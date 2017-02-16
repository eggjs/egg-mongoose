'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * index() {
      const users = yield this.ctx.model.user.find({});
      this.ctx.body = users;
    }

    * create() {
      const user = new this.ctx.model.user({
        name: this.ctx.request.body.name,
      });
      yield user.save();
      this.ctx.body = user;
    }
  }

  return UserController;

};
