import type { Config } from 'tailwindcss';
import { tokenPlugin } from './tailwindcss-plugins/tokens';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled': 'var(--color-text-disabled)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
        '5xl': 'var(--radius-5xl)',
      },
      spacing: {
        0: 'var(--unit-0)',
        1: 'var(--unit-1)',
        2: 'var(--unit-2)',
        4: 'var(--unit-4)',
        8: 'var(--unit-8)',
        12: 'var(--unit-12)',
        16: 'var(--unit-16)',
        20: 'var(--unit-20)',
        24: 'var(--unit-24)',
        32: 'var(--unit-32)',
        36: 'var(--unit-36)',
        40: 'var(--unit-40)',
        48: 'var(--unit-48)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [tokenPlugin],
};

export default config;
