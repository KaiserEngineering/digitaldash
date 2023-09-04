import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import { resolve } from "path";

/** @type {import('vite').Plugin} */
const viteServerConfig = {
  name: 'add headers',
  configureServer: (server: { middlewares: { use: (arg0: (req: any, res: any, next: any) => void) => void; }; }) => {
    server.middlewares.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", ["GET", "POST"]);
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      next();
    });
  }
};

const config: UserConfig = {
  plugins: [sveltekit(), viteServerConfig],
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
