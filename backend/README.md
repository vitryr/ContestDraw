# Contest Draw Backend API

Production-ready Node.js/TypeScript backend API for the Contest Draw platform.

## Features

- JWT-based auth with OAuth2 support (Google, Facebook)
- User Management with GDPR compliance
- Credit System with subscriptions
- Draw Management with cryptographic security
- Social Integration (Instagram, Facebook, Twitter, TikTok, YouTube)
- Rate Limiting and comprehensive error handling

## Tech Stack

Node.js 18+, TypeScript, Express.js, Prisma ORM, PostgreSQL, Redis, JWT, Bull

## Installation

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
cp .env.example .env
# Edit .env with your configuration
```

## Running

```bash
npm run dev      # Development
npm run build    # Build
npm start        # Production
npm test         # Tests
```

## API Endpoints

See docs/API.md for complete API documentation.

## Security

- Bcrypt password hashing (12 rounds)
- JWT authentication
- Rate limiting
- CORS & Helmet
- Input validation
- SQL injection protection via Prisma
