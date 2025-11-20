# Node.js Proxy Service

Simple HTTP proxy service built with Node.js, Express and Axios.

Features
- POST `/proxy` to forward requests to an upstream URL.
- `PROXY_ALLOWLIST` env var to restrict allowed target hostnames (comma-separated).
- Streams upstream responses through to clients.

Quick start

1. Install dependencies:

```sh
npm install
```

2. Configure environment (local development)

- Create a `.env` file in the project root (an example `.env` is already provided). Key variables:
  - `TARGET_BASE_URL` — upstream base URL (default in `.env`: `https://api-adccrm-s.abbott.com.cn`)
  - `PROXY_PREFIX` — path prefix to proxy (default: `/api`)
  - `PORT` — server port (default: `3000`)
  - `LOG_LEVEL` — logging level for pino (default: `info`)

3. Run the server:

```sh
npm install
npm start
```

Examples

Proxy to a fixed upstream

This service can act as a pure proxy that forwards any incoming request to a fixed upstream base URL.

By default the upstream base is `https://api-adccrm-s.abbott.com.cn`. You can change it with `TARGET_BASE_URL`.

Example: GET proxy

```sh
# This will proxy to https://api-adccrm-s.abbott.com.cn/get
curl -X GET http://localhost:3000/proxy/get
```

Example: POST proxy with JSON body

```sh
# This will proxy to https://api-adccrm-s.abbott.com.cn/post
curl -X POST http://localhost:3000/proxy/post \
  -H "Content-Type: application/json" \
  -d '{"hello":"world"}'
```

Notes
- Any HTTP method, headers, query string, and body are forwarded transparently.
- The incoming path after `/proxy` is appended to the upstream base.
- Configure via env vars:
  - `TARGET_BASE_URL` (default: `https://api-adccrm-s.abbott.com.cn`)
  - `PROXY_PREFIX` (default: `/proxy`)


Health check

```sh
curl http://localhost:3000/health
```

Security notes
- If you plan to expose this service publicly, set `PROXY_ALLOWLIST` to limit allowed targets.
- Consider additional authentication, rate-limiting, and input validation for production use.
