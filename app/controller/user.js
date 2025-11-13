'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async list() {
    const { ctx } = this;
    const users = await ctx.service.user.list();
    ctx.body = {
      success: true,
      data: users,
    };
  }

  async show() {
    const { ctx } = this;
    const id = ctx.params.id;
    const user = await ctx.service.user.find(id);
    ctx.body = {
      success: true,
      data: user,
    };
  }

  async create() {
    const { ctx } = this;
    const { name, email } = ctx.request.body;
    const user = await ctx.service.user.create({ name, email });
    ctx.status = 201;
    ctx.body = {
      success: true,
      data: user,
    };
  }
}

module.exports = UserController;
