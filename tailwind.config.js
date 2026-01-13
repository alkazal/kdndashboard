export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',

        // Primary brand colors (fallback)
        'primary-50': '#f0fdfa',
        'primary-100': '#ccfbf1',
        'primary-200': '#99f6e4',
        'primary-300': '#5eead4',
        'primary-400': '#2dd4bf',
        'primary-500': '#14b8a6',
        'primary-600': '#0d9488',
        'primary-700': '#0f766e',
        'primary-800': '#115e59',
        'primary-900': '#134e4a',

        // Override all gray and slate colors with CSS variables
        gray: {
          50: 'var(--color-gray-50, #f9fafb)',
          100: 'var(--color-gray-100, #f3f4f6)',
          200: 'var(--color-gray-200, #e5e7eb)',
          300: 'var(--color-gray-300, #d1d5db)',
          400: 'var(--color-gray-400, #9ca3af)',
          500: 'var(--color-gray-500, #6b7280)',
          600: 'var(--color-gray-600, #4b5563)',
          700: 'var(--color-gray-700, #374151)',
          800: 'var(--color-gray-800, #1f2937)',
          900: 'var(--color-gray-900, #111827)',
        },
        slate: {
          50: 'var(--color-slate-50, #f8fafc)',
          100: 'var(--color-slate-100, #f1f5f9)',
          200: 'var(--color-slate-200, #e2e8f0)',
          300: 'var(--color-slate-300, #cbd5e1)',
          400: 'var(--color-slate-400, #94a3b8)',
          500: 'var(--color-slate-500, #64748b)',
          600: 'var(--color-slate-600, #475569)',
          700: 'var(--color-slate-700, #334155)',
          800: 'var(--color-slate-800, #1e293b)',
          900: 'var(--color-slate-900, #0f172a)',
        },
        white: 'var(--color-white, #ffffff)',
        black: 'var(--color-black, #000000)',

        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Glass morphism
        // glass: {
        //   light: 'rgba(255, 255, 255, 0.1)',
        //   dark: 'rgba(0, 0, 0, 0.2)',
        //   border: 'rgba(255, 255, 255, 0.15)',
        // },
        // Premium colors
        premium: {
          black: '#0A0A0A',
          gold: '#D4AF37',
          silver: '#C0C0C0',
          slate: '#1E1E1E',
        }
      },

      // Typography scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Border radius
      borderRadius: {
        '4xl': '2rem',
      },

      // Shadows
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'premium-soft': '0 20px 50px rgba(0, 0, 0, 0.1)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      },

      // Animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },

      // Transitions
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    }
  },
  plugins: [],
}