
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.29.4 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(10, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(9, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(8, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 256) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 1536) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [routes, location, base, basepath, url, $$scope, slots];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.29.4 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 2,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[1],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 530) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[1],
    		/*routeProps*/ ctx[2]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 22)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 2 && get_spread_object(/*routeParams*/ ctx[1]),
    					dirty & /*routeProps*/ 4 && get_spread_object(/*routeProps*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(3, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(1, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(2, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 8) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(1, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(2, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.29.4 */
    const file = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	const writable_props = ["to", "replace", "state", "getProps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("$$scope" in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(12, isPartiallyCurrent = $$props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(13, isCurrent = $$props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$props.ariaCurrent);
    	};

    	let ariaCurrent;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16448) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 32769) {
    			 $$invalidate(12, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 32769) {
    			 $$invalidate(13, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 8192) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 45569) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { to: 6, replace: 7, state: 8, getProps: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Notifications.svelte generated by Svelte v3.29.4 */

    const file$1 = "src/components/Notifications.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (1:0) {#if actions.length}
    function create_if_block$1(ctx) {
    	let div;
    	let each_value = /*actions*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "notifications alert alert-info svelte-ecg7g8");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$1, 1, 2, 23);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*actions*/ 1) {
    				each_value = /*actions*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(1:0) {#if actions.length}",
    		ctx
    	});

    	return block;
    }

    // (3:4) {#each actions as action}
    function create_each_block(ctx) {
    	let t_value = /*action*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*actions*/ 1 && t_value !== (t_value = /*action*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(3:4) {#each actions as action}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*actions*/ ctx[0].length && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*actions*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Notifications", slots, []);
    	let { actions } = $$props;
    	const writable_props = ["actions"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Notifications> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	$$self.$capture_state = () => ({ actions });

    	$$self.$inject_state = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [actions];
    }

    class Notifications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { actions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifications",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*actions*/ ctx[0] === undefined && !("actions" in props)) {
    			console.warn("<Notifications> was created without expected prop 'actions'");
    		}
    	}

    	get actions() {
    		throw new Error("<Notifications>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actions(value) {
    		throw new Error("<Notifications>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Home.svelte generated by Svelte v3.29.4 */

    const { Error: Error_1, Object: Object_1 } = globals;
    const file$2 = "src/pages/Home.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (40:4) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[11].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "color", "red");
    			add_location(p, file$2, 40, 4, 1315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(40:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (5:2) {:then}
    function create_then_block(ctx) {
    	let t;
    	let div;
    	let link;
    	let current;
    	let each_value = Object.keys(/*configurations*/ ctx[1].views);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	link = new Link({
    			props: {
    				to: "/edit/new",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div = element("div");
    			create_component(link.$$.fragment);
    			attr_dev(div, "class", "text-center container col-sm-10 col-md-6 pr-4 pl-4");
    			add_location(div, file$2, 33, 4, 1126);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(link, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*configurations, Object, ToggleEnabled*/ 10) {
    				each_value = Object.keys(/*configurations*/ ctx[1].views);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(5:2) {:then}",
    		ctx
    	});

    	return block;
    }

    // (9:8) <Link to="/edit/{id}">
    function create_default_slot_1(ctx) {
    	let h5;
    	let t0_value = /*configurations*/ ctx[1].views[/*id*/ ctx[5]].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div0;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div0 = element("div");
    			img1 = element("img");
    			add_location(h5, file$2, 9, 10, 234);
    			attr_dev(img0, "class", "card-img-top");
    			if (img0.src !== (img0_src_value = "images/" + /*configurations*/ ctx[1].views[/*id*/ ctx[5]].background)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "view background");
    			add_location(img0, file$2, 11, 12, 326);
    			if (img1.src !== (img1_src_value = "images/" + /*configurations*/ ctx[1].views[/*id*/ ctx[5]].theme + ".png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "card-img-top");
    			attr_dev(img1, "alt", "...");
    			add_location(img1, file$2, 14, 14, 484);
    			attr_dev(div0, "class", "card-img-overlay");
    			add_location(div0, file$2, 13, 12, 439);
    			attr_dev(div1, "class", "card img-fluid");
    			add_location(div1, file$2, 10, 10, 285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img0);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*configurations*/ 2 && t0_value !== (t0_value = /*configurations*/ ctx[1].views[/*id*/ ctx[5]].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*configurations*/ 2 && img0.src !== (img0_src_value = "images/" + /*configurations*/ ctx[1].views[/*id*/ ctx[5]].background)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*configurations*/ 2 && img1.src !== (img1_src_value = "images/" + /*configurations*/ ctx[1].views[/*id*/ ctx[5]].theme + ".png")) {
    				attr_dev(img1, "src", img1_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(9:8) <Link to=\\\"/edit/{id}\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:12) {#each configurations.views[id].gauges as gauge}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*gauge*/ ctx[8].pid + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "text-center d-inline-block mr-2");
    			add_location(span, file$2, 26, 12, 995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*configurations*/ 2 && t_value !== (t_value = /*gauge*/ ctx[8].pid + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(26:12) {#each configurations.views[id].gauges as gauge}",
    		ctx
    	});

    	return block;
    }

    // (6:4) {#each Object.keys(configurations.views) as id }
    function create_each_block$1(ctx) {
    	let div1;
    	let link;
    	let t0;
    	let div0;
    	let label;
    	let input;
    	let input_checked_value;
    	let t1;
    	let span;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				to: "/edit/" + /*id*/ ctx[5],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*configurations*/ ctx[1].views[/*id*/ ctx[5]].gauges;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			label = element("label");
    			input = element("input");
    			t1 = space();
    			span = element("span");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "checkbox");

    			input.checked = input_checked_value = /*configurations*/ ctx[1].views[/*id*/ ctx[5]].enabled
    			? "checked"
    			: "";

    			add_location(input, file$2, 21, 12, 739);
    			attr_dev(span, "class", "slider round");
    			add_location(span, file$2, 22, 12, 867);
    			attr_dev(label, "class", "switch d-inline-block float-left");
    			add_location(label, file$2, 20, 10, 678);
    			attr_dev(div0, "class", "card-body text-center");
    			add_location(div0, file$2, 18, 8, 631);
    			attr_dev(div1, "class", "container col-sm-10 col-md-6 pr-4 pl-4");
    			add_location(div1, file$2, 7, 6, 140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(link, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, input);
    			append_dev(label, t1);
    			append_dev(label, span);
    			append_dev(div0, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					input,
    					"change",
    					function () {
    						if (is_function(/*ToggleEnabled*/ ctx[3](/*id*/ ctx[5]))) /*ToggleEnabled*/ ctx[3](/*id*/ ctx[5]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const link_changes = {};
    			if (dirty & /*configurations*/ 2) link_changes.to = "/edit/" + /*id*/ ctx[5];

    			if (dirty & /*$$scope, configurations*/ 4098) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty & /*configurations*/ 2 && input_checked_value !== (input_checked_value = /*configurations*/ ctx[1].views[/*id*/ ctx[5]].enabled
    			? "checked"
    			: "")) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*configurations, Object*/ 2) {
    				each_value_1 = /*configurations*/ ctx[1].views[/*id*/ ctx[5]].gauges;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(link);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(6:4) {#each Object.keys(configurations.views) as id }",
    		ctx
    	});

    	return block;
    }

    // (35:6) <Link to='/edit/new'>
    function create_default_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "+";
    			attr_dev(span, "class", "plus bg-primary svelte-bdkpct");
    			add_location(span, file$2, 35, 8, 1227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(35:6) <Link to='/edit/new'>",
    		ctx
    	});

    	return block;
    }

    // (3:16)    <p>...waiting</p>   {:then}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "...waiting";
    			add_location(p, file$2, 3, 2, 48);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(3:16)    <p>...waiting</p>   {:then}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let notifications;
    	let t;
    	let await_block_anchor;
    	let promise_1;
    	let current;

    	notifications = new Notifications({
    			props: { actions: /*actions*/ ctx[0] },
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		error: 11,
    		blocks: [,,,]
    	};

    	handle_promise(promise_1 = /*promise*/ ctx[2], info);

    	const block = {
    		c: function create() {
    			create_component(notifications.$$.fragment);
    			t = space();
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notifications, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const notifications_changes = {};
    			if (dirty & /*actions*/ 1) notifications_changes.actions = /*actions*/ ctx[0];
    			notifications.$set(notifications_changes);

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[11] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notifications, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let { actions = [] } = $$props;
    	let configurations = {};

    	async function getConfigs() {
    		const res = await fetch("/api/config", { method: "get" });
    		const data = await res.json();

    		if (res.ok) {
    			$$invalidate(1, configurations = data);
    			return data;
    		} else {
    			throw new Error(data);
    		}
    	}

    	let promise = getConfigs();

    	function ToggleEnabled(id) {
    		fetch("/api/toggle_enabled", {
    			method: "post",
    			body: JSON.stringify({ id })
    		}).then(d => d.json()).then(d => {
    			$$invalidate(1, configurations.views = d.views, configurations);
    			$$invalidate(0, actions = [d.message]);
    		});
    	}

    	const writable_props = ["actions"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	$$self.$capture_state = () => ({
    		Notifications,
    		Link,
    		actions,
    		configurations,
    		getConfigs,
    		promise,
    		ToggleEnabled
    	});

    	$$self.$inject_state = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    		if ("configurations" in $$props) $$invalidate(1, configurations = $$props.configurations);
    		if ("promise" in $$props) $$invalidate(2, promise = $$props.promise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [actions, configurations, promise, ToggleEnabled];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { actions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get actions() {
    		throw new Error_1("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actions(value) {
    		throw new Error_1("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Settings.svelte generated by Svelte v3.29.4 */
    const file$3 = "src/pages/Settings.svelte";

    function create_fragment$5(ctx) {
    	let notifications;
    	let t0;
    	let form;
    	let div5;
    	let div4;
    	let div1;
    	let label0;
    	let t2;
    	let input0;
    	let t3;
    	let div0;
    	let t5;
    	let div3;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let div2;
    	let t10;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	notifications = new Notifications({
    			props: { actions: /*actions*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notifications.$$.fragment);
    			t0 = space();
    			form = element("form");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div0 = element("div");
    			div0.textContent = "Username is required";
    			t5 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			div2.textContent = "Password is required";
    			t10 = space();
    			button = element("button");
    			button.textContent = "Update settings";
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$3, 6, 10, 189);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "name", "username");
    			input0.required = true;
    			add_location(input0, file$3, 7, 10, 238);
    			attr_dev(div0, "class", "invalid-feedback");
    			add_location(div0, file$3, 8, 10, 336);
    			attr_dev(div1, "class", "col-md-6 mb-3");
    			add_location(div1, file$3, 5, 8, 151);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$3, 14, 10, 479);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$3, 15, 10, 528);
    			attr_dev(div2, "class", "invalid-feedback");
    			add_location(div2, file$3, 16, 10, 630);
    			attr_dev(div3, "class", "col-md-6 mb-3");
    			add_location(div3, file$3, 13, 8, 441);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$3, 4, 6, 125);
    			attr_dev(button, "class", "btn btn-lg btn-primary btn-block");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$3, 22, 4, 744);
    			attr_dev(div5, "class", "p-4 col-md-12 order-md-1");
    			add_location(div5, file$3, 3, 2, 80);
    			add_location(form, file$3, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notifications, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t2);
    			append_dev(div1, input0);
    			set_input_value(input0, /*username*/ ctx[1]);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t7);
    			append_dev(div3, input1);
    			set_input_value(input1, /*password*/ ctx[2]);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div5, t10);
    			append_dev(div5, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const notifications_changes = {};
    			if (dirty & /*actions*/ 1) notifications_changes.actions = /*actions*/ ctx[0];
    			notifications.$set(notifications_changes);

    			if (dirty & /*username*/ 2 && input0.value !== /*username*/ ctx[1]) {
    				set_input_value(input0, /*username*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				set_input_value(input1, /*password*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notifications, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Settings", slots, []);
    	let { actions = [] } = $$props;
    	let username;
    	let password;

    	function handleSubmit(event) {
    		fetch("/api/settings", {
    			method: "POST",
    			body: JSON.stringify({ username, password })
    		}).then(d => d.json()).then(d => $$invalidate(0, actions = [d.message]));
    	}

    	const writable_props = ["actions"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(1, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	$$self.$$set = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	$$self.$capture_state = () => ({
    		Notifications,
    		actions,
    		username,
    		password,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    		if ("username" in $$props) $$invalidate(1, username = $$props.username);
    		if ("password" in $$props) $$invalidate(2, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		actions,
    		username,
    		password,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { actions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get actions() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actions(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Edit.svelte generated by Svelte v3.29.4 */

    const { Error: Error_1$1, Object: Object_1$1, console: console_1 } = globals;
    const file$4 = "src/pages/Edit.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	child_ctx[37] = list;
    	child_ctx[38] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[43] = list[i];
    	child_ctx[44] = list;
    	child_ctx[45] = i;
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[48] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[51] = list[i];
    	return child_ctx;
    }

    // (1:0) <Notifications {actions}
    function create_catch_block$1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <Notifications {actions}",
    		ctx
    	});

    	return block;
    }

    // (5:2) {:then}
    function create_then_block$1(ctx) {
    	let div23;
    	let div22;
    	let t0;
    	let form;
    	let input0;
    	let t1;
    	let div0;
    	let h40;
    	let t3;
    	let hr0;
    	let t4;
    	let div3;
    	let div2;
    	let label0;
    	let t6;
    	let input1;
    	let t7;
    	let div1;
    	let t9;
    	let div10;
    	let div6;
    	let label1;
    	let t11;
    	let div5;
    	let select0;
    	let option0;
    	let t13;
    	let div4;
    	let t15;
    	let div9;
    	let label2;
    	let t17;
    	let div8;
    	let select1;
    	let option1;
    	let t19;
    	let div7;
    	let t21;
    	let div11;
    	let t23;
    	let div12;
    	let t24;
    	let div14;
    	let h41;
    	let t26;
    	let t27;
    	let div13;
    	let button0;
    	let t29;
    	let div15;
    	let h42;
    	let t31;
    	let hr1;
    	let t32;
    	let div21;
    	let div16;
    	let label3;
    	let t34;
    	let select2;
    	let option2;
    	let select2_name_value;
    	let t36;
    	let div17;
    	let label4;
    	let t38;
    	let input2;
    	let t39;
    	let div18;
    	let label5;
    	let t41;
    	let select3;
    	let option3;
    	let t43;
    	let div19;
    	let label6;
    	let t45;
    	let input3;
    	let t46;
    	let div20;
    	let label7;
    	let t48;
    	let input4;
    	let t49;
    	let hr2;
    	let t50;
    	let button1;
    	let t51_value = (/*id*/ ctx[1] == "new" ? "Create" : "Update") + "";
    	let t51;
    	let t52;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*id*/ ctx[1] == "new") return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let each_value_8 = ["banner1.jpg", "bg.jpg", "BlackBackground.png", "CarbonFiber.png"];
    	validate_each_argument(each_value_8);
    	let each_blocks_5 = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks_5[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	let each_value_7 = ["Stock"];
    	validate_each_argument(each_value_7);
    	let each_blocks_4 = [];

    	for (let i = 0; i < 1; i += 1) {
    		each_blocks_4[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	let each_value_5 = Array(3);
    	validate_each_argument(each_value_5);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_3[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_2 = /*alerts*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*pids*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = ["=", ">", "<", ">=", "<="];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 5; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block1 = /*id*/ ctx[1] != "new" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div23 = element("div");
    			div22 = element("div");
    			if_block0.c();
    			t0 = space();
    			form = element("form");
    			input0 = element("input");
    			t1 = space();
    			div0 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Basics";
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "View name";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div1 = element("div");
    			div1.textContent = "View name is required";
    			t9 = space();
    			div10 = element("div");
    			div6 = element("div");
    			label1 = element("label");
    			label1.textContent = "Background";
    			t11 = space();
    			div5 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "-";

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks_5[i].c();
    			}

    			t13 = space();
    			div4 = element("div");
    			div4.textContent = "Background is required";
    			t15 = space();
    			div9 = element("div");
    			label2 = element("label");
    			label2.textContent = "Theme";
    			t17 = space();
    			div8 = element("div");
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "-";

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t19 = space();
    			div7 = element("div");
    			div7.textContent = "Theme is required";
    			t21 = space();
    			div11 = element("div");
    			div11.textContent = "Vehicle Parameters";
    			t23 = space();
    			div12 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t24 = space();
    			div14 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Alerts";
    			t26 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t27 = space();
    			div13 = element("div");
    			button0 = element("button");
    			button0.textContent = "New alert";
    			t29 = space();
    			div15 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Dynamic";
    			t31 = space();
    			hr1 = element("hr");
    			t32 = space();
    			div21 = element("div");
    			div16 = element("div");
    			label3 = element("label");
    			label3.textContent = "PID";
    			t34 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "-";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t36 = space();
    			div17 = element("div");
    			label4 = element("label");
    			label4.textContent = "Value";
    			t38 = space();
    			input2 = element("input");
    			t39 = space();
    			div18 = element("div");
    			label5 = element("label");
    			label5.textContent = "OP";
    			t41 = space();
    			select3 = element("select");
    			option3 = element("option");
    			option3.textContent = "-";

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].c();
    			}

    			t43 = space();
    			div19 = element("div");
    			label6 = element("label");
    			label6.textContent = "Priority";
    			t45 = space();
    			input3 = element("input");
    			t46 = space();
    			div20 = element("div");
    			label7 = element("label");
    			label7.textContent = "Unit";
    			t48 = space();
    			input4 = element("input");
    			t49 = space();
    			hr2 = element("hr");
    			t50 = space();
    			button1 = element("button");
    			t51 = text(t51_value);
    			t52 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(input0, "type", "hidden");
    			input0.value = "<%$id%>";
    			attr_dev(input0, "name", "id");
    			add_location(input0, file$4, 13, 8, 397);
    			add_location(h40, file$4, 16, 10, 486);
    			add_location(hr0, file$4, 17, 10, 512);
    			attr_dev(div0, "class", "col-12");
    			add_location(div0, file$4, 15, 8, 455);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$4, 22, 12, 610);
    			attr_dev(input1, "name", "name");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "placeholder", "");
    			input1.required = true;
    			add_location(input1, file$4, 23, 12, 658);
    			attr_dev(div1, "class", "invalid-feedback");
    			add_location(div1, file$4, 24, 12, 780);
    			attr_dev(div2, "class", "col-md-6 mb-3");
    			add_location(div2, file$4, 21, 10, 570);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$4, 20, 8, 542);
    			attr_dev(label1, "for", "background");
    			add_location(label1, file$4, 32, 12, 972);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$4, 35, 16, 1197);
    			attr_dev(select0, "name", "background");
    			attr_dev(select0, "class", "custom-select form-control d-block w-100");
    			select0.required = true;
    			if (/*view*/ ctx[2].background === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[13].call(select0));
    			add_location(select0, file$4, 34, 14, 1067);
    			attr_dev(div4, "class", "invalid-feedback");
    			set_style(div4, "width", "100%");
    			add_location(div4, file$4, 40, 14, 1458);
    			attr_dev(div5, "class", "input-group");
    			add_location(div5, file$4, 33, 12, 1027);
    			attr_dev(div6, "class", "col-6");
    			add_location(div6, file$4, 31, 10, 940);
    			attr_dev(label2, "for", "theme");
    			add_location(label2, file$4, 46, 12, 1648);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$4, 49, 16, 1864);
    			attr_dev(select1, "name", "theme");
    			attr_dev(select1, "class", "form-control custom-select d-block w-100");
    			attr_dev(select1, "id", "theme");
    			select1.required = true;
    			if (/*view*/ ctx[2].theme === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
    			add_location(select1, file$4, 48, 14, 1733);
    			attr_dev(div7, "class", "invalid-feedback");
    			set_style(div7, "width", "100%");
    			add_location(div7, file$4, 54, 14, 2052);
    			attr_dev(div8, "class", "input-group");
    			add_location(div8, file$4, 47, 12, 1693);
    			attr_dev(div9, "class", "col-6");
    			add_location(div9, file$4, 45, 10, 1616);
    			attr_dev(div10, "class", "mb-3 row");
    			add_location(div10, file$4, 30, 8, 907);
    			attr_dev(div11, "class", "col-12");
    			add_location(div11, file$4, 61, 8, 2219);
    			attr_dev(div12, "class", "mb-3 row");
    			add_location(div12, file$4, 65, 8, 2293);
    			add_location(h41, file$4, 83, 10, 2976);
    			attr_dev(button0, "class", "form-control");
    			add_location(button0, file$4, 139, 12, 5262);
    			attr_dev(div13, "class", "col-md-1 col-auto");
    			add_location(div13, file$4, 138, 10, 5218);
    			attr_dev(div14, "class", "mt-3 col-12");
    			add_location(div14, file$4, 82, 8, 2940);
    			add_location(h42, file$4, 144, 10, 5407);
    			add_location(hr1, file$4, 145, 10, 5434);
    			attr_dev(div15, "class", "mt-3 col-12");
    			add_location(div15, file$4, 143, 8, 5371);
    			attr_dev(label3, "for", "dynamicPID");
    			add_location(label3, file$4, 151, 12, 5543);
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$4, 154, 14, 5731);
    			attr_dev(select2, "name", select2_name_value = "pid" + /*id*/ ctx[1]);
    			attr_dev(select2, "class", "form-control custom-select");
    			attr_dev(select2, "id", "dynamicPID");
    			if (/*dynamic*/ ctx[6].pid === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[23].call(select2));
    			add_location(select2, file$4, 153, 12, 5592);
    			attr_dev(div16, "class", "col-md-auto col-12");
    			add_location(div16, file$4, 150, 10, 5498);
    			attr_dev(label4, "for", "dynamicValue");
    			add_location(label4, file$4, 164, 12, 6052);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "dynamicValue");
    			add_location(input2, file$4, 165, 12, 6104);
    			attr_dev(div17, "class", "col-md-auto col-12");
    			add_location(div17, file$4, 163, 10, 6007);
    			attr_dev(label5, "for", "dynamicOP");
    			add_location(label5, file$4, 169, 12, 6266);
    			option3.__value = "";
    			option3.value = option3.__value;
    			add_location(option3, file$4, 171, 14, 6411);
    			attr_dev(select3, "name", "dynamicOP");
    			attr_dev(select3, "class", "form-control custom-select");
    			if (/*dynamic*/ ctx[6].op === void 0) add_render_callback(() => /*select3_change_handler*/ ctx[25].call(select3));
    			add_location(select3, file$4, 170, 12, 6312);
    			attr_dev(div18, "class", "col-md-auto col-12");
    			add_location(div18, file$4, 168, 10, 6221);
    			attr_dev(label6, "for", "dynamicPriority");
    			add_location(label6, file$4, 181, 12, 6691);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "name", "dynamicPriority");
    			add_location(input3, file$4, 182, 12, 6749);
    			attr_dev(div19, "class", "col-md-auto col-12");
    			add_location(div19, file$4, 180, 10, 6646);
    			attr_dev(label7, "for", "dynamicUnit");
    			add_location(label7, file$4, 186, 12, 6919);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", "dynamicUnit");
    			add_location(input4, file$4, 187, 12, 6969);
    			attr_dev(div20, "class", "col-md-auto col-12");
    			add_location(div20, file$4, 185, 10, 6874);
    			attr_dev(div21, "class", "mb-3 row");
    			add_location(div21, file$4, 148, 8, 5464);
    			attr_dev(hr2, "class", "mb-4");
    			add_location(hr2, file$4, 191, 8, 7097);
    			attr_dev(button1, "class", "btn btn-primary btn-lg btn-block");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$4, 192, 8, 7123);
    			attr_dev(form, "class", "needs-validation");
    			add_location(form, file$4, 12, 6, 315);
    			attr_dev(div22, "class", "col-md-12 order-md-1");
    			add_location(div22, file$4, 6, 4, 131);
    			attr_dev(div23, "id", "edit-container");
    			attr_dev(div23, "class", "container mb-4");
    			add_location(div23, file$4, 5, 2, 78);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div22);
    			if_block0.m(div22, null);
    			append_dev(div22, t0);
    			append_dev(div22, form);
    			append_dev(form, input0);
    			append_dev(form, t1);
    			append_dev(form, div0);
    			append_dev(div0, h40);
    			append_dev(div0, t3);
    			append_dev(div0, hr0);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t6);
    			append_dev(div2, input1);
    			set_input_value(input1, /*view*/ ctx[2].name);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(form, t9);
    			append_dev(form, div10);
    			append_dev(div10, div6);
    			append_dev(div6, label1);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks_5[i].m(select0, null);
    			}

    			select_option(select0, /*view*/ ctx[2].background);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(div10, t15);
    			append_dev(div10, div9);
    			append_dev(div9, label2);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks_4[i].m(select1, null);
    			}

    			select_option(select1, /*view*/ ctx[2].theme);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(form, t21);
    			append_dev(form, div11);
    			append_dev(form, t23);
    			append_dev(form, div12);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div12, null);
    			}

    			append_dev(form, t24);
    			append_dev(form, div14);
    			append_dev(div14, h41);
    			append_dev(div14, t26);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div14, null);
    			}

    			append_dev(div14, t27);
    			append_dev(div14, div13);
    			append_dev(div13, button0);
    			append_dev(form, t29);
    			append_dev(form, div15);
    			append_dev(div15, h42);
    			append_dev(div15, t31);
    			append_dev(div15, hr1);
    			append_dev(form, t32);
    			append_dev(form, div21);
    			append_dev(div21, div16);
    			append_dev(div16, label3);
    			append_dev(div16, t34);
    			append_dev(div16, select2);
    			append_dev(select2, option2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select2, null);
    			}

    			select_option(select2, /*dynamic*/ ctx[6].pid);
    			append_dev(div21, t36);
    			append_dev(div21, div17);
    			append_dev(div17, label4);
    			append_dev(div17, t38);
    			append_dev(div17, input2);
    			set_input_value(input2, /*dynamic*/ ctx[6].value);
    			append_dev(div21, t39);
    			append_dev(div21, div18);
    			append_dev(div18, label5);
    			append_dev(div18, t41);
    			append_dev(div18, select3);
    			append_dev(select3, option3);

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].m(select3, null);
    			}

    			select_option(select3, /*dynamic*/ ctx[6].op);
    			append_dev(div21, t43);
    			append_dev(div21, div19);
    			append_dev(div19, label6);
    			append_dev(div19, t45);
    			append_dev(div19, input3);
    			set_input_value(input3, /*dynamic*/ ctx[6].priority);
    			append_dev(div21, t46);
    			append_dev(div21, div20);
    			append_dev(div20, label7);
    			append_dev(div20, t48);
    			append_dev(div20, input4);
    			set_input_value(input4, /*dynamic*/ ctx[6].unit);
    			append_dev(form, t49);
    			append_dev(form, hr2);
    			append_dev(form, t50);
    			append_dev(form, button1);
    			append_dev(button1, t51);
    			append_dev(form, t52);
    			if (if_block1) if_block1.m(form, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[13]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
    					listen_dev(button0, "click", /*addAlert*/ ctx[9], false, false, false),
    					listen_dev(select2, "blur", updatePIDCount, false, false, false),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[23]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[24]),
    					listen_dev(select3, "change", /*select3_change_handler*/ ctx[25]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[26]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[27]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div22, t0);
    				}
    			}

    			if (dirty[0] & /*view*/ 4 && input1.value !== /*view*/ ctx[2].name) {
    				set_input_value(input1, /*view*/ ctx[2].name);
    			}

    			if (dirty[0] & /*view*/ 4) {
    				select_option(select0, /*view*/ ctx[2].background);
    			}

    			if (dirty[0] & /*view*/ 4) {
    				select_option(select1, /*view*/ ctx[2].theme);
    			}

    			if (dirty[0] & /*id, view, pids, KE_PID*/ 30) {
    				each_value_5 = Array(3);
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_5(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div12, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_5.length;
    			}

    			if (dirty[0] & /*alerts, id, pids, KE_PID, deleteAlert*/ 1082) {
    				each_value_2 = /*alerts*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div14, t27);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*pids, KE_PID*/ 24) {
    				each_value_1 = /*pids*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*id*/ 2 && select2_name_value !== (select2_name_value = "pid" + /*id*/ ctx[1])) {
    				attr_dev(select2, "name", select2_name_value);
    			}

    			if (dirty[0] & /*dynamic, pids*/ 72) {
    				select_option(select2, /*dynamic*/ ctx[6].pid);
    			}

    			if (dirty[0] & /*dynamic, pids*/ 72 && input2.value !== /*dynamic*/ ctx[6].value) {
    				set_input_value(input2, /*dynamic*/ ctx[6].value);
    			}

    			if (dirty[0] & /*dynamic, pids*/ 72) {
    				select_option(select3, /*dynamic*/ ctx[6].op);
    			}

    			if (dirty[0] & /*dynamic, pids*/ 72 && to_number(input3.value) !== /*dynamic*/ ctx[6].priority) {
    				set_input_value(input3, /*dynamic*/ ctx[6].priority);
    			}

    			if (dirty[0] & /*dynamic, pids*/ 72 && input4.value !== /*dynamic*/ ctx[6].unit) {
    				set_input_value(input4, /*dynamic*/ ctx[6].unit);
    			}

    			if (dirty[0] & /*id*/ 2 && t51_value !== (t51_value = (/*id*/ ctx[1] == "new" ? "Create" : "Update") + "")) set_data_dev(t51, t51_value);

    			if (/*id*/ ctx[1] != "new") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(form, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div23);
    			if_block0.d();
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(5:2) {:then}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {:else}
    function create_else_block$1(ctx) {
    	let h4;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text("Editing view #");
    			t1 = text(/*id*/ ctx[1]);
    			attr_dev(h4, "class", "mb-3");
    			add_location(h4, file$4, 10, 6, 256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*id*/ 2) set_data_dev(t1, /*id*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(10:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:6) {#if id == 'new'}
    function create_if_block_1$1(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Creating new view";
    			attr_dev(h4, "class", "mb-3");
    			add_location(h4, file$4, 8, 6, 196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(8:6) {#if id == 'new'}",
    		ctx
    	});

    	return block;
    }

    // (37:16) {#each ['banner1.jpg', 'bg.jpg', 'BlackBackground.png', 'CarbonFiber.png'] as background}
    function create_each_block_8(ctx) {
    	let option;
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(/*background*/ ctx[51]);
    			option.__value = option_value_value = /*background*/ ctx[51];
    			option.value = option.__value;
    			add_location(option, file$4, 37, 16, 1347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(37:16) {#each ['banner1.jpg', 'bg.jpg', 'BlackBackground.png', 'CarbonFiber.png'] as background}",
    		ctx
    	});

    	return block;
    }

    // (51:16) {#each ['Stock'] as theme}
    function create_each_block_7(ctx) {
    	let option;
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(/*theme*/ ctx[48]);
    			option.__value = option_value_value = /*theme*/ ctx[48];
    			option.value = option.__value;
    			add_location(option, file$4, 51, 16, 1951);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(51:16) {#each ['Stock'] as theme}",
    		ctx
    	});

    	return block;
    }

    // (72:18) {#each pids as pid}
    function create_each_block_6(ctx) {
    	let option;

    	let t0_value = (/*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    	? /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    	: /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].name) + "";

    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*pid*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$4, 72, 18, 2670);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*KE_PID, pids*/ 24 && t0_value !== (t0_value = (/*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    			? /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    			: /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].name) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*pids*/ 8 && option_value_value !== (option_value_value = /*pid*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(72:18) {#each pids as pid}",
    		ctx
    	});

    	return block;
    }

    // (67:10) {#each Array(3) as _, i}
    function create_each_block_5(ctx) {
    	let div1;
    	let div0;
    	let select;
    	let option;
    	let select_name_value;
    	let select_id_value;
    	let t1;
    	let mounted;
    	let dispose;
    	let each_value_6 = /*pids*/ ctx[3];
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[15].call(select, /*i*/ ctx[45]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "-";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$4, 70, 18, 2586);
    			attr_dev(select, "name", select_name_value = "pid" + /*id*/ ctx[1]);
    			attr_dev(select, "class", "form-control custom-select");
    			attr_dev(select, "id", select_id_value = "pid" + /*id*/ ctx[1]);
    			if (/*view*/ ctx[2].gauges[/*i*/ ctx[45]].pid === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$4, 69, 16, 2439);
    			attr_dev(div0, "class", "input-group");
    			add_location(div0, file$4, 68, 14, 2397);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$4, 67, 12, 2363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*view*/ ctx[2].gauges[/*i*/ ctx[45]].pid);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", updatePIDCount, false, false, false),
    					listen_dev(select, "change", select_change_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*pids, KE_PID*/ 24) {
    				each_value_6 = /*pids*/ ctx[3];
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}

    			if (dirty[0] & /*id*/ 2 && select_name_value !== (select_name_value = "pid" + /*id*/ ctx[1])) {
    				attr_dev(select, "name", select_name_value);
    			}

    			if (dirty[0] & /*id*/ 2 && select_id_value !== (select_id_value = "pid" + /*id*/ ctx[1])) {
    				attr_dev(select, "id", select_id_value);
    			}

    			if (dirty[0] & /*view*/ 4) {
    				select_option(select, /*view*/ ctx[2].gauges[/*i*/ ctx[45]].pid);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(67:10) {#each Array(3) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (100:18) {#each pids as pid}
    function create_each_block_4(ctx) {
    	let option;

    	let t0_value = (/*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    	? /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    	: /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].name) + "";

    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*pid*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$4, 100, 18, 3764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*KE_PID, pids*/ 24 && t0_value !== (t0_value = (/*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    			? /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    			: /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].name) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*pids*/ 8 && option_value_value !== (option_value_value = /*pid*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(100:18) {#each pids as pid}",
    		ctx
    	});

    	return block;
    }

    // (117:18) {#each ['=', '>', '<', '>=', '<='] as op}
    function create_each_block_3(ctx) {
    	let option;
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(/*op*/ ctx[30]);
    			t1 = space();
    			option.__value = option_value_value = /*op*/ ctx[30];
    			option.value = option.__value;
    			add_location(option, file$4, 117, 18, 4533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(117:18) {#each ['=', '>', '<', '>=', '<='] as op}",
    		ctx
    	});

    	return block;
    }

    // (86:10) {#each alerts as alert}
    function create_each_block_2(ctx) {
    	let button;
    	let t1;
    	let div6;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let select0;
    	let option0;
    	let select0_name_value;
    	let t8;
    	let div2;
    	let label2;
    	let t10;
    	let input1;
    	let t11;
    	let div3;
    	let label3;
    	let t13;
    	let select1;
    	let option1;
    	let t15;
    	let div4;
    	let label4;
    	let t17;
    	let input2;
    	let t18;
    	let div5;
    	let label5;
    	let t20;
    	let input3;
    	let t21;
    	let hr;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[16](/*alert*/ ctx[36], ...args);
    	}

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[17].call(input0, /*each_value_2*/ ctx[37], /*alert_index*/ ctx[38]);
    	}

    	let each_value_4 = /*pids*/ ctx[3];
    	validate_each_argument(each_value_4);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_1[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	function select0_change_handler_1() {
    		/*select0_change_handler_1*/ ctx[18].call(select0, /*each_value_2*/ ctx[37], /*alert_index*/ ctx[38]);
    	}

    	function input1_input_handler_1() {
    		/*input1_input_handler_1*/ ctx[19].call(input1, /*each_value_2*/ ctx[37], /*alert_index*/ ctx[38]);
    	}

    	let each_value_3 = ["=", ">", "<", ">=", "<="];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < 5; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	function select1_change_handler_1() {
    		/*select1_change_handler_1*/ ctx[20].call(select1, /*each_value_2*/ ctx[37], /*alert_index*/ ctx[38]);
    	}

    	function input2_input_handler() {
    		/*input2_input_handler*/ ctx[21].call(input2, /*each_value_2*/ ctx[37], /*alert_index*/ ctx[38]);
    	}

    	function input3_input_handler() {
    		/*input3_input_handler*/ ctx[22].call(input3, /*each_value_2*/ ctx[37], /*alert_index*/ ctx[38]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete alert";
    			t1 = space();
    			div6 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Message";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "PID";
    			t6 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "-";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t8 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Value";
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "OP";
    			t13 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "-";

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].c();
    			}

    			t15 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Priority";
    			t17 = space();
    			input2 = element("input");
    			t18 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "Unit";
    			t20 = space();
    			input3 = element("input");
    			t21 = space();
    			hr = element("hr");
    			attr_dev(button, "class", "form-control");
    			attr_dev(button, "type", "button");
    			add_location(button, file$4, 86, 12, 3039);
    			attr_dev(label0, "for", "alertMessage");
    			add_location(label0, file$4, 90, 16, 3240);
    			input0.required = true;
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "alertMessage");
    			add_location(input0, file$4, 91, 16, 3298);
    			attr_dev(div0, "class", "col-md-3 col-12");
    			add_location(div0, file$4, 89, 14, 3194);
    			attr_dev(label1, "for", "alertPID");
    			add_location(label1, file$4, 95, 16, 3481);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$4, 98, 18, 3680);
    			attr_dev(select0, "name", select0_name_value = "pid" + /*id*/ ctx[1]);
    			attr_dev(select0, "class", "form-control custom-select");
    			attr_dev(select0, "id", "alertPID");
    			select0.required = true;
    			if (/*alert*/ ctx[36].pid === void 0) add_render_callback(select0_change_handler_1);
    			add_location(select0, file$4, 97, 16, 3532);
    			attr_dev(div1, "class", "col-md-auto col-12");
    			add_location(div1, file$4, 94, 14, 3432);
    			attr_dev(label2, "for", "alertValue");
    			add_location(label2, file$4, 108, 16, 4036);
    			input1.required = true;
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "alertValue");
    			add_location(input1, file$4, 109, 16, 4090);
    			attr_dev(div2, "class", "col-md-3 col-12");
    			add_location(div2, file$4, 107, 14, 3990);
    			attr_dev(label3, "for", "alertOP");
    			add_location(label3, file$4, 113, 16, 4271);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$4, 115, 18, 4427);
    			select1.required = true;
    			attr_dev(select1, "name", "alertOP");
    			attr_dev(select1, "class", "form-control custom-select");
    			if (/*alert*/ ctx[36].op === void 0) add_render_callback(select1_change_handler_1);
    			add_location(select1, file$4, 114, 16, 4319);
    			attr_dev(div3, "class", "col-md-auto col-12");
    			add_location(div3, file$4, 112, 14, 4222);
    			attr_dev(label4, "for", "alertPriority");
    			add_location(label4, file$4, 125, 14, 4742);
    			input2.required = true;
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "name", "alertPriority");
    			add_location(input2, file$4, 126, 14, 4800);
    			attr_dev(div4, "class", "col-md-auto col-12");
    			add_location(div4, file$4, 124, 13, 4695);
    			attr_dev(label5, "for", "alertUnit");
    			add_location(label5, file$4, 130, 14, 4985);
    			input3.required = true;
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "alertUnit");
    			add_location(input3, file$4, 131, 14, 5035);
    			attr_dev(div5, "class", "col-md-auto col-12");
    			add_location(div5, file$4, 129, 13, 4938);
    			attr_dev(div6, "class", "mb-3 row");
    			add_location(div6, file$4, 88, 12, 3157);
    			add_location(hr, file$4, 135, 12, 5181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*alert*/ ctx[36].message);
    			append_dev(div6, t4);
    			append_dev(div6, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*alert*/ ctx[36].pid);
    			append_dev(div6, t8);
    			append_dev(div6, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t10);
    			append_dev(div2, input1);
    			set_input_value(input1, /*alert*/ ctx[36].value);
    			append_dev(div6, t11);
    			append_dev(div6, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t13);
    			append_dev(div3, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*alert*/ ctx[36].op);
    			append_dev(div6, t15);
    			append_dev(div6, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t17);
    			append_dev(div4, input2);
    			set_input_value(input2, /*alert*/ ctx[36].priority);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t20);
    			append_dev(div5, input3);
    			set_input_value(input3, /*alert*/ ctx[36].unit);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, hr, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler, false, false, false),
    					listen_dev(input0, "input", input0_input_handler),
    					listen_dev(select0, "blur", updatePIDCount, false, false, false),
    					listen_dev(select0, "change", select0_change_handler_1),
    					listen_dev(input1, "input", input1_input_handler_1),
    					listen_dev(select1, "change", select1_change_handler_1),
    					listen_dev(input2, "input", input2_input_handler),
    					listen_dev(input3, "input", input3_input_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*alerts, pids*/ 40 && input0.value !== /*alert*/ ctx[36].message) {
    				set_input_value(input0, /*alert*/ ctx[36].message);
    			}

    			if (dirty[0] & /*pids, KE_PID*/ 24) {
    				each_value_4 = /*pids*/ ctx[3];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_4.length;
    			}

    			if (dirty[0] & /*id*/ 2 && select0_name_value !== (select0_name_value = "pid" + /*id*/ ctx[1])) {
    				attr_dev(select0, "name", select0_name_value);
    			}

    			if (dirty[0] & /*alerts, pids*/ 40) {
    				select_option(select0, /*alert*/ ctx[36].pid);
    			}

    			if (dirty[0] & /*alerts, pids*/ 40 && input1.value !== /*alert*/ ctx[36].value) {
    				set_input_value(input1, /*alert*/ ctx[36].value);
    			}

    			if (dirty[0] & /*alerts, pids*/ 40) {
    				select_option(select1, /*alert*/ ctx[36].op);
    			}

    			if (dirty[0] & /*alerts, pids*/ 40 && to_number(input2.value) !== /*alert*/ ctx[36].priority) {
    				set_input_value(input2, /*alert*/ ctx[36].priority);
    			}

    			if (dirty[0] & /*alerts, pids*/ 40 && input3.value !== /*alert*/ ctx[36].unit) {
    				set_input_value(input3, /*alert*/ ctx[36].unit);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(hr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(86:10) {#each alerts as alert}",
    		ctx
    	});

    	return block;
    }

    // (156:14) {#each pids as pid}
    function create_each_block_1$1(ctx) {
    	let option;

    	let t0_value = (/*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    	? /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    	: /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].name) + "";

    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*pid*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$4, 156, 14, 5807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*KE_PID, pids*/ 24 && t0_value !== (t0_value = (/*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    			? /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].shortName
    			: /*KE_PID*/ ctx[4][/*pid*/ ctx[33]].name) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*pids*/ 8 && option_value_value !== (option_value_value = /*pid*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(156:14) {#each pids as pid}",
    		ctx
    	});

    	return block;
    }

    // (173:14) {#each ['=', '>', '<', '>=', '<='] as op}
    function create_each_block$2(ctx) {
    	let option;
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(/*op*/ ctx[30]);
    			t1 = space();
    			option.__value = option_value_value = /*op*/ ctx[30];
    			option.value = option.__value;
    			add_location(option, file$4, 173, 14, 6509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(173:14) {#each ['=', '>', '<', '>=', '<='] as op}",
    		ctx
    	});

    	return block;
    }

    // (195:8) {#if id != 'new'}
    function create_if_block$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete view";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger btn-lg btn-block");
    			add_location(button, file$4, 195, 8, 7266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*deleteView*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(195:8) {#if id != 'new'}",
    		ctx
    	});

    	return block;
    }

    // (3:16)    <p>...waiting</p>   {:then}
    function create_pending_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "...waiting";
    			add_location(p, file$4, 3, 2, 48);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(3:16)    <p>...waiting</p>   {:then}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let notifications;
    	let t;
    	let await_block_anchor;
    	let promise_1;
    	let current;

    	notifications = new Notifications({
    			props: { actions: /*actions*/ ctx[0] },
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1
    	};

    	handle_promise(promise_1 = /*promise*/ ctx[7], info);

    	const block = {
    		c: function create() {
    			create_component(notifications.$$.fragment);
    			t = space();
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notifications, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const notifications_changes = {};
    			if (dirty[0] & /*actions*/ 1) notifications_changes.actions = /*actions*/ ctx[0];
    			notifications.$set(notifications_changes);

    			{
    				const child_ctx = ctx.slice();
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notifications, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function updatePIDCount() {
    	console.log("Chanigng PID");
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Edit", slots, []);
    	let { id } = $$props;
    	let { actions = [] } = $$props;
    	let view = {};
    	let constants = {};
    	let pids = [];
    	let KE_PID = {};
    	let alerts = [];
    	let dynamic = {};

    	if (id == "new") {
    		view.gauges = [{}, {}, {}];
    	}

    	async function getConfigs() {
    		const res = await fetch("/api/config", { method: "get" });
    		const data = await res.json();

    		if (res.ok) {
    			if (id == "new") {
    				constants = data.constants;
    				$$invalidate(4, KE_PID = constants.KE_PID);
    				$$invalidate(3, pids = Object.keys(KE_PID));
    				$$invalidate(2, view.id = "new", view);
    			} else {
    				$$invalidate(2, view = data.views[id]);
    				constants = data.constants;
    				$$invalidate(4, KE_PID = constants.KE_PID);
    				$$invalidate(3, pids = Object.keys(KE_PID));
    				$$invalidate(5, alerts = view.alerts);
    				$$invalidate(6, dynamic = view.dynamic);
    				$$invalidate(2, view.id = id, view);
    			}
    		} else {
    			throw new Error(data);
    		}
    	}

    	let promise = getConfigs();

    	function handleSubmit() {
    		fetch("/api/update", {
    			method: "POST",
    			mode: "cors",
    			credentials: "same-origin",
    			body: JSON.stringify(view, dynamic, alerts)
    		}).then(d => d.json()).then(d => {
    			if (id == "new" && d.res) {
    				navigate("/");
    			}

    			$$invalidate(0, actions = [d.message]);
    		});
    	}

    	function addAlert() {
    		$$invalidate(5, alerts = [
    			...alerts,
    			{
    				"message": "",
    				"op": "",
    				"priority": "",
    				"unit": "",
    				"value": ""
    			}
    		]);
    	}

    	function deleteAlert(delAlert) {
    		let tempArr = [];

    		alerts.forEach(alert => {
    			if (delAlert != alert) {
    				tempArr.push(alert);
    			}

    			$$invalidate(5, alerts = tempArr);
    		});
    	}

    	function deleteView() {
    		fetch("/api/delete", {
    			method: "POST",
    			mode: "cors",
    			credentials: "same-origin",
    			body: JSON.stringify(view)
    		}).then(d => d.json()).then(d => {
    			if (d.res) {
    				navigate("/");
    			}

    			$$invalidate(0, actions = [d.message]);
    		});
    	}

    	const writable_props = ["id", "actions"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Edit> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		view.name = this.value;
    		$$invalidate(2, view);
    	}

    	function select0_change_handler() {
    		view.background = select_value(this);
    		$$invalidate(2, view);
    	}

    	function select1_change_handler() {
    		view.theme = select_value(this);
    		$$invalidate(2, view);
    	}

    	function select_change_handler(i) {
    		view.gauges[i].pid = select_value(this);
    		$$invalidate(2, view);
    	}

    	const click_handler = alert => {
    		deleteAlert(alert);
    	};

    	function input0_input_handler(each_value_2, alert_index) {
    		each_value_2[alert_index].message = this.value;
    		$$invalidate(5, alerts);
    		$$invalidate(3, pids);
    	}

    	function select0_change_handler_1(each_value_2, alert_index) {
    		each_value_2[alert_index].pid = select_value(this);
    		$$invalidate(5, alerts);
    		$$invalidate(3, pids);
    	}

    	function input1_input_handler_1(each_value_2, alert_index) {
    		each_value_2[alert_index].value = this.value;
    		$$invalidate(5, alerts);
    		$$invalidate(3, pids);
    	}

    	function select1_change_handler_1(each_value_2, alert_index) {
    		each_value_2[alert_index].op = select_value(this);
    		$$invalidate(5, alerts);
    		$$invalidate(3, pids);
    	}

    	function input2_input_handler(each_value_2, alert_index) {
    		each_value_2[alert_index].priority = to_number(this.value);
    		$$invalidate(5, alerts);
    		$$invalidate(3, pids);
    	}

    	function input3_input_handler(each_value_2, alert_index) {
    		each_value_2[alert_index].unit = this.value;
    		$$invalidate(5, alerts);
    		$$invalidate(3, pids);
    	}

    	function select2_change_handler() {
    		dynamic.pid = select_value(this);
    		$$invalidate(6, dynamic);
    		$$invalidate(3, pids);
    	}

    	function input2_input_handler_1() {
    		dynamic.value = this.value;
    		$$invalidate(6, dynamic);
    		$$invalidate(3, pids);
    	}

    	function select3_change_handler() {
    		dynamic.op = select_value(this);
    		$$invalidate(6, dynamic);
    		$$invalidate(3, pids);
    	}

    	function input3_input_handler_1() {
    		dynamic.priority = to_number(this.value);
    		$$invalidate(6, dynamic);
    		$$invalidate(3, pids);
    	}

    	function input4_input_handler() {
    		dynamic.unit = this.value;
    		$$invalidate(6, dynamic);
    		$$invalidate(3, pids);
    	}

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	$$self.$capture_state = () => ({
    		navigate,
    		Notifications,
    		id,
    		actions,
    		view,
    		constants,
    		pids,
    		KE_PID,
    		alerts,
    		dynamic,
    		getConfigs,
    		promise,
    		handleSubmit,
    		addAlert,
    		updatePIDCount,
    		deleteAlert,
    		deleteView
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    		if ("view" in $$props) $$invalidate(2, view = $$props.view);
    		if ("constants" in $$props) constants = $$props.constants;
    		if ("pids" in $$props) $$invalidate(3, pids = $$props.pids);
    		if ("KE_PID" in $$props) $$invalidate(4, KE_PID = $$props.KE_PID);
    		if ("alerts" in $$props) $$invalidate(5, alerts = $$props.alerts);
    		if ("dynamic" in $$props) $$invalidate(6, dynamic = $$props.dynamic);
    		if ("promise" in $$props) $$invalidate(7, promise = $$props.promise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		actions,
    		id,
    		view,
    		pids,
    		KE_PID,
    		alerts,
    		dynamic,
    		promise,
    		handleSubmit,
    		addAlert,
    		deleteAlert,
    		deleteView,
    		input1_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		select_change_handler,
    		click_handler,
    		input0_input_handler,
    		select0_change_handler_1,
    		input1_input_handler_1,
    		select1_change_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		select2_change_handler,
    		input2_input_handler_1,
    		select3_change_handler,
    		input3_input_handler_1,
    		input4_input_handler
    	];
    }

    class Edit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { id: 1, actions: 0 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !("id" in props)) {
    			console_1.warn("<Edit> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error_1$1("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error_1$1("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get actions() {
    		throw new Error_1$1("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actions(value) {
    		throw new Error_1$1("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const authenticated = writable( true );

    /* src/pages/Login.svelte generated by Svelte v3.29.4 */
    const file$5 = "src/pages/Login.svelte";

    function create_fragment$7(ctx) {
    	let notifications;
    	let t0;
    	let form;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let h1;
    	let t3;
    	let div1;
    	let input0;
    	let t4;
    	let label0;
    	let t6;
    	let div2;
    	let input1;
    	let t7;
    	let label1;
    	let t9;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	notifications = new Notifications({
    			props: { actions: /*actions*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notifications.$$.fragment);
    			t0 = space();
    			form = element("form");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "Please sign in";
    			t3 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t4 = space();
    			label0 = element("label");
    			label0.textContent = "Username";
    			t6 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t7 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t9 = space();
    			button = element("button");
    			button.textContent = "Sign in";
    			if (img.src !== (img_src_value = "images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "72");
    			attr_dev(img, "height", "72");
    			add_location(img, file$5, 4, 4, 140);
    			attr_dev(h1, "class", "h3 mb-3 font-weight-normal");
    			add_location(h1, file$5, 5, 4, 202);
    			attr_dev(div0, "class", "text-center container");
    			add_location(div0, file$5, 3, 2, 100);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "username");
    			attr_dev(input0, "id", "Username");
    			attr_dev(input0, "class", "mb-2 form-control");
    			attr_dev(input0, "placeholder", "username");
    			input0.required = true;
    			add_location(input0, file$5, 9, 4, 308);
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$5, 10, 4, 442);
    			attr_dev(div1, "class", "form-label-group");
    			add_location(div1, file$5, 8, 2, 273);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "class", "mb-2 form-control");
    			attr_dev(input1, "placeholder", "Password");
    			input1.required = true;
    			add_location(input1, file$5, 14, 4, 528);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$5, 15, 4, 666);
    			attr_dev(div2, "class", "form-label-group");
    			add_location(div2, file$5, 13, 2, 493);
    			attr_dev(button, "class", "btn btn-lg btn-primary btn-block");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$5, 18, 2, 717);
    			attr_dev(form, "class", "form-signin");
    			add_location(form, file$5, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notifications, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(form, t3);
    			append_dev(form, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*username*/ ctx[1]);
    			append_dev(div1, t4);
    			append_dev(div1, label0);
    			append_dev(form, t6);
    			append_dev(form, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*password*/ ctx[2]);
    			append_dev(div2, t7);
    			append_dev(div2, label1);
    			append_dev(form, t9);
    			append_dev(form, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const notifications_changes = {};
    			if (dirty & /*actions*/ 1) notifications_changes.actions = /*actions*/ ctx[0];
    			notifications.$set(notifications_changes);

    			if (dirty & /*username*/ 2 && input0.value !== /*username*/ ctx[1]) {
    				set_input_value(input0, /*username*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				set_input_value(input1, /*password*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notifications, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $authenticated;
    	validate_store(authenticated, "authenticated");
    	component_subscribe($$self, authenticated, $$value => $$invalidate(6, $authenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Login", slots, []);
    	let { actions = [] } = $$props;
    	let username;
    	let password;

    	function handleSubmit(event) {
    		fetch("/api/authenticate", {
    			method: "POST",
    			mode: "cors",
    			credentials: "same-origin",
    			body: JSON.stringify({ username, password })
    		}).then(d => d.json()).then(d => {
    			if (d.res) {
    				set_store_value(authenticated, $authenticated = !$authenticated, $authenticated);
    			}

    			$$invalidate(0, actions = [d.message]);
    		});
    	}

    	const writable_props = ["actions"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(1, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	$$self.$$set = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	$$self.$capture_state = () => ({
    		Notifications,
    		authenticated,
    		actions,
    		username,
    		password,
    		handleSubmit,
    		$authenticated
    	});

    	$$self.$inject_state = $$props => {
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    		if ("username" in $$props) $$invalidate(1, username = $$props.username);
    		if ("password" in $$props) $$invalidate(2, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		actions,
    		username,
    		password,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { actions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get actions() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actions(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Nav.svelte generated by Svelte v3.29.4 */

    const file$6 = "src/components/Nav.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let nav;
    	let div1;
    	let a;
    	let t1;
    	let button;
    	let span;
    	let t2;
    	let div0;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			nav = element("nav");
    			div1 = element("div");
    			a = element("a");
    			a.textContent = "KE";
    			t1 = space();
    			button = element("button");
    			span = element("span");
    			t2 = space();
    			div0 = element("div");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "class", "navbar-brand");
    			attr_dev(a, "href", "/");
    			add_location(a, file$6, 3, 6, 147);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$6, 5, 8, 384);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-toggle", "collapse");
    			attr_dev(button, "data-target", "#navbarCollapse");
    			attr_dev(button, "aria-controls", "navbarCollapse");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file$6, 4, 6, 193);
    			attr_dev(ul, "class", "navbar-nav nav mr-auto mb-2 mb-md-0");
    			add_location(ul, file$6, 8, 8, 515);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarCollapse");
    			add_location(div0, file$6, 7, 6, 448);
    			attr_dev(div1, "class", "container-fluid");
    			add_location(div1, file$6, 2, 4, 111);
    			attr_dev(nav, "class", "navbar navbar-expand-md navbar-dark fixed-top bg-dark");
    			add_location(nav, file$6, 1, 2, 39);
    			attr_dev(div2, "class", "nav-scroller py-1 mb-2");
    			add_location(div2, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, nav);
    			append_dev(nav, div1);
    			append_dev(div1, a);
    			append_dev(div1, t1);
    			append_dev(div1, button);
    			append_dev(button, span);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.29.4 */
    const file$7 = "src/App.svelte";

    // (18:0) {:else}
    function create_else_block$2(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(18:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if $authenticated}
    function create_if_block$3(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(1:0) {#if $authenticated}",
    		ctx
    	});

    	return block;
    }

    // (5:6) <Link getProps="{getProps}" to="/">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(5:6) <Link getProps=\\\"{getProps}\\\" to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:6) <Link getProps="{getProps}" to="settings">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Settings");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(8:6) <Link getProps=\\\"{getProps}\\\" to=\\\"settings\\\">",
    		ctx
    	});

    	return block;
    }

    // (3:2) <NAV>
    function create_default_slot_2(ctx) {
    	let li0;
    	let link0;
    	let t;
    	let li1;
    	let link1;
    	let current;

    	link0 = new Link({
    			props: {
    				getProps,
    				to: "/",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				getProps,
    				to: "settings",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			attr_dev(li0, "class", "nav-item nav-link");
    			add_location(li0, file$7, 3, 4, 54);
    			attr_dev(li1, "class", "nav-item nav-link");
    			add_location(li1, file$7, 6, 4, 152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			mount_component(link0, li0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, li1, anchor);
    			mount_component(link1, li1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			destroy_component(link0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(li1);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(3:2) <NAV>",
    		ctx
    	});

    	return block;
    }

    // (15:4) <Route path="/">
    function create_default_slot_1$1(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(15:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (2:0) <Router url="{url}">
    function create_default_slot$1(ctx) {
    	let nav;
    	let t0;
    	let div;
    	let route0;
    	let t1;
    	let route1;
    	let t2;
    	let route2;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: { path: "edit/:id", component: Edit },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "settings", component: Settings },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			t2 = space();
    			create_component(route2.$$.fragment);
    			add_location(div, file$7, 11, 2, 269);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t1);
    			mount_component(route1, div, null);
    			append_dev(div, t2);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(2:0) <Router url=\\\"{url}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$authenticated*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    	return { class: "nav-link" };
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $authenticated;
    	validate_store(authenticated, "authenticated");
    	component_subscribe($$self, authenticated, $$value => $$invalidate(1, $authenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Route,
    		Home,
    		Settings,
    		Edit,
    		Login,
    		NAV: Nav,
    		authenticated,
    		url,
    		getProps,
    		$authenticated
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, $authenticated];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
