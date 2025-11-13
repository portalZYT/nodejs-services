'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {
  it('should GET /api/users', () => {
    return app.httpRequest()
      .get('/api/users')
      .expect(200)
      .expect(res => {
        assert(res.body.success === true);
        assert(Array.isArray(res.body.data));
        assert(res.body.data.length > 0);
      });
  });

  it('should GET /api/users/:id', () => {
    return app.httpRequest()
      .get('/api/users/1')
      .expect(200)
      .expect(res => {
        assert(res.body.success === true);
        assert(res.body.data.id === '1');
        assert(res.body.data.name);
      });
  });

  it('should POST /api/users', () => {
    return app.httpRequest()
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
      })
      .expect(201)
      .expect(res => {
        assert(res.body.success === true);
        assert(res.body.data.name === 'Test User');
        assert(res.body.data.email === 'test@example.com');
      });
  });

  it('should return 404 for non-existent user', () => {
    return app.httpRequest()
      .get('/api/users/999')
      .expect(404); // EggJS handles error status from service
  });
});
