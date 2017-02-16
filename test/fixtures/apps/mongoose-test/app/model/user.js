'use strict';

module.exports = mongoose => {
  const UserSchema = new mongoose.Schema({
    name: { type: String },
  });

  return mongoose.model('User', UserSchema);
};
