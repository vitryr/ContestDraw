# Cleack UI/UX Redesign Brief 2026
## Complete Brand & Design System Specification for UI/UX Designer

---

## Executive Summary

**Project:** Complete visual redesign of Cleack (web + mobile) for 2026
**Brand:** Cleack by Flowrigin OÜ (Estonia)
**Domain:** cleack.io
**Tagline:** "Fair Draws, Automated"

**Objective:** Create a premium, distinctive, modern design system that conveys trust, speed, and excitement while differentiating Cleack from generic SaaS tools in the social media contest space.

---

## 1. Product Overview

### What is Cleack?

Cleack is a SaaS platform that automates social media contest/giveaway draws for content creators, brands, and marketing agencies. It transforms a tedious 2-4 hour manual process into a 2-minute automated experience.

### Core Value Proposition

| Pain Point | Cleack Solution |
|------------|-----------------|
| Hours wasted copy-pasting comments | Automatic participant import in seconds |
| Fake accounts & bots winning | Advanced filtering (followers, account age, engagement) |
| No proof of fairness | SHA-256 cryptographic verification + PDF certificates |
| GDPR compliance complexity | EU-hosted, DPO designated, legally compliant |
| Boring announcement | Story-format animated videos (9:16) with confetti |

### Platform Support

- Instagram (primary)
- TikTok
- Twitter/X
- Facebook
- YouTube

---

## 2. Target User Personas

### Primary Personas

#### 1. The Influencer (Sarah, 28)
- **Profile:** Content creator with 50K-200K followers
- **Runs:** 2-4 giveaways per month
- **Needs:** Speed, legitimacy proof, Story-ready video output
- **Pain:** "I spend 3 hours per giveaway copy-pasting comments into Excel"
- **Device:** Primarily mobile (iPhone), occasional desktop

#### 2. The Brand Marketing Manager (Thomas, 35)
- **Profile:** E-commerce/DTC brand marketing lead
- **Runs:** Monthly promotional contests
- **Needs:** GDPR compliance, analytics, professional certificates
- **Pain:** "Legal keeps asking for GDPR proof, and I can't prove the draw was fair"
- **Device:** Desktop-first for management, mobile for quick checks

#### 3. The Agency Account Manager (Marie, 32)
- **Profile:** Manages 10+ client brands
- **Runs:** 20-30 contests per month across clients
- **Needs:** Efficiency, multi-client management, white-label options
- **Pain:** "I need to run multiple draws daily and produce consistent deliverables"
- **Device:** Desktop for work, mobile for client emergencies

### Secondary Persona

#### 4. The Small Business Owner (Lucas, 42)
- **Profile:** Local business running occasional social promotions
- **Runs:** 1-2 contests per quarter
- **Needs:** Simplicity, low cost, clear guidance
- **Pain:** "I don't understand social media giveaway rules"
- **Device:** Mobile-first (limited tech sophistication)

### Demographics
- **Primary Market:** France (French-first)
- **Secondary Markets:** DACH, Spain, Italy, UK
- **Language:** French primary, English secondary
- **Age Range:** 25-45

---

## 3. User Journey & Key Workflows

### Primary Flow: Execute a Contest Draw

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: CREATE                                                 │
│  ─────────────────                                              │
│  • Click "New Draw"                                             │
│  • Enter title (e.g., "Win a MacBook!")                         │
│  • Select platform (Instagram/TikTok/etc.)                      │
│  • Paste contest post URL                                       │
│  ⏱ Time: ~30 seconds                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: IMPORT PARTICIPANTS                                    │
│  ───────────────────────────                                    │
│  • Automatic comment/participant fetching                       │
│  • Real-time progress bar                                       │
│  • Preview participant list                                     │
│  ⏱ Time: 10-60 seconds                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: CONFIGURE FILTERS (Optional)                           │
│  ─────────────────────────────────────                          │
│  • Exclude duplicates                                           │
│  • Require follow verification                                  │
│  • Minimum followers threshold                                  │
│  • Required hashtags/mentions                                   │
│  • Account age minimum                                          │
│  ⏱ Time: 1-2 minutes                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: EXECUTE DRAW ⭐ (THE MAIN EVENT)                       │
│  ─────────────────────────────────────────                      │
│  • Review participant count & credit cost                       │
│  • Click "Execute Draw"                                         │
│  • Watch animated selection (dramatic reveal)                   │
│  • Winner(s) revealed with celebration                          │
│  ⏱ Time: ~5 seconds (but feels like an EVENT)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: ANNOUNCE & SHARE                                       │
│  ────────────────────────                                       │
│  • View winner details & profile                                │
│  • Download PDF certificate (with hash)                         │
│  • Export MP4 Story video (9:16)                                │
│  • Share public verification link                               │
│  • Contact winners directly                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Total Time:** 2-3 minutes (vs 2-4 hours manually)

### Secondary Flows

1. **Onboarding:** Sign up → Email verify → Welcome credits → First draw tutorial
2. **Purchase Credits:** Profile → Billing → Select pack → Stripe payment
3. **View History:** Dashboard → Past draws → Filter/search → View details
4. **Public Verification:** Share link → Anyone can verify draw fairness

---

## 4. Current State Analysis

### Current Color Inconsistency (PROBLEM)

| Platform | Primary Color | Status |
|----------|---------------|--------|
| Web | Teal `#0d9488` | Inconsistent |
| Mobile | Purple `#6366F1` | Inconsistent |

**This needs unification in the redesign.**

### Current Tech Stack

| Platform | Framework | Styling | UI Components |
|----------|-----------|---------|---------------|
| Web | React 18 + TypeScript | Tailwind CSS 3.3 | Radix UI + Lucide icons |
| Mobile | React Native + Expo | StyleSheet API | Ionicons |

### Current Component Inventory

**Shared Components Needed:**
- Dashboard with draw cards
- Draw creation wizard (multi-step)
- Filter configuration panel
- Participant list with search/filter
- Real-time import progress
- **Animated draw execution** (THE STAR)
- Winner results display
- Certificate preview/download
- Credit balance widget
- Pricing cards
- Social account connection
- Auth forms (login/register)
- Onboarding carousel

### Current Design Patterns

- Card-based layouts
- Framer Motion animations (web)
- Form validation with inline errors
- Toast notifications for feedback
- Mobile hamburger navigation
- Tab-based navigation (profile sections)

---

## 5. Design Direction & Brand Personality

### Brand Personality

**Cleack is:**
- Trustworthy but not boring
- Efficient but not cold
- Premium but accessible
- Exciting but not frivolous
- Modern but not trendy

**Cleack is NOT:**
- Generic SaaS
- Playful/cartoonish
- Corporate/enterprise-stuffy
- Cluttered/overwhelming

### The Anti-AI-Slop Mandate

> "The design must be distinctive and premium, not another generic gradient-filled SaaS landing page that looks AI-generated."

**Avoid:**
- Generic hero + 3 feature cards + CTA patterns
- Overused gradients everywhere
- Stock illustration style
- Cookie-cutter SaaS layouts

**Embrace:**
- Editorial/magazine-inspired layouts
- Intentional asymmetry
- Typography as a design element
- Meaningful motion (not UI glitter)

---

## 6. Design Mood by Context

| Screen/Context | Emotional Mood | Visual Language |
|----------------|----------------|-----------------|
| **Landing Page** | Impact, intrigue, conversion | Bold editorial, magazine-spread feel, asymmetrical |
| **Dashboard** | Control, efficiency, overview | Dense but organized, data-rich, terminal-inspired |
| **Pre-Draw Setup** | Anticipation, focus | Dark, minimal, building tension |
| **Draw Execution** | Excitement, randomness, fairness | Motion, particles, glow effects, dramatic |
| **Winner Reveal** | Celebration, legitimacy | Spotlight effect, gold/pink accents, confetti |
| **Results/Certificate** | Trust, professionalism | Clean, structured, official document feel |
| **Pricing** | Clarity, value | Transparent, simple, no tricks |
| **Profile/Settings** | Utility, management | Functional, organized, secondary importance |

---

## 7. Color Palette Recommendation

### Primary Palette (Dark Mode First)

```css
/* === BACKGROUNDS === */
--bg-void: #09090b;        /* Deepest black - page background */
--bg-primary: #0e0f14;     /* Main dark background */
--bg-elevated: #1a1b23;    /* Cards, modals, elevated surfaces */
--bg-hover: #252630;       /* Hover states on dark surfaces */

/* === TEXT (INK) === */
--ink-primary: #f4f4f5;    /* Main text - high contrast */
--ink-secondary: #a1a1aa;  /* Secondary text */
--ink-muted: #6b7280;      /* Tertiary/disabled text */
--ink-inverse: #09090b;    /* Text on light backgrounds */

/* === BRAND ACCENT === */
--accent-primary: #8B5CF6; /* Purple - main brand color */
--accent-secondary: #A78BFA; /* Lighter purple - hover/secondary */
--accent-hot: #EC4899;     /* Pink - CTAs, wins, celebrations */
--accent-glow: #ff2d95;    /* Neon pink - glows, highlights */

/* === SEMANTIC === */
--success: #10b981;        /* Green - verified, complete */
--warning: #f59e0b;        /* Amber - caution, pending */
--error: #ef4444;          /* Red - errors, destructive */
--info: #3b82f6;           /* Blue - informational */

/* === PLATFORM COLORS === */
--instagram: #E1306C;
--tiktok: #000000;
--twitter: #1DA1F2;
--facebook: #1877F2;
--youtube: #FF0000;

/* === MEDAL COLORS === */
--gold: #FFD700;
--silver: #C0C0C0;
--bronze: #CD7F32;
```

### Color Distribution Rule

- **60%** Dominant (dark backgrounds)
- **30%** Supporting (elevated surfaces, text)
- **10%** Accent (CTAs, highlights, wins)

### Light Mode (Secondary)

For users who prefer light mode, provide a professionally designed alternative:

```css
--bg-primary: #ffffff;
--bg-elevated: #f9fafb;
--ink-primary: #111827;
--ink-secondary: #4b5563;
/* Accent colors remain the same */
```

---

## 8. Typography Direction

### Recommended Font Pairings

**Option A: Neo-Editorial (Premium/Distinctive)**
- Headlines: **Fraunces** or **Canela** (serif with personality)
- Body: **Söhne** or **ABC Diatype** (clean geometric)

**Option B: Technical/Modern (Trust/Precision)**
- Headlines: **GT America** or **Favorit** (utilitarian)
- Body: **IBM Plex Sans** or **Input Sans** (technical clarity)

**Option C: Bold Statement**
- Headlines: **Clash Display** or **Cabinet Grotesk** (bold impact)
- Body: **Satoshi** or **General Sans** (balanced readability)

### Typography Scale

```css
/* Display */
--text-display: 48px / 1.1 / -0.02em;   /* Hero headlines */
--text-h1: 36px / 1.2 / -0.02em;        /* Page titles */
--text-h2: 28px / 1.3 / -0.01em;        /* Section headers */
--text-h3: 22px / 1.4;                  /* Subsections */

/* Body */
--text-lg: 18px / 1.6;                  /* Lead paragraphs */
--text-base: 16px / 1.5;                /* Body text */
--text-sm: 14px / 1.5;                  /* Secondary text */
--text-xs: 12px / 1.4;                  /* Captions, labels */

/* Mono (for hashes, codes) */
--text-mono: 14px / 1.5;                /* Code, verification hashes */
```

### Banned Fonts (Too Generic)

- Inter, Roboto, Arial, Helvetica
- Open Sans, Lato, Poppins, Montserrat
- Space Grotesk, DM Sans
- Any system default fonts

---

## 9. Spacing & Layout System

### Spacing Scale (4px base)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Border Radius

```css
--radius-sm: 4px;    /* Small elements, badges */
--radius-md: 8px;    /* Buttons, inputs */
--radius-lg: 12px;   /* Cards */
--radius-xl: 16px;   /* Modals, large cards */
--radius-2xl: 24px;  /* Feature sections */
--radius-full: 9999px; /* Pills, avatars */
```

### Elevation (Shadows)

```css
/* Dark mode - use subtle glows instead of shadows */
--shadow-sm: 0 0 10px rgba(139, 92, 246, 0.1);
--shadow-md: 0 0 20px rgba(139, 92, 246, 0.15);
--shadow-lg: 0 0 40px rgba(139, 92, 246, 0.2);
--shadow-glow: 0 0 60px rgba(236, 72, 153, 0.3);
```

---

## 10. Animation & Motion Guidelines

### Principles

1. **Motion with meaning** - Every animation should reinforce the message
2. **One hero animation per page** - Don't scatter animations everywhere
3. **CSS-first** - Use CSS transitions for simple states, JS for complex sequences
4. **Performance** - 60fps minimum, GPU-accelerated transforms

### Key Animation Moments

| Moment | Animation Style | Purpose |
|--------|-----------------|---------|
| Page load | Staggered fade-in from bottom | Progressive reveal |
| Draw execution | Spinning selection, particle effects | Build anticipation |
| Winner reveal | Spotlight + scale + confetti | Celebration climax |
| Button hover | Subtle glow pulse | Indicate interactivity |
| Card hover | Lift + shadow increase | Depth/selection |
| Toast notification | Slide from top | Non-intrusive feedback |

### Draw Execution Animation (THE STAR)

The draw execution is the emotional peak of the product. It should feel like:
- A slot machine moment
- A lottery ball selection
- An award show envelope opening

**Phases:**
1. **Build-up** (1-2s): Names scrolling/shuffling rapidly
2. **Slowdown** (1-2s): Deceleration, anticipation building
3. **Selection** (0.5s): Highlight lands on winner
4. **Reveal** (1s): Zoom, glow, spotlight on winner
5. **Celebration** (2s): Confetti, celebration effects

---

## 11. Component Specifications

### Priority 1: Core Components

#### 1. Draw Card (Dashboard)
- Status badge (Draft/Active/Completed)
- Platform icon
- Title
- Participant count
- Winner count (if completed)
- Date
- Quick actions (View/Edit/Delete)

#### 2. Credit Balance Widget
- Current balance prominently displayed
- Low balance warning state
- Quick "Buy Credits" CTA
- Welcome bonus celebration (first-time)

#### 3. Draw Execution View
- Full-screen takeover
- Animated participant selection
- Winner reveal with celebration
- Download/share CTAs after completion

#### 4. Winner Card
- Position badge (1st/2nd/3rd with medal colors)
- Avatar with platform icon
- Username with link to profile
- Stats (followers, engagement)
- Certificate download button

#### 5. Filter Configuration Panel
- Toggle switches for each filter
- Numeric inputs with validation
- Clear explanation of each filter
- Preview of filtered participant count

### Priority 2: Supporting Components

- Auth forms (login/register/forgot password)
- Onboarding carousel (3-4 screens)
- Pricing cards (3 tiers)
- Social connection buttons
- Navigation (desktop + mobile)
- Footer
- Empty states
- Loading states
- Error states

### Priority 3: Polish Components

- Certificate preview (PDF)
- Video export preview (9:16)
- Transaction history list
- Settings sections

---

## 12. Platform-Specific Considerations

### Web (Desktop)

- Wide layouts utilizing full screen
- Multi-column dashboard
- Hover states for all interactive elements
- Keyboard shortcuts for power users
- Dense information display acceptable

### Web (Tablet)

- Responsive breakpoints
- Touch-friendly targets (44px minimum)
- Collapsible sidebars

### Mobile (iOS/Android)

- Bottom navigation bar
- Native gesture patterns
- Pull-to-refresh
- Haptic feedback for key actions
- Safe area handling (notch, home indicator)
- Platform-specific components where appropriate

---

## 13. Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Color contrast ratios: 4.5:1 for text, 3:1 for UI
- Focus indicators for keyboard navigation
- Screen reader friendly labels
- Reduced motion option
- Touch targets minimum 44x44px

---

## 14. Deliverables Requested

### Design System

1. **Color palette** with light/dark mode tokens
2. **Typography scale** with font selections
3. **Spacing system** documentation
4. **Component library** in Figma
5. **Icon style** guidelines
6. **Animation specifications**

### Screen Designs

**High Priority (Full Design):**
1. Landing page (desktop + mobile)
2. Dashboard (desktop + mobile)
3. Draw creation wizard (3 steps)
4. Draw execution animation sequence
5. Winner results page
6. Public verification page
7. Pricing page

**Medium Priority (Key Screens):**
8. Auth screens (login/register)
9. Profile/settings
10. Onboarding flow
11. Buy credits flow

### Assets

1. Logo refinement (if needed)
2. App icon (iOS/Android)
3. Favicon set
4. Open Graph images
5. Empty state illustrations
6. Platform icons (styled)

---

## 15. Success Criteria

### Visual Goals

- [ ] Distinctive from competitors (not generic SaaS)
- [ ] Premium feel aligned with pricing
- [ ] Trust signals clearly communicated
- [ ] Excitement for the draw moment
- [ ] Mobile-first but desktop-excellent

### Functional Goals

- [ ] Clear user journey through draw flow
- [ ] Obvious CTAs and next steps
- [ ] Information hierarchy that guides attention
- [ ] Consistent patterns across platforms

### Brand Goals

- [ ] Memorable visual identity
- [ ] Professional but not corporate
- [ ] Modern 2026 aesthetic
- [ ] French market appeal with global scalability

---

## 16. Reference & Inspiration

### Mood Board Direction

**Trust & Technology:**
- Linear.app (precision, clean)
- Stripe (trust, technical excellence)
- Vercel (developer-premium)

**Excitement & Event:**
- Apple Keynote reveals
- Awards show aesthetics
- Lottery/game show tension

**Editorial & Premium:**
- Webflow (editorial layouts)
- Notion (clean utility)
- Arc Browser (bold choices)

### What to Avoid

- Dropbox-style generic SaaS
- Over-animated "delightful" patterns
- Pastel gradient overload
- Stock photo aesthetics
- Comic Sans energy

---

## 17. Timeline & Collaboration

### Recommended Process

1. **Discovery** (Week 1): Review brief, ask questions, mood board
2. **Exploration** (Week 2): 2-3 visual directions for key screens
3. **Refinement** (Week 3): Selected direction refined
4. **System** (Week 4): Component library and design tokens
5. **Screens** (Week 5-6): All priority screens designed
6. **Handoff** (Week 7): Developer-ready specifications

### Collaboration Points

- Access to current staging environment
- Slack/Discord for async questions
- Weekly sync calls
- Figma for design collaboration
- GitHub for asset handoff

---

## Contact

**Project:** Cleack UI/UX Redesign 2026
**Company:** Flowrigin OÜ
**Website:** cleack.io

---

*This brief was generated by analyzing the complete Cleack codebase, documentation, and product vision using AI-assisted deep research across 5 parallel analysis streams.*
