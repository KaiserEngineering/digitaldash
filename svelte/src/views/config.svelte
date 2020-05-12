<script>
    import Preview from '../components/Preview.svelte';

    let viewsPromise = getConfig();

    async function getConfig() {
        const res = await fetch('http://localhost:3000/api/config');
        const config = await res.json();

        if (res.ok) {
            return config.views;
        } else {
            throw new Error(config);
        }
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
            {#each views as view}
            <Preview {view} on:redirect/>
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
</div>
