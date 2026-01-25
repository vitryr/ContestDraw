# ContestDraw Web Frontend

Modern React.js web application for ContestDraw - automated contest draws with video generation and certificates.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form + Zod** - Form validation
- **Axios** - API client
- **Radix UI** - Component primitives

## Features

- 🎨 Modern, minimalist design (Revolut/Wise inspired)
- 📱 Fully responsive (mobile-first)
- ✨ Smooth animations with Framer Motion
- 🎬 Story format (9:16) draw animations
- 🎊 Confetti effects for winners
- 📝 Form validation with Zod
- 🔐 JWT authentication
- 💳 Credit-based pricing system
- 📱 Social media integration (Instagram, Twitter, TikTok)
- 📄 Digital certificate generation
- 🎥 Automated video export

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will run on http://localhost:3000

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx
│   ├── DrawAnimation.tsx
│   ├── FilterConfig.tsx
│   ├── ParticipantsList.tsx
│   ├── WinnerCard.tsx
│   ├── CreditBalance.tsx
│   └── SocialConnect.tsx
├── pages/           # Page components
│   ├── LandingPage.tsx
│   ├── AuthPage.tsx
│   ├── DashboardPage.tsx
│   ├── NewDrawPage.tsx
│   ├── DrawConfigPage.tsx
│   ├── DrawExecutionPage.tsx
│   ├── ResultsPage.tsx
│   ├── PricingPage.tsx
│   └── ProfilePage.tsx
├── store/           # Zustand stores
│   ├── useAuthStore.ts
│   ├── useDrawStore.ts
│   └── useCreditsStore.ts
├── services/        # API services
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
├── utils/           # Utility functions
│   └── date.ts
├── App.tsx          # Root component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Key Components

### DrawAnimation.tsx
- Vertical story format (1080x1920)
- Three-phase animation:
  1. Intro with title
  2. Scrolling participant names
  3. Winner reveal with confetti
- Canvas confetti integration
- Exportable to MP4

### FilterConfig.tsx
- Configure draw rules and filters
- Engagement requirements (followers, likes, comments)
- Keyword exclusion
- Duplicate detection
- Following requirement

### State Management

Uses Zustand for simple, effective state management:

- **useAuthStore**: Authentication state
- **useDrawStore**: Draw data and operations
- **useCreditsStore**: Credit balance and transactions

## API Integration

The app connects to the backend API at `/api` (proxied via Vite to `http://localhost:8000`).

All API calls are centralized in `src/services/api.ts` with:
- Automatic JWT token injection
- Error handling with toast notifications
- Type-safe responses

## Styling

- TailwindCSS for utility-first styling
- Custom color scheme with primary (teal) and accent (purple)
- Responsive design with mobile-first approach
- Custom utility classes defined in `index.css`

## Forms

All forms use:
- React Hook Form for performance
- Zod for schema validation
- Proper error handling and display

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance

## SEO

- Meta tags configured in `index.html`
- OpenGraph tags for social sharing
- Twitter Card support
- Semantic HTML structure

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox

## License

Proprietary
