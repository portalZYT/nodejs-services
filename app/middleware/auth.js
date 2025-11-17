'use strict';

module.exports = (options = {}) => {
  return async function auth(ctx, next) {
    // 如果配置了需要跳过的URL，则直接通过
    if (options.exclude && options.exclude.some(path => ctx.url.startsWith(path))) {
      await next();
      return;
    }

    // 获取token
    const token = ctx.headers.authorization || ctx.headers.token;

    if (!token) {
      return ctx.fail(ctx.helper.NO_TOKEN_MSG, ctx.helper.NO_TOKEN);
    }

    try {
      // 验证JWT token
      const decoded = ctx.helper.verifyToken(token.replace('Bearer ', ''));
      
      // 查找用户
      const user = await ctx.model.User.findByPk(decoded.id);

      if (!user) {
        return ctx.fail(ctx.helper.USER_NOT_FOUND_MSG, ctx.helper.USER_NOT_FOUND);
      }

      // 将用户信息挂载到ctx上
      ctx.user = user;
      ctx.userId = user.id;

      await next();
    } catch (err) {
      return ctx.fail(ctx.helper.TOKEN_ERROR_MSG, ctx.helper.TOKEN_ERROR);
    }
  };
};
