/* src/routes/settings.svelte generated by Svelte v3.32.3 */
import {
	add_attribute,
	create_ssr_component,
	set_store_value,
	subscribe
} from "../../_snowpack/pkg/svelte/internal.js";

import { session } from "../assets/runtime/app/stores.js";

const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $session, $$unsubscribe_session;
	$$unsubscribe_session = subscribe(session, value => $session = value);
	let username;
	let password;

	function handleSubmit(event) {
		fetch("/api/auth", {
			method: "PUT",
			body: JSON.stringify({ username, password })
		}).then(d => d.json()).then(d => {
			set_store_value(
				session,
				$session.actions = [
					{
						id: $session.count,
						msg: d.message,
						theme: d.ret ? "alert-info" : "alert-warning"
					},
					...$session.actions
				],
				$session
			);
		});
	}

	$$unsubscribe_session();

	return `<form><div class="${"p-4 col-md-12 order-md-1"}"><div class="${"row"}"><div class="${"col-md-6 mb-3"}"><label for="${"username"}">Username</label>
          <input type="${"text"}" class="${"form-control"}" name="${"username"}" required${add_attribute("value", username, 1)}>
          <div class="${"invalid-feedback"}">Username is required
          </div></div>

        <div class="${"col-md-6 mb-3"}"><label for="${"password"}">Password</label>
          <input type="${"password"}" class="${"form-control"}" name="${"password"}" required${add_attribute("value", password, 1)}>
          <div class="${"invalid-feedback"}">Password is required
          </div></div></div>

    <button class="${"btn btn-lg btn-primary btn-block"}" type="${"submit"}">Update settings</button></div></form>`;
});

export default Settings;
//# sourceMappingURL=settings.svelte.js.map
