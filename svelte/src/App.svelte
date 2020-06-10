<script>
    import Tailwindcss from './Tailwindcss.svelte';
    import { Router, Link, Route } from "svelte-routing";
    import Edit from './views/edit.svelte';
    import Config from './views/config.svelte';
    import Login from './views/login.svelte';
    import Loadable from "svelte-loadable";
    import { getConstants, getConfig } from './store.js';
    import Notifications from 'svelte-notifications';

    let promise   = getConfig();
    let constants = getConstants();

    export let url = "";
</script>

<Tailwindcss />

<Notifications>

    <div class="font-ubuntu text-grey-darkest leading-tight h-full bg-grey-lighter pb-4">
        <Router url="{url}">
            <div class="bg-grey-darker mb-8 py-4 px-12 pb-20">
                <nav class="container mx-auto flex items-center md:justify-between">
                    <div class="px-4 antialiased text-grey-dark hover:bg-grey-light text-base">
                        <Link to="/">Home</Link>
                    </div>
                    <div class="px-4 antialiased text-grey-dark text-1xl">
                        KE Digital Dash
                    </div>
                </nav>
            </div>

            <div id="page-content">
                <Route path="/" component="{Config}"></Route>
                <Route path="/view/:id" let:params component="{Edit}">
                    <Loadable loader={() => import("./views/edit.svelte")} id="{params.id}" />
                </Route>
                <Route path="/login">
                    <Loadable loader={() => import("./views/login.svelte")} />
                </Route>
            </div>
        </Router>
    </div>

    <footer class="antialiased text-grey-dark w-full justify-center text-center pin-b p-6 bg-grey-darker">
        <a href="/" class=" ml-1" target="_blank" rel="noopener noreferrer">KE Digital Dash</a>
    </footer>

</Notifications>
