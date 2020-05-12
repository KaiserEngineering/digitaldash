<script>
    import { beforeUpdate } from "svelte";
    export let view;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function redirectTo(event) {
        dispatch('redirect', {
            target: {pathname: '/view'}
        });
    }

    let gauge = './gauge.png';
</script>

<div on:click|preventDefault={redirectTo} class="flex content-center justify-between bg-white rounded flex-wrap">
    <div class="w-full text-black">
        {view.name}
    </div>
    <div class="w-1/2 text-center mt-12">
        <img src="{gauge}" alt="gauge">
    </div>

    <div class="justify-center text-center px-2 w-1/2">
        {#each view.pids as PID}
        <div class="mt-4 p-2 bg-red-400 break-all rounded">
            {PID}
        </div>
        {/each}
    </div>
</div>
