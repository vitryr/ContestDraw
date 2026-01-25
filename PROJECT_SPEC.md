# 🎯 PROJECT: Multi-Platform Contest Draw Application - Complete Development

## 📋 GLOBAL CONTEXT
I want to create a comprehensive contest draw application for social media (Instagram, Facebook, TikTok, Twitter/X). The application must automate the draw process, ensure legal compliance (GDPR), guarantee transparency, and offer excellent UX. Application available as responsive web and native mobile (iOS/Android).

## 🏗️ COMPLETE TECHNICAL ARCHITECTURE

### Backend Stack
- **API**: Node.js with TypeScript
- **Framework**: Express.js with RESTful architecture
- **Database**: PostgreSQL for relational data
- **Auth**: JWT + OAuth2 for social logins
- **Queue**: Bull/Redis for async jobs (fetching comments)
- **Cache**: Redis for performance
- **Hosting**: AWS EU (GDPR compliance)

### Web Frontend Stack
- **Framework**: React.js 18+ with TypeScript
- **State**: Zustand or Redux Toolkit
- **UI**: TailwindCSS + Radix UI
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

### Mobile Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State**: Shared with web (Zustand)
- **Payments**: Stripe on Android, IAP on iOS

## 📝 DETAILED PROJECT STRUCTURE
```
contest-draw-app/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── draws/
│   │   │   ├── credits/
│   │   │   ├── social-platforms/
│   │   │   └── users/
│   │   ├── services/
│   │   │   ├── instagram.service.ts
│   │   │   ├── facebook.service.ts
│   │   │   ├── tiktok.service.ts
│   │   │   ├── twitter.service.ts
│   │   │   └── payment.service.ts
│   │   ├── jobs/
│   │   │   ├── comment-fetcher.job.ts
│   │   │   └── story-monitor.job.ts
│   │   └── utils/
│   ├── prisma/
│   └── tests/
├── frontend-web/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── navigation/
└── shared/
    ├── types/
    └── utils/
```

## 🚀 FEATURES TO IMPLEMENT

### Phase 1: Core Features
1. **Authentication**
   - Sign up with email/password
   - Social login (Google, Facebook)
   - Email verification
   - Account management with/without registration

2. **Credits System**
   - Single credit purchase (one-shot)
   - Credit packs (5, 10, 20)
   - Monthly/annual subscriptions
   - Stripe + Apple IAP integration

3. **Social Networks Integration**
   - Instagram Graph API (Pro account required)
   - Facebook Graph API
   - TikTok scraping/API
   - Twitter API v2

4. **Draw Engine**
   - Import participants (comments, likes)
   - Advanced filters:
     * Duplicates
     * Minimum mentions (@)
     * Required hashtags
     * Max entries per person
     * Following verification
   - Secure random algorithm
   - Winners + alternates management

5. **Animation & Proof**
   - Draw animation in Story format (9:16)
   - MP4 video export
   - PDF certificate with hash
   - Complete history

### Phase 2: Advanced Features
- Story share detection
- User blacklist
- CSV/XLS data export
- Multi-account enterprise
- Partial white-label (premium)

## 💼 BUSINESS MODEL
- Single credit: €2.49
- 5 credits pack: €8
- 10 credits pack: €15
- 20 credits pack: €28
- Monthly subscription: €19.99 (unlimited)
- Annual subscription: €199 (unlimited + premium features)
- Enterprise: €49/month (5 accounts)

## 🎨 UI/UX SPECIFICATIONS
- Minimalist and modern design
- Colors: White/light gray + blue-green accents
- Typography: Modern sans-serif (Inter/Roboto)
- Subtle Framer Motion animations
- Vertical Story format priority
- Responsive web + native apps

## 📱 TYPICAL USER JOURNEY
1. Landing → Optional Login/Signup
2. Dashboard → New draw
3. Post URL → Social network connection if needed
4. Import participants → Real-time progress bar
5. Filter configuration → Clear interface with tooltips
6. Launch draw → Visual animation
7. Result → Video export + certificate + share

## 🔐 COMPLIANCE & SECURITY
- GDPR compliant (EU servers)
- Sensitive data encryption
- OAuth2 for social networks
- No social network passwords storage
- Terms of Service/Privacy Policy
- Designated DPO

## 📊 TESTS & MONITORING
- Unit tests >80% coverage
- E2E tests critical paths
- CI/CD with GitHub Actions
- Sentry monitoring
- Mixpanel/Plausible analytics

## 🚢 DEPLOYMENT STRATEGY
1. Private beta (10-20 testers)
2. Soft launch France
3. Europe expansion
4. SEO + Content marketing
5. Influencer partnerships

## 📈 TARGET KPIs
- 500 active users month 1
- 2000 draws/month after 3 months
- Free→paid conversion rate: 15%
- Subscription churn < 10%/month

## ⚡ CLAUDE FLOW COMMANDS

Use the following methodology with Claude Flow:

1. **Complete project initialization**:
```bash
npx claude-flow@alpha init --force --project-name "contest-draw-app"
npx claude-flow@alpha hive-mind wizard
npx claude-flow@alpha memory store project_spec "$(cat PROJECT_SPEC.md)" \
  --namespace project --reasoningbank
```

2. **Module development with swarm orchestration**:
```bash
# Complete Backend API
npx claude-flow@alpha hive-mind spawn "Create complete Node.js/TypeScript API with:
- JWT + OAuth authentication
- CRUD endpoints for users, credits, draws
- Instagram/FB Graph API, Twitter API, TikTok scraping services
- Queue jobs for comment import
- Stripe/IAP integration
- Jest unit tests
Use Express, Prisma ORM, Bull queue" \
--namespace backend --claude --max-agents 8

# React Web Frontend
npx claude-flow@alpha hive-mind spawn "Develop complete React app with:
- Pages: Landing, Dashboard, DrawConfig, Results, Pricing
- Reusable components with Radix UI + TailwindCSS
- Zustand state management
- Framer Motion animations for draw
- Backend API integration
- React Testing Library tests" \
--namespace frontend-web --claude

# React Native Mobile
npx claude-flow@alpha hive-mind spawn "Create React Native Expo app with:
- Stack + tabs navigation
- Screens identical to web
- Shared components/logic with web
- Stripe + Apple IAP integration
- Native video export
- Push notifications" \
--namespace mobile --claude

# Infrastructure & DevOps
npx claude-flow@alpha hive-mind spawn "Configure complete infrastructure:
- Docker containers
- AWS deployment (EC2, RDS, S3, CloudFront)
- GitHub Actions CI/CD
- Monitoring and logs
- Backup strategy
- SSL/Security headers" \
--namespace devops --claude
```

3. **Testing & Validation**:
```bash
npx claude-flow@alpha swarm "Create complete test suite:
- Backend unit tests (>80% coverage)
- API integration tests
- Playwright E2E tests
- K6 performance tests
- Security audit" --claude
```

4. **Documentation & Launch**:
```bash
npx claude-flow@alpha swarm "Generate complete documentation:
- OpenAPI/Swagger API documentation
- User guide
- Technical documentation
- Marketing landing page
- GDPR-compliant Terms/Privacy Policy
- SEO content (blog posts)" --claude
```

## 🎯 EXPECTED RESULTS

This project must produce:
1. Production-ready deployed web application
2. Published iOS/Android apps on stores
3. Scalable and secure backend
4. Complete documentation
5. Automated tests
6. Functional CI/CD pipeline
7. Total legal compliance

## 💡 IMPORTANT NOTES
- Absolute priority: Instagram with Pro account
- Pricing transparency (1 credit = 1 draw)
- Modern UI style like Revolut/Wise
- Suggested name: FairPick or DrawPlus
- Mandatory EU hosting (GDPR)
- Plan for scaling up to 50k comments/draw

START BY ANALYZING THIS COMPLETE BRIEF, THEN DEVELOP THE PROJECT MODULE BY MODULE USING YOUR SKILLS AND MULTI-AGENT SYSTEM. ENSURE YOU CREATE PRODUCTION-READY, WELL-TESTED, AND DOCUMENTED CODE.
