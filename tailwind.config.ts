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
        minecraft: [
          '"Press Start 2P"',
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
    },
  },
  plugins: [],
}
export default config
