import {defineConfig} from 'astro/config';
import unocss from '@unocss/astro';

export default defineConfig({
  site: 'https://devrel.codyfactory.eu',
  base: '/',
  output: 'static',
  vite: {server: {strictPort: true}},
  integrations: [unocss({injectReset: false})],
});
