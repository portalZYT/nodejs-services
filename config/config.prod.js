/* eslint valid-jsdoc: "off" */
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  console.log('config----prod');
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
  };
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
