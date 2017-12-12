'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const CatSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mongoose.model('Cat', CatSchema, null, { cache: false });
};
