import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import dts from 'vite-plugin-dts';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      rollupTypes : true
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TrafficUIKit',
      fileName: format => `traffic-ui-kit.${format}.js`,
    },
    rollupOptions: {
      input: ['src/index.ts'],
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    outDir: './dist',
    cssCodeSplit: true,
    sourcemap: true
  },
});
