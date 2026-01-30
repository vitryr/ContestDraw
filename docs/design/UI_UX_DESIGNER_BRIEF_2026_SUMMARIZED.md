# Cleack UI/UX Redesign Brief 2026 (Summarized)

## The Product
**Cleack** (cleack.io) automates social media giveaway draws. Users paste a contest URL, import participants automatically, apply filters, execute a fair draw, and get a shareable video + PDF certificate. **2-4 hours manual → 2 minutes automated.**

Platforms: Instagram, TikTok, Twitter/X, Facebook, YouTube

## Target Users
1. **Influencers** (50K-200K followers) - Need speed, Story-ready video, legitimacy proof
2. **Brand Marketers** - Need GDPR compliance, analytics, professional output
3. **Agencies** - Need efficiency for 20-30 contests/month across clients

Primary market: **France** (French-first, English secondary)

## Core User Flow
```
Create Draw → Import Participants → Configure Filters → Execute Draw → Share Results
   30s            10-60s              1-2min           5s (THE EVENT)
```

## Design Direction

### Personality
- Premium but accessible
- Trustworthy but exciting
- Modern 2026 aesthetic
- **NOT** generic SaaS, cartoonish, or corporate

### The Anti-Generic Mandate
Avoid: Hero + 3 cards + CTA patterns, gradient overload, stock illustrations, AI-slop aesthetics
Embrace: Editorial layouts, intentional asymmetry, typography as design, meaningful motion

## Color Palette (Dark Mode First)

```
BACKGROUNDS
--bg-primary: #0e0f14      (deep dark)
--bg-elevated: #1a1b23     (cards/modals)

TEXT
--ink-primary: #f4f4f5     (main text)
--ink-secondary: #a1a1aa   (secondary)

BRAND ACCENT
--accent-primary: #8B5CF6  (purple - main)
--accent-hot: #EC4899      (pink - CTAs, wins)

SEMANTIC
--success: #10b981 | --warning: #f59e0b | --error: #ef4444
```

**Rule:** 60% dark bg, 30% supporting, 10% accent

## Typography
Recommended: **Fraunces/Canela** (headlines) + **Söhne/ABC Diatype** (body)
Banned: Inter, Roboto, Open Sans, Poppins (too generic)

## Emotional Moods by Screen

| Screen | Mood | Visual |
|--------|------|--------|
| Landing | Impact, conversion | Bold editorial |
| Dashboard | Control, efficiency | Dense, organized |
| Pre-Draw | Anticipation | Dark, minimal, tension |
| **Draw Execution** | **Excitement** | **Motion, glow, particles** |
| Winner Reveal | Celebration | Spotlight, confetti, gold/pink |
| Certificate | Trust, legitimacy | Clean, official |

## The Draw Animation (STAR MOMENT)
The emotional peak. Should feel like: slot machine + lottery + award show envelope.

**Phases:**
1. Build-up (1-2s): Names shuffling rapidly
2. Slowdown (1-2s): Deceleration, tension
3. Selection (0.5s): Highlight lands
4. Reveal (1s): Zoom, glow, spotlight
5. Celebration (2s): Confetti burst

## Key Components Needed
1. Draw Card (status, platform, stats)
2. Credit Balance Widget (with low-balance warning)
3. Draw Execution View (full-screen, animated)
4. Winner Card (medal badge, avatar, certificate download)
5. Filter Panel (toggles, numeric inputs)
6. Auth forms, Onboarding, Pricing cards, Navigation

## Tech Stack (for handoff)
- Web: React + TypeScript + Tailwind CSS + Radix UI + Framer Motion
- Mobile: React Native + Expo

## Deliverables
1. Design system (colors, typography, spacing, components in Figma)
2. Key screens: Landing, Dashboard, Draw wizard, Draw execution, Results, Pricing, Auth
3. Assets: Logo, app icons, favicons, OG images

## Success Criteria
- Distinctive from competitors (not generic)
- Clear trust signals
- Exciting draw moment
- Mobile-first, desktop-excellent
- French market appeal, globally scalable

## Inspiration
Trust: Linear, Stripe, Vercel
Excitement: Apple keynotes, award shows
Editorial: Webflow, Arc Browser

---
*Cleack by Flowrigin OÜ | cleack.io | "Fair Draws, Automated"*
