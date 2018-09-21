'use strict';

module.exports = agent => {
  if (agent.config.mongoose.agent) require('./lib/mongoose')(agent);
};
