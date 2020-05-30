<script>
    import Preview from '../components/Preview.svelte';
    import { config, getConfig } from '../store.js';
</script>

<div class="text-grey max-w-xs mx-auto mb-6">
    Configure the Digital Dash background, gauge styles,
    parameters, alerts and dynamic triggers.
</div>

<div class="m-4">
    <button class="m-4 bg-blue-500 rounded-lg p-2" on:click="{getConfig}">Reload Config</button>
</div>

<div class="m-4">
    {#each Object.keys( $config ) as id}
        <Preview view={$config[id]} id={id} />
    {/each}
</div>
