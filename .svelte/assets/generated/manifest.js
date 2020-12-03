import * as layout from "/_app/routes/$layout.svelte";
export { layout };
export { default as ErrorComponent } from "/_app/assets/components/error.svelte";

export const components = [
	() => import("/_app/routes/index.svelte"),
	() => import("/_app/routes/settings.svelte"),
	() => import("/_app/routes/login.svelte"),
	() => import("/_app/routes/edit/[slug].svelte")
];

export const routes = (d => [
	{
		// index.svelte
		pattern: /^\/$/,
		parts: [
			{ i: 0 }
		]
	},

	{
		// settings.svelte
		pattern: /^\/settings\/?$/,
		parts: [
			{ i: 1 }
		]
	},

	{
		// login.svelte
		pattern: /^\/login\/?$/,
		parts: [
			{ i: 2 }
		]
	},

	{
		// edit/[slug].svelte
		pattern: /^\/edit\/([^/]+?)\/?$/,
		parts: [
			null,
			{ i: 3, params: match => ({ slug: d(match[1]) }) }
		]
	}
])(decodeURIComponent);