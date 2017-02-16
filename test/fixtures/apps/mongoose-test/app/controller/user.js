'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * index() {
      let users = yield this.ctx.model.user.find({})
      this.ctx.body = users;
    }

    * create() {
      let user = new this.ctx.model.user({
        name: this.ctx.request.body.name
      })
      yield user.save();
      this.ctx.body = user;
    }
  }

  return UserController;

}
