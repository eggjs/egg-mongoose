'use strict';

module.exports = app => {
  class UserController extends app.Controller {
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
