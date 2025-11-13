'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      message: 'Hello EggJS API Service',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  async health() {
    const { ctx } = this;
    ctx.body = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = HomeController;
