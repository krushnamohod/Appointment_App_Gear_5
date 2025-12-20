/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // The Paper Planner Color Palette
      colors: {
        // Canvas - Warm Alabaster (Primary Background)
        paper: '#F9F7F2',
        canvas: '#F9F7F2',

        // Ink - Charcoal (Text & Borders)
        ink: '#2D2D2D',

        // Terracotta - Primary Actions
        terracotta: {
          DEFAULT: '#E07A5F',
          light: '#E89B85',
          dark: '#C96A51',
        },

        // Sage - Success & Available States
        sage: {
          DEFAULT: '#81B29A',
          light: '#A3C9B7',
          dark: '#6A9A82',
        },

        // Muted Gold - Highlights & Selected States
        gold: {
          DEFAULT: '#F2CC8F',
          light: '#F7DDB2',
          dark: '#E5B76B',
        },

        // Error - Soft Red
        error: '#E63946',

        // Semantic mappings
        background: '#F9F7F2',
        foreground: '#2D2D2D',
        primary: {
          DEFAULT: '#E07A5F',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#81B29A',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F2CC8F',
          foreground: '#2D2D2D',
        },
        muted: {
          DEFAULT: '#F0EDE5',
          foreground: '#6B6B6B',
        },
        border: 'rgba(45, 45, 45, 0.15)',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
      },

      // Typography
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'Lato', 'system-ui', 'sans-serif'],
      },

      // Border Radius - Mild, structured
      borderRadius: {
        'planner': '4px',
        'card': '6px',
        lg: '6px',
        md: '4px',
        sm: '2px',
      },

      // Box Shadow - Solid offset style
      boxShadow: {
        'card': '3px 3px 0px rgba(45, 45, 45, 0.1)',
        'card-hover': '4px 4px 0px rgba(45, 45, 45, 0.15)',
        'button': '2px 2px 0px rgba(45, 45, 45, 0.2)',
        'none': 'none',
      },
    },
  },
  plugins: [],
}
