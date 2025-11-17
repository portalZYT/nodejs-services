/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./routers/login')(app);
  require('./routers/test')(app);
  require('./routers/swagger')(app);
  require('./routers/product')(app);
};

