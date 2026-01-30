# Cleack - Fair & Automated Social Media Contest Platform

![Cleack Logo](https://cleack.io/logo.png)

**Cleack** is a SaaS platform that automates social media contest draws across Instagram, Facebook, Twitter, TikTok, and YouTube. Run fair, transparent, and GDPR-compliant giveaways with advanced filtering to ensure genuine participants.

## 🚀 Features

### Core Functionality
- ✅ **Multi-Platform Support**: Instagram, Facebook, Twitter, TikTok, YouTube
- 🎲 **Provably Fair Draws**: Cryptographically secure random selection
- 🎯 **Advanced Filtering**: Exclude bots, spam, and fake accounts
- 📊 **Analytics Dashboard**: Track contest performance
- 🔐 **GDPR Compliant**: Full data protection and privacy
- 💳 **Flexible Pricing**: Pay-per-use credits or monthly subscriptions

### Advanced Features
- 🤖 **Bot Detection**: Filter out fake accounts automatically
- 👥 **Follower Verification**: Ensure participants follow your account
- 🏷️ **Tag Detection**: Require users to tag friends
- 📅 **Account Age Filtering**: Exclude newly created accounts
- 🚫 **Keyword Exclusion**: Block spam comments
- 🌍 **Geographic Filters**: Region-specific contests
- 📈 **Multiple Winners**: Select up to 100 winners per draw
- 🔄 **Redraws**: Replace non-responsive winners

## 📋 Quick Start

### For Users

1. **Sign up**: [https://cleack.io/register](https://cleack.io/register)
2. **Connect your social media account**
3. **Create a draw** with your contest post URL
4. **Configure filters** (optional)
5. **Execute draw** and announce winners!

👉 See full [Getting Started Guide](./docs/user-guide/getting-started.md)

### For Developers

```bash
# Clone repository
git clone https://github.com/yourusername/cleack.git
cd cleack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

👉 See full [Development Setup Guide](./docs/technical/development-setup.md)

## 🏗️ Architecture

Cleack is built with:

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- Redis (caching & queues)
- Bull (job processing)

**Frontend:**
- React + TypeScript
- Tailwind CSS
- React Query
- Zustand (state management)

**Mobile:**
- React Native + Expo
- Shared API with web

**Infrastructure:**
- AWS (EC2, RDS, S3, CloudFront)
- Docker + Docker Compose
- GitHub Actions (CI/CD)

👉 See [Architecture Documentation](./docs/technical/architecture.md)

## 📚 Documentation

### User Guides
- [Getting Started](./docs/user-guide/getting-started.md)
- [Social Platform Integration](./docs/user-guide/social-platforms.md)
- [Advanced Filtering](./docs/user-guide/filters-guide.md)
- [Pricing & Credits](./docs/user-guide/pricing.md)
- [FAQ](./docs/user-guide/faq.md)

### Technical Documentation
- [API Reference](./docs/api/api-spec.yaml) - OpenAPI 3.0 specification
- [Architecture](./docs/technical/architecture.md)
- [Database Schema](./docs/technical/database-schema.md)
- [API Integration Guide](./docs/technical/api-integration.md)
- [Development Setup](./docs/technical/development-setup.md)
- [Testing Strategy](./docs/technical/testing-strategy.md)
- [Deployment Guide](./docs/technical/deployment.md)

### Legal
- [Terms of Service](./docs/legal/terms-of-service.md)
- [Privacy Policy](./docs/legal/privacy-policy.md)
- [GDPR Compliance](./docs/legal/data-processing-agreement.md)
- [Refund Policy](./docs/legal/refund-policy.md)

## 🔌 API

Cleack provides a REST API for integration:

```javascript
// Example: Create a draw via API
const response = await fetch('https://api.cleack.io/v1/draws', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Win a MacBook Pro",
    platform: "instagram",
    postUrl: "https://instagram.com/p/ABC123",
    winnerCount: 3,
    filters: {
      excludeMultipleComments: true,
      mustFollowAccount: true,
      minimumFollowers: 100
    }
  })
});

const draw = await response.json();
console.log('Draw created:', draw.id);
```

👉 Full [API Documentation](./docs/api/api-spec.yaml)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up database
npm run db:setup

# Run migrations
npm run migrate

# Seed development data
npm run seed

# Start development servers
npm run dev          # Backend + Frontend
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
npm run dev:mobile   # Mobile app
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests

# Run with coverage
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Build Docker images
docker-compose build

# Deploy
npm run deploy:staging
npm run deploy:production
```

## 📊 Project Structure

```
cleack/
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── api/      # API routes
│   │   ├── services/ # Business logic
│   │   ├── models/   # Database models
│   │   └── utils/    # Utilities
│   ├── tests/
│   └── package.json
├── frontend-web/      # React web app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── mobile/            # React Native app
│   ├── src/
│   ├── ios/
│   ├── android/
│   └── package.json
├── docs/              # Documentation
│   ├── api/
│   ├── user-guide/
│   ├── technical/
│   ├── legal/
│   └── marketing/
├── scripts/           # Utility scripts
├── docker-compose.yml
└── package.json
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- ESLint + Prettier for code formatting
- TypeScript for type safety
- Jest for testing
- Conventional Commits for commit messages

## 📈 Roadmap

### Q1 2025
- ✅ Instagram, Facebook, Twitter integration
- ✅ Advanced filtering system
- ✅ GDPR compliance
- 🔄 TikTok integration
- 🔄 YouTube integration

### Q2 2025
- 📅 Scheduled draws
- 📱 Mobile app (iOS + Android)
- 🤖 Automatic winner notifications
- 📊 Advanced analytics dashboard

### Q3 2025
- 🏢 White-label solution
- 🔌 Webhook integrations
- 🌐 Multi-language support (FR, ES, DE)
- 🎨 Custom branding options

### Q4 2025
- 🤝 Team collaboration features
- 📧 Email marketing integration
- 🔄 Multi-platform draws (combined)
- 🧠 AI-powered fraud detection

## 🐛 Bug Reports & Feature Requests

- **Bugs**: [Report an issue](https://github.com/yourusername/cleack/issues/new?template=bug_report.md)
- **Features**: [Request a feature](https://github.com/yourusername/cleack/issues/new?template=feature_request.md)
- **Security**: Email security@cleack.io (do not create public issues)

## 📜 License

Copyright © 2025 Cleack. All rights reserved.

This project is proprietary software. See [LICENSE](./LICENSE) for details.

## 📞 Support

- 📧 **Email**: support@cleack.io
- 💬 **Live Chat**: [https://cleack.io](https://cleack.io) (Pro users)
- 📖 **Documentation**: [https://docs.cleack.io](https://docs.cleack.io)
- 🐦 **Twitter**: [@Cleack](https://twitter.com/cleack)

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Bull](https://github.com/OptimalBits/bull)
- [Stripe](https://stripe.com/)

Special thanks to all our [contributors](./CONTRIBUTORS.md)!

---

**Made with ❤️ by the Cleack team**

[Website](https://cleack.io) | [Documentation](https://docs.cleack.io) | [API](https://api.cleack.io) | [Status](https://status.cleack.io)
