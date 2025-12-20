/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Existing colors
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF'
        },
        success: '#10B981',
        error: '#EF4444',
        // Shadcn required colors
        background: '#FFFFFF',
        foreground: '#0F172A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A'
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B'
        },
        accent: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#3B82F6'
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 }
        }
      }
    }
  },
  plugins: []
};
