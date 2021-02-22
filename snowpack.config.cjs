const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));

// Consult https://www.snowpack.dev to learn about these options
module.exports = {
	extends: '@sveltejs/snowpack-config',
	plugins: ['@snowpack/plugin-typescript'],
	mount: {
		'src/components': '/_components'
	},
	alias: {
		$components: './src/components'
	},
  packageOptions: {
    // always include Svelte in your project
    knownEntrypoints: ['svelte'],
    // ignore `import fs from 'fs'` etc
    external: [...require('module').builtinModules, ...Object.keys(pkg.dependencies || {})]
},
};
