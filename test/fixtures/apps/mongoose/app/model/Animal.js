'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const AnimalSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mongoose.model('Animal', AnimalSchema, null, { cache: false });
};
