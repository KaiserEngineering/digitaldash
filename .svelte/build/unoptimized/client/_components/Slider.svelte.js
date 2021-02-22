import './Slider.svelte.css.proxy.js';
/* src/components/Slider.svelte generated by Svelte v3.32.3 */
import {
	SvelteComponent,
	append,
	attr,
	children,
	claim_element,
	claim_space,
	detach,
	element,
	init,
	insert,
	listen,
	noop,
	run_all,
	safe_not_equal,
	space
} from "../_snowpack/pkg/svelte/internal.js";

function create_fragment(ctx) {
	let label;
	let input;
	let t;
	let span;
	let mounted;
	let dispose;

	return {
		c() {
			label = element("label");
			input = element("input");
			t = space();
			span = element("span");
			this.h();
		},
		l(nodes) {
			label = claim_element(nodes, "LABEL", { class: true });
			var label_nodes = children(label);
			input = claim_element(label_nodes, "INPUT", { type: true, class: true });
			t = claim_space(label_nodes);
			span = claim_element(label_nodes, "SPAN", { class: true });
			children(span).forEach(detach);
			label_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(input, "type", "checkbox");
			attr(input, "class", "svelte-1wgc2n4");
			attr(span, "class", "slider round svelte-1wgc2n4");
			attr(label, "class", "switch svelte-1wgc2n4");
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = /*checked*/ ctx[0];
			append(label, t);
			append(label, span);

			if (!mounted) {
				dispose = [
					listen(input, "click", /*click_handler*/ ctx[3]),
					listen(input, "change", /*input_change_handler*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*checked*/ 1) {
				input.checked = /*checked*/ ctx[0];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(label);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { callback } = $$props;
	let { checked } = $$props;
	let { callbackArgs } = $$props;

	const click_handler = () => {
		callback(callbackArgs);
	};

	function input_change_handler() {
		checked = this.checked;
		$$invalidate(0, checked);
	}

	$$self.$$set = $$props => {
		if ("callback" in $$props) $$invalidate(1, callback = $$props.callback);
		if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
		if ("callbackArgs" in $$props) $$invalidate(2, callbackArgs = $$props.callbackArgs);
	};

	return [checked, callback, callbackArgs, click_handler, input_change_handler];
}

class Slider extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { callback: 1, checked: 0, callbackArgs: 2 });
	}
}

export default Slider;
//# sourceMappingURL=Slider.svelte.js.map
