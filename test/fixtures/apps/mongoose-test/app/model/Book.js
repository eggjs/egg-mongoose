'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const BoookSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mongoose.model('Book', BoookSchema);
};
