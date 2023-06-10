import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://launch.smartdeploy.dev",
  base: "/",
  vite: {
    build: {
      sourcemap: true,
    },
  },
});
