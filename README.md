# nodejs-services

A repository for Node.js API services using different frameworks.

## Frameworks

This repository contains API services built with:
- **EggJS** - Progressive Node.js framework (current branch)
- **NestJS** - Progressive Node.js framework for building efficient and scalable server-side applications
- **NextJS** - React framework for production

## Branch Structure

- `EggJS/*` - EggJS implementations
  - `EggJS/major` - Main EggJS branch
- `NestJS/*` - NestJS implementations
  - `NestJS/major` - Main NestJS branch
- `NextJS/*` - NextJS implementations
  - `NextJS/major` - Main NextJS branch

## EggJS Service

### Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production mode
npm start

# Stop production server
npm stop

# Run tests
npm test

# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

### API Endpoints

#### Health Check
- `GET /` - Welcome message
- `GET /health` - Health check endpoint

#### User API
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Project Structure

```
.
├── app
│   ├── controller      # Controllers handle HTTP requests
│   │   ├── home.js
│   │   └── user.js
│   ├── service        # Business logic
│   │   └── user.js
│   └── router.js      # Route definitions
├── config             # Configuration files
│   ├── config.default.js
│   └── plugin.js
├── test              # Test files
│   └── app
│       └── controller
└── package.json
```

### Technology Stack

- **Runtime**: Node.js >= 16.0.0
- **Framework**: EggJS 3.x
- **Testing**: egg-bin, egg-mock
- **Linting**: ESLint with egg config

## License

MIT
