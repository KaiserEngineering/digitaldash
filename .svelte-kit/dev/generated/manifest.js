const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/advanced.svelte"),
	() => import("../../../src/routes/settings.svelte"),
	() => import("../../../src/routes/debug/index.svelte"),
	() => import("../../../src/routes/login.svelte"),
	() => import("../../../src/routes/edit/[slug].svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/advanced.svelte
	[/^\/advanced\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/settings.svelte
	[/^\/settings\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/debug/index.svelte
	[/^\/debug\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/edit/[slug].svelte
	[/^\/edit\/([^/]+?)\/?$/, [c[0], c[7]], [c[1]], (m) => ({ slug: d(m[1])})],

	// src/routes/api/config.ts
	[/^\/api\/config\/?$/],

	// src/routes/api/user.ts
	[/^\/api\/user\/?$/]
];

export const fallback = [c[0](), c[1]()];