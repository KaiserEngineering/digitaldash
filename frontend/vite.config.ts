import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import { resolve } from "path";

const config: UserConfig = {
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;'
      }
    }
  },
  resolve: {
    alias: {
      $components: resolve("./src/components"),
    },
    server: {
      fs: {
        strict: false,
        allow: ['..']
      }
    }
  },
};


export default config;
