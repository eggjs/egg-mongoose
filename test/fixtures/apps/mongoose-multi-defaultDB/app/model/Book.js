'use strict';

module.exports = app => {
  const db2 = app.mongooseDB.get('db2');
  const { Schema } = app.mongoose;
  const BoookSchema = new Schema({
    name: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  });

  return db2.model('Book', BoookSchema);
};
