import * as layout from "/_app/routes/$layout.svelte.js";

const components = [
	() => import("/_app/routes/index.svelte.js"),
	() => import("/_app/routes/advanced.svelte.js"),
	() => import("/_app/routes/settings.svelte.js"),
	() => import("/_app/routes/login.svelte.js"),
	() => import("/_app/routes/edit/[slug].svelte.js")
];

const d = decodeURIComponent;
const empty = () => ({});

export const pages = [
	{
		// index.svelte
		pattern: /^\/$/,
		params: empty,
		parts: [components[0]]
	},

	{
		// advanced.svelte
		pattern: /^\/advanced\/?$/,
		params: empty,
		parts: [components[1]]
	},

	{
		// settings.svelte
		pattern: /^\/settings\/?$/,
		params: empty,
		parts: [components[2]]
	},

	{
		// login.svelte
		pattern: /^\/login\/?$/,
		params: empty,
		parts: [components[3]]
	},

	{
		// edit/[slug].svelte
		pattern: /^\/edit\/([^/]+?)\/?$/,
		params: (m) => ({ slug: d(m[1])}),
		parts: [components[4]]
	}
];

export const ignore = [
	/^\/api\/config\/?$/,
	/^\/api\/auth\/?$/
];

export { layout };