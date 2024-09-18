import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    preprocess(vitePreprocess(), {
      postcss: true,

      scss: {
        prependData: '@use "src/variables.scss" as *;',
      },
    }),
  ],

  kit: {
    adapter: adapter(),
    alias: {
      "@/*": "./path/to/lib/*",
      "$components": "./src/components",
      "$lib": "./src/lib",
    },
  },
};

export default config;
