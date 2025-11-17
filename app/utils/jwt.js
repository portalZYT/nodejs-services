'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  generateToken(data) {
    // 从全局config获取JWT配置
    const app = this.app || require('egg').app;
    const JWT_SECRET = app?.config?.JWT_SECRET || 'LxXJi6Rv9t3JPLci';
    const JWT_EXPIRES_IN = app?.config?.JWT_EXPIRES_IN || '7d';
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); // 生成token
  },
  verifyToken(token) {
    const app = this.app || require('egg').app;
    const JWT_SECRET = app?.config?.JWT_SECRET || 'LxXJi6Rv9t3JPLci';
    return jwt.verify(token, JWT_SECRET); // 验证token
  },
}
