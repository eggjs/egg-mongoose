'use strict';

module.exports = {
  lastModifiedPlugin,
};

function lastModifiedPlugin(schema, options = {}) {
  const { field = 'lastMod' } = options;
  schema.add({ [field]: Date });

  schema.pre('save', function(next) {
    this.$set(field, new Date());
    next();
  });
}
