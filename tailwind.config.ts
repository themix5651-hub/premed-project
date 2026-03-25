import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9edff',
          500: '#0f6ab4',
          700: '#0c4f86',
          900: '#0a3556'
        }
      }
    }
  },
  plugins: []
};

export default config;
