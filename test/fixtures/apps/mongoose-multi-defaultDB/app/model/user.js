'use strict';

module.exports = app => {
  const UserSchema = new app.mongoose.Schema({
    name: { type: String },
  });

  return app.mongoose.model('User', UserSchema);
};
