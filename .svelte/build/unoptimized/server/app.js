import * as renderer from '@sveltejs/kit/renderer';
import root from './_app/assets/generated/root.svelte.js';
import { set_paths } from './_app/assets/runtime/internal/singletons.js';
import * as setup from './_app/setup/index.js';

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\" class=\"h-100\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <link rel=\"icon\" href=\"/favicon.ico\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    " + head + "\n\n    <link rel='stylesheet' href='/css/bootstrap.min.css'>\n    <link rel='stylesheet' href='/css/floating-labels.css'>\n\n  </head>\n  <body id=\"svelte\" class=\"d-flex flex-column\">\n    " + body + "\n  </body>\n  <script defer src='/js/bootstrap.min.js'></script>\n</html>\n";

const entry = "entry-c8f50789.js";

set_paths({"base":"","assets":"/."});

// allow paths to be overridden in svelte-kit start
export function init({ paths }) {
	set_paths(paths);
}

init({ paths: {"base":"","assets":"/."} });

const d = decodeURIComponent;
const empty = () => ({});

const components = [
	() => import("./_app/routes/index.svelte.js"),
	() => import("./_app/routes/advanced.svelte.js"),
	() => import("./_app/routes/settings.svelte.js"),
	() => import("./_app/routes/login.svelte.js"),
	() => import("./_app/routes/edit/[slug].svelte.js")
];



const manifest = {
	assets: [{"file":"css/bootstrap.min.css","size":145075,"type":"text/css"},{"file":"css/floating-labels.css","size":1712,"type":"text/css"},{"file":"css/ke.css","size":151,"type":"text/css"},{"file":"favicon.ico","size":15406,"type":"image/vnd.microsoft.icon"},{"file":"images/Alerts/FordWarning.png","size":2315,"type":"image/png"},{"file":"images/Alerts/gauge.png","size":2315,"type":"image/png"},{"file":"images/Alerts/warningBlock.png","size":7013,"type":"image/png"},{"file":"images/Background/BlackBackground.png","size":3868,"type":"image/png"},{"file":"images/Background/CarbonFiber.png","size":223442,"type":"image/png"},{"file":"images/Background/alignment.png","size":9103,"type":"image/png"},{"file":"images/Background/banner1.jpg","size":18600,"type":"image/jpeg"},{"file":"images/Background/bg.jpg","size":58523,"type":"image/jpeg"},{"file":"images/Background/green.jpg","size":95095,"type":"image/jpeg"},{"file":"images/Clock/Gauge.png","size":56425,"type":"image/png"},{"file":"images/Dirt/gauge.png","size":20032,"type":"image/png"},{"file":"images/Dirt/needle.png","size":24328,"type":"image/png"},{"file":"images/Glow/gauge.png","size":46894,"type":"image/png"},{"file":"images/Glow/needle.png","size":1691,"type":"image/png"},{"file":"images/Linear/gauge.png","size":645,"type":"image/png"},{"file":"images/Stock/gauge.png","size":49334,"type":"image/png"},{"file":"images/Stock/needle.png","size":12646,"type":"image/png"},{"file":"images/StockRS/gauge.png","size":51697,"type":"image/png"},{"file":"images/StockRS/needle.png","size":10993,"type":"image/png"},{"file":"images/Stock_orange/gauge.png","size":17507,"type":"image/png"},{"file":"images/Stock_orange/needle.png","size":12646,"type":"image/png"},{"file":"images/logo.png","size":14975,"type":"image/png"},{"file":"js/bootstrap.bundle.js","size":246809,"type":"application/javascript"},{"file":"js/bootstrap.bundle.js.map","size":438468,"type":"application/json"},{"file":"js/bootstrap.bundle.min.js","size":84408,"type":"application/javascript"},{"file":"js/bootstrap.bundle.min.js.map","size":338719,"type":"application/json"},{"file":"js/bootstrap.esm.js","size":144926,"type":"application/javascript"},{"file":"js/bootstrap.esm.js.map","size":282055,"type":"application/json"},{"file":"js/bootstrap.esm.min.js","size":79148,"type":"application/javascript"},{"file":"js/bootstrap.esm.min.js.map","size":221500,"type":"application/json"},{"file":"js/bootstrap.js","size":153916,"type":"application/javascript"},{"file":"js/bootstrap.js.map","size":283267,"type":"application/json"},{"file":"js/bootstrap.min.css.map","size":588906,"type":"application/json"},{"file":"js/bootstrap.min.js","size":63450,"type":"application/javascript"},{"file":"js/bootstrap.min.js.map","size":214935,"type":"application/json"},{"file":"robots.txt","size":67,"type":"text/plain"}],
	layout: () => import("./_app/routes/$layout.svelte.js"),
	error: () => import("./_app/assets/components/error.svelte.js"),
	pages: [
		{
					pattern: /^\/$/,
					params: empty,
					parts: [components[0]],
					css: ["/_app/start-1646ff03.css", "/_app/Slider.svelte-34365e6b.css", "/_app/index.svelte-da4ffcfc.css"],
					js: ["/_app/index.svelte-722d305b.js", "/_app/start-fa4db3b4.js", "/_app/inject_styles-0e3d93cc.js", "/_app/stores-543d5c2a.js", "/_app/Slider.svelte-4447f5c9.js"]
				},
		{
					pattern: /^\/advanced\/?$/,
					params: empty,
					parts: [components[1]],
					css: ["/_app/start-1646ff03.css", "/_app/advanced.svelte-85c94d04.css"],
					js: ["/_app/advanced.svelte-6274d254.js", "/_app/start-fa4db3b4.js", "/_app/inject_styles-0e3d93cc.js", "/_app/stores-543d5c2a.js"]
				},
		{
					pattern: /^\/settings\/?$/,
					params: empty,
					parts: [components[2]],
					css: ["/_app/start-1646ff03.css"],
					js: ["/_app/settings.svelte-3c06eab1.js", "/_app/start-fa4db3b4.js", "/_app/inject_styles-0e3d93cc.js", "/_app/stores-543d5c2a.js"]
				},
		{
					pattern: /^\/login\/?$/,
					params: empty,
					parts: [components[3]],
					css: ["/_app/start-1646ff03.css"],
					js: ["/_app/login.svelte-2b8dd038.js", "/_app/start-fa4db3b4.js", "/_app/inject_styles-0e3d93cc.js"]
				},
		{
					pattern: /^\/edit\/([^/]+?)\/?$/,
					params: (m) => ({ slug: d(m[1])}),
					parts: [components[4]],
					css: ["/_app/start-1646ff03.css", "/_app/Slider.svelte-34365e6b.css", "/_app/[slug].svelte-b13f2ddb.css"],
					js: ["/_app/[slug].svelte-44f11ab5.js", "/_app/start-fa4db3b4.js", "/_app/inject_styles-0e3d93cc.js", "/_app/stores-543d5c2a.js", "/_app/Slider.svelte-4447f5c9.js"]
				}
	],
	endpoints: [
		{ pattern: /^\/api\/config\/?$/, params: empty, load: () => import("./_app/routes/api/config.js") },
		{ pattern: /^\/api\/auth\/?$/, params: empty, load: () => import("./_app/routes/api/auth.js") }
	]
};

export function render(request, {
	paths = {"base":"","assets":"/."},
	local = false,
	only_prerender = false,
	get_static_file
} = {}) {
	return renderer.render(request, {
		paths,
		local,
		template,
		manifest,
		target: "#svelte",
		entry,
		root,
		setup,
		dev: false,
		amp: false,
		only_prerender,
		app_dir: "_app",
		host: null,
		host_header: null,
		get_stack: error => error.stack,
		get_static_file,
		get_amp_css: dep => css_lookup[dep]
	});
}