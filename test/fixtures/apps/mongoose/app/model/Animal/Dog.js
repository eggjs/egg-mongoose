'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const DogSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mongoose.model('Dog', DogSchema, null, { cache: false });
};
