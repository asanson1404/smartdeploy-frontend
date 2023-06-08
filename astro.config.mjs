import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://smartdeploy.dev',
  base: '/launch',
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
