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

export const routes = [
	// src/routes/index.svelte
[/^\/$/, [components[0]]],

// src/routes/advanced.svelte
[/^\/advanced\/?$/, [components[1]]],

// src/routes/settings.svelte
[/^\/settings\/?$/, [components[2]]],

// src/routes/login.svelte
[/^\/login\/?$/, [components[3]]],

// src/routes/edit/[slug].svelte
[/^\/edit\/([^/]+?)\/?$/, [components[4]], (m) => ({ slug: d(m[1])})],

// src/routes/api/constants.ts
[/^\/api\/constants\/?$/],

// src/routes/api/config.ts
[/^\/api\/config\/?$/],

// src/routes/api/user.ts
[/^\/api\/user\/?$/]
];

export { layout };