import * as layout from "/_app/routes/$layout.svelte";
export { layout };
export { default as ErrorComponent } from "/_app/assets/components/error.svelte";

export const components = [
	() => import("/_app/routes/index.svelte"),
	() => import("/_app/routes/advanced.svelte"),
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
		// advanced.svelte
		pattern: /^\/advanced\/?$/,
		parts: [
			{ i: 1 }
		]
	},

	{
		// settings.svelte
		pattern: /^\/settings\/?$/,
		parts: [
			{ i: 2 }
		]
	},

	{
		// login.svelte
		pattern: /^\/login\/?$/,
		parts: [
			{ i: 3 }
		]
	},

	{
		// edit/[slug].svelte
		pattern: /^\/edit\/([^/]+?)\/?$/,
		parts: [
			null,
			{ i: 4, params: match => ({ slug: d(match[1]) }) }
		]
	}
])(decodeURIComponent);