import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}', // escanea todos tus archivos en src/
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // fuente Inter desde next/font
      },
    },
  },
  plugins: [],
};

export default config;
