'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect(200)
      .expect(res => {
        assert(res.body.message === 'Hello EggJS API Service');
        assert(res.body.version === '1.0.0');
        assert(res.body.timestamp);
      });
  });

  it('should GET /health', () => {
    return app.httpRequest()
      .get('/health')
      .expect(200)
      .expect(res => {
        assert(res.body.status === 'ok');
        assert(typeof res.body.uptime === 'number');
        assert(res.body.timestamp);
      });
  });
});
