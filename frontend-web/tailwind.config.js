/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New Cleack Design System (from Figma)
        bg: {
          void: '#09090b',
          primary: '#0f0820',
          elevated: '#1a0d2e',
          card: '#2a1f3d',
          hover: '#352a4d',
        },
        ink: {
          primary: '#ffffff',
          secondary: '#a193b8',
          muted: '#6b5f7d',
          inverse: '#0f0820',
        },
        accent: {
          primary: '#ec4899',
          secondary: '#7c3aed',
          tertiary: '#a855f7',
          glow: '#ff2d95',
        },
        // Legacy primary (backward compatibility)
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Semantic Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Platform Colors
        instagram: '#E1306C',
        tiktok: '#000000',
        twitter: '#1DA1F2',
        facebook: '#1877F2',
        youtube: '#FF0000',
        // Medal Colors
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '14px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '33554400px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(124, 58, 237, 0.1)',
        'glow-md': '0 0 20px rgba(124, 58, 237, 0.15)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.2)',
        'glow-xl': '0 0 60px rgba(124, 58, 237, 0.3), 0 0 120px rgba(124, 58, 237, 0.3)',
        'glow-pink': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'scroll-names': 'scroll 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0f0820 0%, #1a0d2e 100%)',
        'gradient-purple-pink': 'linear-gradient(168.76deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-purple': 'linear-gradient(159.33deg, #7c3aed 0%, #a855f7 100%)',
      },
    },
  },
  plugins: [],
};
