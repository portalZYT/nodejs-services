const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Target upstream base. Default to the host you mentioned.
const TARGET_BASE_URL = process.env.TARGET_BASE_URL || 'https://api-adccrm-s.abbott.com.cn';
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
    },
    onProxyReq: (proxyReq, req, res) => {
      // If body parser is used elsewhere and body is available, forward it.
      // In this setup we avoid body parsing so streams pass through directly.
    },
  })
);

app.listen(port, () => {
  console.log(`Proxy server listening on ${port}`);
  console.log(`Proxy prefix: ${PROXY_PREFIX} -> ${TARGET_BASE_URL}`);
});
