import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://tenk-dao.github.io/',
  base: '/smartdeploy-frontend',
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
