import * as layout from "../../../src/routes/$layout.svelte";

const components = [
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/advanced.svelte"),
	() => import("../../../src/routes/settings.svelte"),
	() => import("../../../src/routes/login.svelte"),
	() => import("../../../src/routes/edit/[slug].svelte")
];

const d = decodeURIComponent;
const empty = () => ({});

export const pages = [
	{
		// src/routes/index.svelte
		pattern: /^\/$/,
		params: empty,
		parts: [components[0]]
	},

	{
		// src/routes/advanced.svelte
		pattern: /^\/advanced\/?$/,
		params: empty,
		parts: [components[1]]
	},

	{
		// src/routes/settings.svelte
		pattern: /^\/settings\/?$/,
		params: empty,
		parts: [components[2]]
	},

	{
		// src/routes/login.svelte
		pattern: /^\/login\/?$/,
		params: empty,
		parts: [components[3]]
	},

	{
		// src/routes/edit/[slug].svelte
		pattern: /^\/edit\/([^/]+?)\/?$/,
		params: (m) => ({ slug: d(m[1])}),
		parts: [components[4]]
	}
];

export const ignore = [
	/^\/api\/constants\/?$/,
	/^\/api\/config\/?$/,
	/^\/api\/user\/?$/
];

export { layout };