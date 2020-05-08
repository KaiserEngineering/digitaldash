<script>
    import { onMount } from 'svelte';
    import List from './components/List.svelte';
    import Tailwindcss from './Tailwindcss.svelte';

    let viewsPromise = getConfig();

    async function getConfig() {
        const res    = await fetch(`http://localhost:3000/api/config`);
        const config = await res.json();

        if (res.ok) {
            return config.views;
        } else {
            throw new Error(config);
        }
    }
</script>


<Tailwindcss />

<main>
    {#await viewsPromise}
        <p>...Loading</p>
    {:then views}
        {#each views as view}
            <List {view}/>
        {/each}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>