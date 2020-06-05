'use strict';

module.exports = app => {
  const db1 = app.mongooseDB.get('db2');
  const { Schema } = app.mongoose;
  const UserSchema = new Schema({
    name: { type: String },
  });

  return db1.model('User', UserSchema);
};
