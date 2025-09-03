/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-color)',
        accent: 'var(--accent-color)',
        primary: 'var(--primary-color)',
        surface: 'var(--surface-color)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      spacing: {
        lg: 'var(--spacing-lg)',
        md: 'var(--spacing-md)',
        sm: 'var(--spacing-sm)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

