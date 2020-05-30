<script>
    import Preview from '../components/Preview.svelte';
    import { config } from '../store.js';

    let viewsPromise = getConfig();
    async function getConfig() {
        const res = await fetch('http://localhost:3000/api/config');
        const conf = await res.json();

        config.set(conf.views);
        return conf.views;
    }
</script>

<div>
    <div class="text-red-400 text-lg">
        <h2>Digital Dash Configuration</h2>
    </div>
    <p>
        Configure the Digital Dash background, gauge styles,
        parameters, alerts and dynamic triggers.
    </p>

    <div class="py-4">
        {#await viewsPromise}
            <p>...Loading</p>
        {:then views}
            {#each Object.keys( views ) as id}
            <Preview view={views[id]} id={id} />
            {:else}
            <p>No configs found</p>
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
</div>
