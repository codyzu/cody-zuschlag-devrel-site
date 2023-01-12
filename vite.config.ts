import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteRadar from 'vite-plugin-radar';
import unocss from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';

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
      ],
    }),
    react(),
    viteRadar({analytics: [{id: 'G-DMTB5F3X2D'}]}),
  ],
});
