/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#002D72',
          mid:     '#003FA5',
          light:   '#0D4FA8',
          bg:      '#001A4D',
          dark:    '#001030',
          section: '#00245E',
        },
        orange: {
          DEFAULT: '#FF5910',
          dim:     '#CC430A',
        },
        offwhite: '#F5F7FA',
        warm: {
          bg:      '#FAF8F5',
          section: '#F0EDE8',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Arial Narrow"', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
        body:    ['"DM Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono:    ['"Space Mono"', '"Courier New"', 'monospace'],
      },
      opacity: {
        12: '0.12',
        15: '0.15',
        18: '0.18',
        35: '0.35',
        42: '0.42',
        55: '0.55',
        58: '0.58',
        65: '0.65',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%':      { transform: 'translate(-30px,30px) scale(1.05)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%':      { transform: 'translate(20px,-20px) scale(1.08)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%':      { transform: 'translate(-15px,15px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      animation: {
        float1: 'float1 12s ease-in-out infinite',
        float2: 'float2 15s ease-in-out infinite',
        float3: 'float3 10s ease-in-out infinite',
        blink:  'blink 0.75s step-end infinite',
      },
    },
  },
  plugins: [],
}
