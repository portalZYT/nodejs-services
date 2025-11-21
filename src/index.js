// Load environment variables from .env for local development
try { require('dotenv').config(); } catch (e) { /* dotenv optional if not installed */ }

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;
const logger = require('./logger');

// Target upstream base. Default to the host you mentioned.
const TARGET_BASE_URL = process.env.TARGET_BASE_URL || 'http://localhost:8080';
// Incoming requests starting with this prefix will be proxied to TARGET_BASE_URL
const PROXY_PREFIX = process.env.PROXY_PREFIX || '/api';

// Basic CORS middleware: echo Origin and handle preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  const acrh = req.headers['access-control-request-headers'];
  res.setHeader('Access-Control-Allow-Headers', acrh || 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);

  // Log incoming request basic info
  try {
    logger.info('incoming request', { method: req.method, url: req.originalUrl, ip: req.ip });
  } catch (e) {
    console.warn('logger failed', e);
  }

  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Pure proxy middleware: preserves method, headers, body, query and path.
app.use(
  PROXY_PREFIX,
  createProxyMiddleware({
    target: TARGET_BASE_URL,
    changeOrigin: true,
    secure: true,
    ws: true,
    logLevel: 'warn',
    pathRewrite: (path, req) => {
      // remove the prefix so /api/foo -> /foo upstream
      return path.replace(new RegExp('^' + PROXY_PREFIX), '') || '/';
    },
    onProxyRes: (proxyRes, req, res) => {
      // Ensure proxied responses include CORS headers
      const origin = req.headers.origin || '*';
      proxyRes.headers['access-control-allow-origin'] = origin;
      proxyRes.headers['access-control-allow-credentials'] = 'true';
      proxyRes.headers['access-control-allow-methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
      proxyRes.headers['access-control-allow-headers'] = req.headers['access-control-request-headers'] || 'Content-Type,Authorization';

      // Log upstream responses that look like errors (4xx/5xx)
      try {
        if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
          logger.error('upstream response error', {
            method: req.method,
            url: req.originalUrl,
            target: TARGET_BASE_URL,
            statusCode: proxyRes.statusCode
          });
        }
      } catch (e) {
        console.warn('logger failed', e);
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      // If body parser is used elsewhere and body is available, forward it.
      // In this setup we avoid body parsing so streams pass through directly.
    },
    onError: (err, req, res) => {
      try {
        logger.error('proxy error', { message: err.message, code: err.code, method: req.method, url: req.originalUrl, target: TARGET_BASE_URL });
      } catch (e) {
        console.warn('logger failed', e);
      }
      if (!res.headersSent) {
        res.status(502).json({ error: 'Bad gateway', details: err.message });
      }
    },
  })
);

app.listen(port, () => {
  logger.info(`Proxy server listening on ${port}`, { proxyPrefix: PROXY_PREFIX, target: TARGET_BASE_URL });
});

// Express error handler for unexpected errors during request processing
app.use((err, req, res, next) => {
  try {
    logger.error('request processing error', { message: err.message, stack: err.stack, method: req.method, url: req.originalUrl });
  } catch (e) {
    console.warn('logger failed', e);
  }
  if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error' });
});
