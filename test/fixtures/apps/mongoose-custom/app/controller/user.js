'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * index() {
      const users = yield this.ctx.model.User.find({});
      this.ctx.body = users;
    }

    * create() {
      const user = new this.ctx.model.User({
        name: this.ctx.request.body.name,
      });
      yield user.save();
      this.ctx.body = user;
    }
  }

  return UserController;

};
