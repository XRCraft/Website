import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        rubik: ['var(--font-rubik)', 'sans-serif'],
        'press-start': ['var(--font-press-start-2p)', 'cursive'],
        vt323: ['var(--font-vt323)', 'monospace'],
        minecraft: [
          'var(--font-press-start-2p)',
          'Minecraftia',
          'monospace',
        ],
      },
      colors: {
        mcgreen: '#5E7C16', // Minecraft grass
        mcbrown: '#7A5C29', // Minecraft dirt
        mcstone: '#A0A0A0', // Minecraft stone
        mcsky: '#6EC6F2',   // Minecraft sky
        mcwood: '#B97A57',  // Minecraft wood
        mcgold: '#FCDB05',  // Minecraft gold
      },
      boxShadow: {
        pixel: '0 0 0 4px #222, 0 0 0 8px #fff',
      },
      borderRadius: {
        pixel: '0.25rem', // blocky corners
      },
      backgroundImage: {
        'mc-grass': 'url(/grass.png)', // Add grass.png to public/
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      dropShadow: {
        'glow': '0 0 8px rgba(0, 195, 255, 0.5)',
      },
    },
  },
  plugins: [],
}
export default config
