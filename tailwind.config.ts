import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#090807',
        'bg-secondary': '#12100D',
        'bg-soft': '#1B1712',
        'text-ivory': '#F3EEE5',
        'text-warm': '#C7C0B5',
        'text-muted': '#8E887E',
        'border-cin': '#3A332B',
        'border-light': '#5A4D3E',
        'accent': '#D9A85B',
        'accent-light': '#E8C58F',
        'accent-dark': '#9B713B',
      },
      fontFamily: {
        headings: ['Syne', 'sans-serif'],
        sections: ['Outfit', 'sans-serif'],
        labels: ['Space Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
