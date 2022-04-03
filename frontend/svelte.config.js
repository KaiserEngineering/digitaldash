import preprocess from "svelte-preprocess";
import node from "@sveltejs/adapter-node";
import { resolve } from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: node(),
    files: {
      hooks: "src/hooks",
      lib: "src/lib",
      routes: "src/routes",
    },
    vite: {
      resolve: {
        alias: {
          $components: resolve("./src/components"),
        },
      },
    },
  },
};

export default config;
