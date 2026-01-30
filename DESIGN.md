# DESIGN.md — Cleack Design System & Philosophy

> **App Name:** Cleack (formerly Cleack)  
> **Domain:** cleack.io  
> **Purpose:** Contest draw / giveaway platform  
> **Aesthetic:** Premium, distinctive, anti-generic

---

## 🚨 CRITICAL: ANTI-AI-SLOP MANDATE

**NEVER produce generic "AI-generated" aesthetics.**

Every design decision must be intentional, distinctive, and context-aware. If something feels familiar or safe, reject it and find a bolder direction.

---

## 1. Typography-First Design

Typography is the foundation, not an afterthought.

### Principles
- **Start with type**, then build components around it
- Pick fonts with **personality** (editorial, culturally loaded, underused)
- Mix **display + grotesk + mono** when it serves the design
- Justify why a font fits the product's psychology (trust, play, power, restraint, chaos)

### Approved Directions

| Direction | Fonts | Vibe |
|-----------|-------|------|
| **Neo-editorial** | Canela, Fraunces, Romie, Noe Display | Premium, magazine-like |
| **Brutalist/Utilitarian** | Authentic Sans, Favorit, ABC Diatype | Raw, honest, bold |
| **Technical/IDE** | Input Serif, Recursive, IBM Plex (with intent) | Precision, developer trust |
| **Cultural pulls** | Japanese (Hiragino), Swiss modernism, late-90s shareware, Unix manuals | Distinctive, memorable |

### 🚫 BANNED FONTS (overused, generic)
- Inter
- Roboto
- Arial
- System fonts
- Space Grotesk (becoming cliché)
- Open Sans
- Lato
- Poppins (unless very intentional)

---

## 2. Aesthetic Commitment

**One design = one dominant vibe.** No hedging.

### Color Distribution
```
60-70% — Dominant color (sets the mood)
20-30% — Supporting/neutral tones
5-10%  — Sharp accent (used sparingly, high impact)
```

### Cleack Brand Colors
```css
:root {
  /* Core palette */
  --bg-main: #0e0f14;           /* Deep dark */
  --bg-elevated: #1a1b23;       /* Cards, modals */
  --ink-primary: #f4f4f5;       /* Main text */
  --ink-muted: #6b7280;         /* Secondary text */
  
  /* Brand accent */
  --accent-primary: #8B5CF6;    /* Purple - main */
  --accent-hot: #EC4899;        /* Pink - CTAs, wins */
  --accent-glow: #ff2d95;       /* Neon pink - highlights */
  
  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Aesthetic Inspirations
- **IDE themes:** Dracula, Nord, Gruvbox (reinterpreted, not copied)
- **Cultural:** Japanese print restraint, brutalist posters, early web UI, fintech terminals
- **Product metaphors:** Chance, fairness, speed, tension, anticipation, randomness

---

## 3. Motion with Intention

**Fewer animations, bigger moments.**

### Principles
- One memorable sequence per page > scattered micro-interactions
- Motion must reinforce meaning (reveal = fairness, anticipation, winning moment)
- Think: **cinematic opening shot**, not UI glitter

### Implementation
```css
/* CSS-first approach */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  animation: reveal 0.6s ease-out forwards;
}

.reveal:nth-child(1) { animation-delay: 0ms; }
.reveal:nth-child(2) { animation-delay: 100ms; }
.reveal:nth-child(3) { animation-delay: 200ms; }

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### React (when needed)
- Use **Motion library** deliberately for entrance choreography
- Avoid "everything moves" syndrome
- Staggered reveals with `animation-delay` > complex orchestration

### 🚫 AVOID
- Gratuitous hover animations
- Bouncy/playful easing on serious UI
- Animation for animation's sake

---

## 4. Backgrounds as Atmosphere

**No flat white. No lazy gradients.**

### Techniques
- Layer multiple gradients
- Subtle noise, grain, or geometric repetition
- Match background to product story (chance, systems, structure)

### Examples for Cleack
```css
/* Probability field effect */
.bg-chance {
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #0e0f14 0%, #1a1b23 100%);
}

/* Subtle grid for "systems & fairness" */
.bg-grid {
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Noise overlay */
.noise::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/noise.svg');
  opacity: 0.03;
  pointer-events: none;
}
```

---

## 5. Context-Driven Layouts

**Layouts reflect what the product IS.**

### Principles
- No autopilot "Hero → 3 cards → CTA"
- Sometimes asymmetrical
- Sometimes constrained and rigid
- Sometimes playful and uncomfortable (on purpose)

### Cleack-Specific Layout Ideas
- **Draw page:** Tension-building layout, centered focus, theatrical
- **Results:** Celebration moment, confetti-worthy, trophy-like presentation
- **Dashboard:** Dense, data-rich, terminal-inspired
- **Landing:** Bold, editorial, magazine-spread feel

### 🚫 BANNED PATTERNS
- Generic SaaS marketing skeletons
- Identical card grids everywhere
- Safe, predictable component arrangements

---

## 6. Product-Specific Design Language

### Cleack Themes

| Context | Mood | Visual Language |
|---------|------|-----------------|
| **Pre-draw** | Anticipation, tension | Dark, focused, minimal |
| **Drawing** | Excitement, randomness | Motion, particles, glow |
| **Winner reveal** | Celebration, fairness | Spotlight, contrast, gold/pink |
| **Results/Certificate** | Trust, legitimacy | Clean, structured, official |

### Iconography
- Custom icons > generic icon libraries
- Consistent stroke weight
- Match the typography's personality

---

## 7. Dark Mode First

Cleack is **dark-mode primary**.

- Light mode is secondary/optional
- Dark creates focus, premium feel, "event" atmosphere
- Matches the anticipation/tension of a draw

---

## 8. Implementation Checklist

Before shipping any UI:

- [ ] Font choice is intentional and justified
- [ ] No banned fonts used
- [ ] Color ratio follows 60/30/10 rule
- [ ] One clear accent, not multiple competing colors
- [ ] Background has depth/atmosphere
- [ ] Motion is purposeful, not decorative
- [ ] Layout fits the context, not a template
- [ ] Feels designed, not generated

---

## Quick Reference: The Cleack Vibe

```
Cleack = Tension + Trust + Celebration

- Dark, atmospheric backgrounds
- Purple/pink accent gradient
- Editorial typography with personality
- Motion that builds anticipation
- Layouts that feel like an event, not a form
```

---

*Design is a weapon. Use it.*
