'use strict';

module.exports = mongoose => {
  const BoookSchema = new mongoose.Schema({
    name: { type: String }
  });

  return mongoose.model('Book', BoookSchema);
}
