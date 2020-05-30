<script>
    import Tailwindcss from './Tailwindcss.svelte';
    import { Router, Link, Route } from "svelte-routing";
    import Edit from './views/edit.svelte';
    import Config from './views/config.svelte';
    import Login from './views/login.svelte';
    import Loadable from "svelte-loadable";
    export let url = "";

    let Title = 'KE App';
</script>

<style>
    body {
        padding: 0px;
    }
    #pageContent {
        padding: 0px;
    }
</style>

<Tailwindcss />

<div id="pageContent" class="flex flex-col h-full">

    <Router url="{url}">
        <nav class="mb-8 p-4 w-full bg-gray-700">
            <ul class="flex">
                <li class="mr-6">
                    <Link to="/">Home</Link>
                </li>
            </ul>
        </nav>
        <div>
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
    </Router>

    <div class="flex-1 mx-auto">
        <div class="pb-4">
        </div>
    </div>
    <footer class="w-full text-center border-t border-grey p-4 pin-b text-gray-500 bg-gray-700 body-font">
        <p class="text-sm text-gray-600 sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0 mt-4">
            <a href="/" class="text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">KE Digital Dash</a>
        </p>
    </footer>
</div>
