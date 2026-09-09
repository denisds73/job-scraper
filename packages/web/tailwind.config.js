/** @type {import('tailwindcss').Config} */

/*
 * JOBSCOUT DESIGN SYSTEM
 * Inspired by: Google Material Design 3, Linear, Vercel, Stripe
 * 
 * Design Principles:
 * 1. Clarity over decoration - Every element serves a purpose
 * 2. Subtle depth - Use shadows and layers meaningfully
 * 3. Purposeful motion - Animations guide, not distract
 * 4. Generous whitespace - Let content breathe
 * 5. Typographic hierarchy - Clear information architecture
 */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * COLOR SYSTEM
       * Primary: Deep blue with trust/professional connotation
       * Accent: Vibrant teal for CTAs and highlights
       * Semantic colors with proper contrast ratios (WCAG AAA)
       */
      colors: {
        // Brand Primary - Sophisticated deep blue
        brand: {
          50: '#EEF4FF',
          100: '#E0EAFF',
          200: '#C6D8FF',
          300: '#A3BFFF',
          400: '#7A9CFF',
          500: '#5478F6',
          600: '#3B5CE9',
          700: '#2D4AD4',
          800: '#2840AB',
          900: '#273B87',
          950: '#1A2452',
        },
        // Accent - Vibrant teal for CTAs
        accent: {
          50: '#EFFEFA',
          100: '#C8FFF0',
          200: '#92FFE3',
          300: '#51F7D2',
          400: '#1DE4BC',
          500: '#00C9A2',
          600: '#00A485',
          700: '#00836C',
          800: '#046756',
          900: '#065548',
          950: '#00332D',
        },
        // Neutral - Warm gray for softer feel
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F4F4F5',
          150: '#ECECED',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          850: '#1F1F23',
          900: '#18181B',
          950: '#0D0D0F',
        },
        // Semantic colors
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },

      /*
       * TYPOGRAPHY
       * System font stack for maximum performance
       * Careful sizing with optical adjustments
       */
      fontFamily: {
        sans: [
          'Inter var',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
        display: [
          'Inter var',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Fira Code',
          'monospace',
        ],
      },
      fontSize: {
        // Refined scale with proper line heights
        'xs': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
        'sm': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'md': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.04em' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        wider: '0.04em',
        widest: '0.08em',
      },

      /*
       * SPACING
       * 4px base unit with purposeful scale
       */
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      /*
       * BORDER RADIUS
       * Consistent rounding that feels modern but not overdone
       */
      borderRadius: {
        'sm': '0.25rem',     // 4px - subtle
        'DEFAULT': '0.375rem', // 6px - inputs, small buttons
        'md': '0.5rem',      // 8px - buttons, chips
        'lg': '0.75rem',     // 12px - cards
        'xl': '1rem',        // 16px - modals, large cards
        '2xl': '1.25rem',    // 20px - feature cards
        '3xl': '1.5rem',     // 24px - hero elements
      },

      /*
       * SHADOWS
       * Layered shadows for realistic depth (Google Material 3 style)
       */
      boxShadow: {
        // Subtle elevation
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        // Default card shadow
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        // Elevated elements
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        // Dropdowns, popovers
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        // Modals
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        // Prominent elements
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        // Inner shadow for depth
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
        'inner-lg': 'inset 0 4px 8px 0 rgb(0 0 0 / 0.06)',
        // Colored shadows for brand elements
        'brand': '0 4px 14px 0 rgb(59 92 233 / 0.25)',
        'brand-lg': '0 8px 24px 0 rgb(59 92 233 / 0.3)',
        'accent': '0 4px 14px 0 rgb(0 201 162 / 0.3)',
        // Dark mode optimized
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dark-md': '0 4px 8px 0 rgb(0 0 0 / 0.4)',
        'dark-lg': '0 12px 24px 0 rgb(0 0 0 / 0.5)',
        // Glow effects
        'glow-brand': '0 0 20px 0 rgb(59 92 233 / 0.15)',
        'glow-accent': '0 0 20px 0 rgb(0 201 162 / 0.2)',
        // No shadow
        'none': 'none',
      },

      /*
       * ANIMATIONS & TRANSITIONS
       * Purposeful motion with proper easing
       */
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        // Google-style easing
        'ease-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        // Emphasized easing for dramatic motion
        'emphasized': 'cubic-bezier(0.2, 0.0, 0, 1.0)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        'emphasized-accelerate': 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
        // Spring-like
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      animation: {
        // Entrance animations
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'fade-in-up': 'fadeInUp 300ms ease-out forwards',
        'fade-in-down': 'fadeInDown 300ms ease-out forwards',
        'scale-in': 'scaleIn 200ms ease-out forwards',
        'slide-in-right': 'slideInRight 300ms ease-out forwards',
        'slide-in-left': 'slideInLeft 300ms ease-out forwards',
        'slide-in-up': 'slideInUp 300ms ease-out forwards',
        'slide-in-down': 'slideInDown 300ms ease-out forwards',
        // Micro-interactions
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        // Loading
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      /*
       * BACKDROP BLUR
       */
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      },

      /*
       * Z-INDEX SCALE
       */
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '100',
        'sticky': '200',
        'overlay': '300',
        'modal': '400',
        'popover': '500',
        'tooltip': '600',
        'toast': '700',
        'max': '9999',
      },

      /*
       * CONTAINER
       */
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'content': '72rem',
      },
    },
  },
  plugins: [],
}
