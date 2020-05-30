<script>
    import { constants } from '../store.js';

    export let Name;
    export let Default;
</script>

<div class="relative">
    <select name={name} class="block truncate appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
        <option class:selected={typeof Default !== 'undefined'} value="">-</option>
    {#each Object.keys( $constants ) as pid}
        <option class:selected={pid == Default} value={pid}>
            {$constants[pid].shortName}
        </option>
    {/each}
    </select>
</div>
