<script>
    import Tailwindcss from './Tailwindcss.svelte';
    import { Router, Link, Route } from "svelte-routing";
    import Edit from './views/edit.svelte';
    import Config from './views/config.svelte';
    import Login from './views/login.svelte';
    import Loadable from "svelte-loadable";
    import { notifications, getConstants, getConfig } from './store.js';

    let constants_promise = getConstants();
    let config_promise    = getConfig();

    export let url = "";
</script>

<Tailwindcss />

<div class="font-sans bg-grey-lighter flex flex-col min-h-screen w-full">
    <div>
        <Router url="{url}">
            <div class="bg-blue-800 mb-8">
                <nav class="container mx-auto px-4">
                    <div class="flex items-center md:justify-between py-4">
                        <div class="w-1/4 md:hidden text-white">
                            <Link to="/">Home</Link>
                        </div>
                        <div class="w-1/2 md:w-auto text-center text-white text-2xl font-medium">
                            KE Digital Dash
                        </div>
                    </div>
                </nav>
            </div>


            {#each $notifications as notification}
            <div class="m-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">{notification}</strong>
            </div>
            {/each}

            {#await config_promise}
                <p>Loading config...</p>
            {:then}
            <div id="page-content">
                <Route path="/">
                    <Loadable loader={() => import("./views/config.svelte")} />
                </Route>
                <Route path="/view/:id" let:params>
                    <Loadable loader={() => import("./views/edit.svelte")} id="{params.id}" />
                </Route>
                <Route path="/login">
                    <Loadable loader={() => import("./views/login.svelte")} />
                </Route>
            </div>
            {/await}

        </Router>
    </div>


    <footer class="w-full text-center border-t border-grey p-4 pin-b text-white bg-blue-800 body-font">
        <a href="/" class=" ml-1" target="_blank" rel="noopener noreferrer">KE Digital Dash</a>
    </footer>

</div>