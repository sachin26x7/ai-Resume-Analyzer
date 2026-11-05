/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-soft': '#EFF6FF',
          teal: '#14B8A6',
        },
        surface: {
          main: '#FFFFFF',
          secondary: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0B1220',
          'dark-card': '#111C2E',
          elevated: '#182438',
          border: '#E2E8F0',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
