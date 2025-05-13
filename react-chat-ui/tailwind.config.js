/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        boxShadow: {
          'glow-primary-white': '0px 0px 8px 0px #FFFFFF50',
          'glow-secondary-green': '0px 0px 8px 0px #64FFAA50',
          'glow-secondary-red': '0px 0px 8px 0px #FF646450',
        },
        fontFamily: {
          sans: ['IBM Plex Sans', 'sans-serif'],
        },
        spacing: {
          4.5: '18px',
        },
        fontSize: {
          'title-xl': ['24px', { lineHeight: '32px', letterSpacing: '-4%', fontWeight: '400' }],
          'title-l': ['20px', { lineHeight: '24px', letterSpacing: '-1%', fontWeight: '400' }],
          'title-m': ['16px', { lineHeight: '24px', letterSpacing: '-1%', fontWeight: '500' }],
          'title-s': ['14px', { lineHeight: '20px', letterSpacing: '-1%', fontWeight: '500' }],
          'title-xs': ['12px', { lineHeight: '16px', letterSpacing: '-1%', fontWeight: '500' }],
          'body-xxl': ['24px', { lineHeight: '32px', letterSpacing: '-1%', fontWeight: '400' }],
          'body-xl': ['18px', { lineHeight: '24px', letterSpacing: '-2%', fontWeight: '400' }],
          'body-l': ['16px', { lineHeight: '24px', letterSpacing: '-2%', fontWeight: '400' }],
          'body-m': ['14px', { lineHeight: '20px', letterSpacing: '-2%', fontWeight: '400' }],
          'body-m-accent': ['14px', { lineHeight: '20px', letterSpacing: '-2%', fontWeight: '600' }],
          'body-s': ['12px', { lineHeight: '16px', letterSpacing: '-2%', fontWeight: '400' }],
          'body-xs': ['10px', { lineHeight: '16px', letterSpacing: '0%', fontWeight: '500' }],
          'number-xl': ['64px', { lineHeight: 'normal', letterSpacing: '-4%', fontWeight: '400' }],
          'number-l': ['32px', { lineHeight: 'normal', letterSpacing: '-4%', fontWeight: '400' }],
          'number-m': ['32px', { lineHeight: 'normal', letterSpacing: '-4%', fontWeight: '400' }],
          'number-s': ['20px', { lineHeight: 'normal', letterSpacing: '-0.8px', fontWeight: '400' }],
        },
      },
    },
    plugins: [],
  };
  