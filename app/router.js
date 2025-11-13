'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // Home routes
  router.get('/', controller.home.index);
  router.get('/health', controller.home.health);

  // User routes
  router.get('/api/users', controller.user.list);
  router.get('/api/users/:id', controller.user.show);
  router.post('/api/users', controller.user.create);
};
