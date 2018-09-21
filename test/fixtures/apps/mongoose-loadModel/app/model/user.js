'use strict';

module.exports = app => {
  const mymongoose = app.mymongoose;
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mymongoose.model('User', UserSchema, null, { cache: false });
};
