import './advanced.svelte.css.proxy.js';
/* src/routes/advanced.svelte generated by Svelte v3.32.3 */
import { create_ssr_component, set_store_value, subscribe } from "../../_snowpack/pkg/svelte/internal.js";

import { session } from "../assets/runtime/app/stores.js";

const css = {
	code: "textarea.svelte-rfhj3t{width:100%;height:500px}",
	map: "{\"version\":3,\"file\":\"advanced.svelte\",\"sources\":[\"advanced.svelte\"],\"sourcesContent\":[\"<script>\\n  import { session } from \\\"$app/stores\\\";\\n\\n  let configString = JSON.stringify( $session.configuration, null, 2 );\\n\\n  function submit() {\\n    fetch(\\\"/api/config\\\", {\\n        method : \\\"POST\\\",\\n        body   : configString\\n      })\\n      .then(d => d.json())\\n      .then(d => {\\n        $session.configuration = d.config;\\n        $session.actions = [{\\n          id    : $session.count,\\n          msg   : d.message,\\n          theme : d.ret ? 'alert-info' : 'alert-danger',\\n        }, ...$session.actions];\\n      });\\n  }\\n\\n  let invalid = false;\\n  $: {\\n    try {\\n        JSON.parse( configString );\\n        invalid = false;\\n    }\\n    catch ( e ) {\\n        invalid = true;\\n    }\\n  }\\n</script>\\n\\n<div class=\\\"col-12 pr-4 pl-4 advanced\\\">\\n\\n  {#if invalid}\\n    <div class=\\\"alert alert-danger\\\">\\n      Invalid JSON\\n    </div>\\n  {/if}\\n\\n  <textarea class=\\\"form-control\\\" bind:value=\\\"{configString}\\\"></textarea>\\n  <button disabled={invalid} class=\\\"mt-2 form-control\\\" type=\\\"submit\\\" on:click=\\\"{submit}\\\">Save</button>\\n</div>\\n\\n<style>\\n  textarea {\\n    width: 100%;\\n    height: 500px;\\n  }\\n</style>\\n\"],\"names\":[],\"mappings\":\"AA8CE,QAAQ,cAAC,CAAC,AACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,KAAK,AACf,CAAC\"}"
};

const Advanced = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $session, $$unsubscribe_session;
	$$unsubscribe_session = subscribe(session, value => $session = value);
	let configString = JSON.stringify($session.configuration, null, 2);

	function submit() {
		fetch("/api/config", { method: "POST", body: configString }).then(d => d.json()).then(d => {
			set_store_value(session, $session.configuration = d.config, $session);

			set_store_value(
				session,
				$session.actions = [
					{
						id: $session.count,
						msg: d.message,
						theme: d.ret ? "alert-info" : "alert-danger"
					},
					...$session.actions
				],
				$session
			);
		});
	}

	let invalid = false;
	$$result.css.add(css);

	$: {
		{
			try {
				JSON.parse(configString);
				invalid = false;
			} catch(e) {
				invalid = true;
			}
		}
	}

	$$unsubscribe_session();

	return `<div class="${"col-12 pr-4 pl-4 advanced"}">${invalid
	? `<div class="${"alert alert-danger"}">Invalid JSON
    </div>`
	: ``}

  <textarea class="${"form-control svelte-rfhj3t"}">${configString || ""}</textarea>
  <button ${invalid ? "disabled" : ""} class="${"mt-2 form-control"}" type="${"submit"}">Save</button>
</div>`;
});

export default Advanced;
//# sourceMappingURL=advanced.svelte.js.map
