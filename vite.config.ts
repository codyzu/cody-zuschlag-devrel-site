import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteRadar from 'vite-plugin-radar';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteRadar({analytics: [{id: 'G-DMTB5F3X2D'}]})],
});
