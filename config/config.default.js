/* eslint valid-jsdoc: "off" */
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  console.log('config----default');
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    security: {
      xframe: {
        enable: false,
      },
      csrf: {
        enable: false,
      },
    },
    logger: {
      dir: path.join(appInfo.baseDir, 'logs'),
      outputJSON: true
    },
    onerror: {
      all(err, ctx) {
        // 定义所有响应类型的错误处理方法
        // 定义了 config.all 后，其他错误处理不再生效
        ctx.body = 'error';
        ctx.status = 500;
      },
      html(err, ctx) {
        // HTML 错误处理
        ctx.body = '<h3>error</h3>';
        ctx.status = 500;
      },
      json(err, ctx) {
        // JSON 错误处理
        ctx.body = { message: 'error' };
        ctx.status = 500;
      },
      jsonp(err, ctx) {
        // JSONP 错误一般不需特殊处理，自动调用 JSON 方法
      }
    }
  };
  // config.cluster = {
  //   listen: {
  //     port: '5001'
  //   }
  // }
  // sequelize ORM
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: '3306',
    database: 'egg-sequelize-doc-default',
    username: 'root',
    password: 'Youtian1994$$',
  }

  // exports.mysql = {
  //   clients: {
  //     // clientId, 获取 client 实例，需通过 app.mysql.get('clientId') 获取
  //     db1: {
  //       // host
  //       host: '127.0.0.1',
  //       // 端口号
  //       port: '3306',
  //       // 用户名
  //       user: 'root',
  //       // 密码
  //       password: 'Youtian1994$$',
  //       // 数据库名
  //       database: 'egg-sequelize-doc-default'
  //     }
  //   },
  //   // 所有数据库配置的默认值
  //   default: {},

  //   // 是否加载到 app 上，默认开启
  //   app: true,
  //   // 是否加载到 agent 上，默认关闭
  //   agent: false
  // };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1747558226180_5426';

  // add your middleware config here
  config.middleware = ['auth'];

  // auth中间件配置
  config.auth = {
    exclude: ['/login/register', '/login/signin', '/swagger-doc', '/swagger-ui.html', '/test/health', '/test/database', '/public', '/api/products']
  };

  // swagger config
  config.swaggerdoc = {
    dirScanner: './app/controller',
    basePath: '/',
    apiInfo: {
      title: 'Hotel API',
      description: '系统API文档',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    enableSecurity: false,
    routerMap: true,
    enable: true,
    tag: true,
  };

  // proxy = true;
  // add your user config here
  const userConfig = {
    // # JWT Config
    JWT_SECRET: 'LxXJi6Rv9t3JPLci',
    JWT_EXPIRES_IN: '7d',
    DB_MODE: "noSyncDB"
  };

  return {
    ...config,
    ...userConfig,
  };
};
