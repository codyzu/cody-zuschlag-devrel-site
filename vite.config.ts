import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePluginRadar as vitePluginRadar} from 'vite-plugin-radar';
import unocss from 'unocss/vite'; // eslint-disable-line n/file-extension-in-import
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';
import presetWebFonts from '@unocss/preset-web-fonts';
import transformerDirectives from '@unocss/transformer-directives';
import {imagetools} from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    imagetools(),
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
          hero: '#469537', // From the hero photo
          background: '#000000',
        },
      },
      shortcuts: {
        link: 'text-highlight no-underline',
        photo: 'rounded-xl w-full h-full object-cover aspect-[4/3]',
        'bg-gradient-title':
          'bg-gradient-to-br from-primary via-primary to-highlight',
        'bg-gradient-hero':
          'bg-gradient-to-br from-primary via-primary to-hero',
        'bg-gradient-link':
          'bg-gradient-to-br from-primary via-highlight to-highlight',
      },
      rules: [
        [
          'section-shadow',
          {'box-shadow': '0 1rem 3rem rgba(255 255 255 / 18%);'},
        ],
      ],
      transformers: [transformerDirectives()],
    }),
    react(),
    vitePluginRadar({analytics: [{id: 'G-DMTB5F3X2D'}]}),
  ],
});
