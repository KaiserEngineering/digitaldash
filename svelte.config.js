import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: node(),
    files: {
      hooks: 'src/hooks',
      lib: 'src/lib',
    },

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  }
};

export default config;
