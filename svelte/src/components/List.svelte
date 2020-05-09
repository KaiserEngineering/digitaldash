<script>
    import { beforeUpdate } from "svelte";
    export let view;
</script>

<div>
    <p>Name: {view.name}</p>
    {#each view.gauges as gauge}
        <div class="gauge">
            <img {gauge} alt="nah" />
        </div>
    {/each}
</div>
