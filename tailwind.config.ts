import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      ivory: 'var(--ivory)',
      sand: 'var(--sand)',
      rope: 'var(--rope)',
      stone: 'var(--stone)',
      cocoa: {
        DEFAULT: 'var(--cocoa)',
        70: 'var(--cocoa-70)',
        55: 'var(--cocoa-55)',
        30: 'var(--cocoa-30)',
        15: 'var(--cocoa-15)',
        8: 'var(--cocoa-08)',
      },
      copper: {
        DEFAULT: 'var(--copper)',
        85: 'var(--copper-85)',
        70: 'var(--copper-70)',
      },
    },
    fontFamily: {
      serif: ['Fraunces', 'Frank Ruhl Libre', 'Times New Roman', 'serif'],
      sans: [
        'Heebo',
        'Google Sans Text',
        'Roboto Flex',
        'Inter',
        'system-ui',
        'sans-serif',
      ],
    },
    fontSize: {
      meta: ['8pt', { lineHeight: '1.5', letterSpacing: '0.18em' }],
      small: ['10pt', { lineHeight: '1.45' }],
      body: ['11pt', { lineHeight: '1.55' }],
      lede: ['14pt', { lineHeight: '1.4' }],
      sub: ['22pt', { lineHeight: '1.15', letterSpacing: '-0.018em' }],
      display: ['44pt', { lineHeight: '0.94', letterSpacing: '-0.035em' }],
      hero: ['92pt', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
    },
    spacing: {
      0: '0',
      px: '1px',
      hair: '0.5mm',
      xs: '2mm',
      sm: '4mm',
      md: '8mm',
      lg: '14mm',
      xl: '22mm',
      xxl: '36mm',
      full: '100%',
      screen: '100dvh',
    },
    extend: {
      borderRadius: {
        device: '54px',
        notch: '20px',
      },
      maxWidth: {
        body: '130mm',
        lede: '110mm',
        caption: '90mm',
        quote: '100mm',
      },
      letterSpacing: {
        meta: '0.18em',
      },
      boxShadow: {
        device: '0 30px 80px -20px rgba(53, 40, 24, 0.4)',
      },
      // Default Tailwind numeric spacing alongside the DA mm-scale.
      // mm tokens (xs/sm/md/lg/xl/xxl) own LAYOUT spacing per the DA;
      // numeric steps below own pixel-precise interactive sizing
      // (icon sizes, gap micro-spacing, tap-target heights).
      spacing: {
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
      },
      screens: {
        // default tailwind breakpoints (sm 640, md 768, lg 1024, xl 1280, 2xl 1536) preserved
      },
      // Eased curves per the DA / impeccable product spec — exponential
      // ease-out, no bounce, no elastic. Use for state transitions.
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        'out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
