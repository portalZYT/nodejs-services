const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logDir = path.join(__dirname, '..', 'logs');
try { fs.mkdirSync(logDir, { recursive: true }); } catch (e) {}
const logPath = path.join(logDir, 'proxy.log');

// pino destination writes to file asynchronously
const dest = pino.destination({ dest: logPath, sync: false });
const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, dest);

module.exports = {
  info: (message, meta) => {
    if (meta) logger.info(meta, message);
    else logger.info(message);
  },
  error: (message, meta) => {
    if (meta) logger.error(meta, message);
    else logger.error(message);
  },
  logger,
};
