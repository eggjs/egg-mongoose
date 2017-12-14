'use strict';

module.exports = app => {
  const mymongoose = app.mymongoose;
  const mongoose = app.mongoose;
  const BoookSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mymongoose.model('Book', BoookSchema, null, { cache: false });
};
