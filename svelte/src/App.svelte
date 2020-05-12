<script>
    import { onMount } from 'svelte';
    import Tailwindcss from './Tailwindcss.svelte';
    import router, { curRoute, redirectTo } from './router.js';

    onMount(() => {
        curRoute.set(window.location.pathname);
        if (!history.state) {
            window.history.replaceState({path: window.location.pathname}, '',
            window.location.href)
        }})

    function handlerBackNavigation(event){
        curRoute.set(event.state.path)
    }
</script>

<Tailwindcss />

<svelte:window on:popstate={handlerBackNavigation} on:redirect={redirectTo} />

<nav>
    <a on:click|preventDefault={redirectTo} href="/">Home</a>
</nav>

<div id="pageContent">
    <svelte:component this={router[$curRoute]} on:redirect={redirectTo}/>
</div>
