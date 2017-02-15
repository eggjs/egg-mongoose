'use strict';

module.exports = function(app) {
  app.resources('users', '/users', 'user');
  app.resources('books', '/books', 'book');
};
