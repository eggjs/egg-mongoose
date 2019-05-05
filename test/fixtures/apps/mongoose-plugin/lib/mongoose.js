'use strict';

module.exports = {
  lastModifiedPlugin,
};

function lastModifiedPlugin(schema) {
  schema.add({ lastMod: Date });

  schema.pre('save', function(next) {
    this.lastMod = new Date();
    next();
  });
}
