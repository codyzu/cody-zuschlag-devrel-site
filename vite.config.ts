import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteRadar from 'vite-plugin-radar';
import unocss from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';
import presetWebFonts from '@unocss/preset-web-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss({
      presets: [
        presetUno(),
        presetIcons({
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
        }),
        presetWebFonts({
          provider: 'bunny', // Default provider
          fonts: {
            // These will extend the default theme
            sans: 'Roboto:400,600,700',
          },
        }),
      ],
      theme: {
        colors: {
          highlight: '#0ea5e9', // Sky-500
          secondary: '#9ca3af', // Gray-400
          primary: '#ffffff', // White
        },
      },
      shortcuts: {
        link: 'text-highlight no-underline',
      },
      rules: [
        [
          'bg-cover-faded',
          {
            'background-image':
              "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/background.webp');",
          },
        ],
        [
          'section-shadow',
          {'box-shadow': '0 1rem 3rem rgba(255 255 255 / 18%);'},
        ],
      ],
    }),
    react(),
    viteRadar({analytics: [{id: 'G-DMTB5F3X2D'}]}),
  ],
});
