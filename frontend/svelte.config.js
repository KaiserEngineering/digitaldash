import preprocess from "svelte-preprocess";
import node from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: node(),
  },
};

export default config;
